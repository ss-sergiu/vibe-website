import { createHash, createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const ADMIN_COOKIE = 'admin_session';
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8; // 8 ore

// Cheia depinde de parolă: schimbarea ADMIN_PASSWORD invalidează toate sesiunile
function signingKey() {
  const password = process.env.ADMIN_PASSWORD;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!password || !serviceKey) return null;
  return `${password}:${serviceKey}`;
}

function sign(value: string, key: string) {
  return createHmac('sha256', key).update(value).digest('hex');
}

// Compară hash-uri de lungime egală, în timp constant
function safeEqual(a: string, b: string) {
  const hash = (s: string) => createHash('sha256').update(s).digest();
  return timingSafeEqual(hash(a), hash(b));
}

export function verifyPassword(password: unknown) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && typeof password === 'string' && safeEqual(password, expected!);
}

export function createSessionToken() {
  const key = signingKey();
  if (!key) throw new Error('ADMIN_PASSWORD sau SUPABASE_SERVICE_ROLE_KEY lipsește din env.');
  const expires = String(Date.now() + ADMIN_SESSION_SECONDS * 1000);
  return `${expires}.${sign(expires, key)}`;
}

function isValidToken(token: string | undefined) {
  const key = signingKey();
  if (!key || !token) return false;
  const [expires, signature] = token.split('.');
  if (!expires || !signature || !safeEqual(signature, sign(expires, key))) return false;
  return Number(expires) > Date.now();
}

export async function isAdmin() {
  const store = await cookies();
  return isValidToken(store.get(ADMIN_COOKIE)?.value);
}

// Întoarce un răspuns 401 dacă cererea nu are sesiune de admin validă
export async function requireAdmin() {
  if (await isAdmin()) return null;
  return NextResponse.json({ error: 'Neautorizat.' }, { status: 401 });
}
