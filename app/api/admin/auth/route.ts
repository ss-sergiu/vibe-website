import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  ADMIN_SESSION_SECONDS,
  createSessionToken,
  isAdmin,
  verifyPassword,
} from '@/lib/adminAuth';
import { clearLoginAttempts, loginAttemptKey, registerLoginAttempt } from '@/lib/loginRateLimit';

export async function GET() {
  return NextResponse.json({ ok: await isAdmin() });
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const key = loginAttemptKey(request);

  try {
    if (!(await registerLoginAttempt(key))) {
      return NextResponse.json({ ok: false }, { status: 429 });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ ok: false }, { status: 503 });
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  await clearLoginAttempts(key);

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
