import { createHmac } from 'crypto';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minute

// IP-ul se păstrează doar ca hash, nu în clar
export function loginAttemptKey(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  return createHmac('sha256', process.env.SUPABASE_SERVICE_ROLE_KEY!).update(ip).digest('hex');
}

// Înregistrează încercarea ÎNAINTE de verificarea parolei, ca cererile paralele să fie numărate.
// Aruncă eroare dacă baza nu răspunde: login-ul se blochează în loc să rămână nelimitat.
export async function registerLoginAttempt(key: string) {
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();

  await supabaseAdmin.from('admin_login_attempts').delete().lt('created_at', windowStart);

  const { error: insertError } = await supabaseAdmin
    .from('admin_login_attempts')
    .insert({ ip_hash: key });
  if (insertError) throw insertError;

  const { count, error: countError } = await supabaseAdmin
    .from('admin_login_attempts')
    .select('id', { count: 'exact', head: true })
    .eq('ip_hash', key)
    .gte('created_at', windowStart);
  if (countError) throw countError;

  return (count ?? 0) <= MAX_ATTEMPTS;
}

export async function clearLoginAttempts(key: string) {
  await supabaseAdmin.from('admin_login_attempts').delete().eq('ip_hash', key);
}
