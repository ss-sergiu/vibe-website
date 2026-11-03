import { createHmac, timingSafeEqual } from 'crypto';

// Tokenul leagă linkul de o singură rezervare, ca ID-urile să nu poată fi parcurse
export function createCalendarToken(id: string) {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY lipsește din env.');
  return createHmac('sha256', `calendar:${key}`).update(id).digest('hex').slice(0, 32);
}

export function isValidCalendarToken(id: string, token: unknown) {
  if (typeof token !== 'string') return false;
  const actual = Buffer.from(token);
  const expected = Buffer.from(createCalendarToken(id));
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}
