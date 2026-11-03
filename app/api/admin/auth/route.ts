import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  createSessionToken,
  isAdmin,
  verifyPassword,
} from '@/lib/adminAuth';

export async function GET() {
  return NextResponse.json({ ok: await isAdmin() });
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!verifyPassword(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: ADMIN_SESSION_SECONDS,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}
