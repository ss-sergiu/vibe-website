/**
 * email-typos.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Baza de date cu typo-uri de email și domenii cunoscute.
 *
 * CUM SĂ ADAUGI UN TYPO NOU:
 *   În obiectul TYPOS_CUNOSCUTE, adaugă:
 *     'greseala.com': 'corect.com',
 *
 * CUM SĂ ADAUGI UN DOMENIU VALID NOU (pentru fuzzy matching):
 *   Adaugă în lista DOMENII_CORECTE.
 * ──────────────────────────────────────────────────────────────────────────────
 */

// ─── Domenii corecte (pentru fuzzy matching Levenshtein) ──────────────────────
export const DOMENII_CORECTE: string[] = [
  'gmail.com',
  'yahoo.com',
  'yahoo.ro',
  'hotmail.com',
  'hotmail.ro',
  'outlook.com',
  'outlook.ro',
  'icloud.com',
  'me.com',
  'mac.com',
  'mail.ru',
  'yandex.com',
  'yandex.ru',
  'protonmail.com',
  'proton.me',
  'live.com',
  'msn.com',
  'googlemail.com',
  'mail.md',
  'inbox.ru',
];

// ─── Typo-uri cunoscute explicit ──────────────────────────────────────────────
// Adaugă oricând o nouă linie: 'greseala.com': 'corect.com',
export const TYPOS_CUNOSCUTE: Record<string, string> = {
  // ── Gmail ──
  'gimail.com':    'gmail.com',
  'gmal.com':      'gmail.com',
  'gmial.com':     'gmail.com',
  'gmaill.com':    'gmail.com',
  'gamil.com':     'gmail.com',
  'gmai.com':      'gmail.com',
  'gmali.com':     'gmail.com',
  'gmail.ru':      'gmail.com',
  'gmail.con':     'gmail.com',
  'gmail.ocm':     'gmail.com',
  'gmail.cmo':     'gmail.com',
  'gmail.ro':      'gmail.com',
  'gmail.net':     'gmail.com',
  'gmail.org':     'gmail.com',
  'gmaill.con':    'gmail.com',

  // ── Yahoo ──
  'yahooo.com':    'yahoo.com',
  'yaho.com':      'yahoo.com',
  'yhoo.com':      'yahoo.com',
  'yaoho.com':     'yahoo.com',
  'yahoo.con':     'yahoo.com',
  'yahoo.ocm':     'yahoo.com',
  'yahooo.ro':     'yahoo.ro',
  'yahoo.coM':     'yahoo.com',

  // ── Hotmail ──
  'hotmial.com':   'hotmail.com',
  'hotamil.com':   'hotmail.com',
  'hotmail.con':   'hotmail.com',
  'hotmaill.com':  'hotmail.com',
  'htomail.com':   'hotmail.com',

  // ── Outlook ──
  'outlok.com':    'outlook.com',
  'outllook.com':  'outlook.com',
  'outlook.con':   'outlook.com',
  'outlookk.com':  'outlook.com',
  'otulook.com':   'outlook.com',

  // ── iCloud ──
  'iclaud.com':    'icloud.com',
  'aiclaud.com':   'icloud.com',
  'aicloud.com':   'icloud.com',
  'icloud.con':    'icloud.com',
  'icoud.com':     'icloud.com',
  'iclould.com':   'icloud.com',
  'icolud.com':    'icloud.com',

  // ── Mail.ru ──
  'mail.con':      'mail.ru',
  'mial.ru':       'mail.ru',

  // ── TLD generice greșite ──
  'gmail.vom':     'gmail.com',
  'yahoo.vom':     'yahoo.com',
  'hotmail.vom':   'hotmail.com',
  'outlook.vom':   'outlook.com',
};

// ─── Levenshtein distance ─────────────────────────────────────────────────────
function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

// ─── Funcție principală ───────────────────────────────────────────────────────
/**
 * Returnează sugestia corectă pentru un email cu typo, sau null dacă e ok.
 * Ex: suggestEmailCorrection('ion@gmial.com') → 'ion@gmail.com'
 */
export function suggestEmailCorrection(email: string): string | null {
  const atIdx = email.lastIndexOf('@');
  if (atIdx < 1) return null;

  const local = email.slice(0, atIdx);
  const domain = email.slice(atIdx + 1).toLowerCase().trim();

  if (!domain.includes('.')) return null;

  // 1. Verifică typo-uri explicite
  if (TYPOS_CUNOSCUTE[domain]) {
    return `${local}@${TYPOS_CUNOSCUTE[domain]}`;
  }

  // 2. Dacă domeniul e deja corect, nu sugera nimic
  if (DOMENII_CORECTE.includes(domain)) return null;

  // 3. Fuzzy matching — caută cel mai apropiat domeniu cunoscut
  let bestDomain = '';
  let bestDist = Infinity;
  for (const known of DOMENII_CORECTE) {
    const dist = levenshtein(domain, known);
    if (dist < bestDist) { bestDist = dist; bestDomain = known; }
  }

  // Sugerează doar dacă distanța e ≤ 2 (1-2 caractere diferite)
  if (bestDist <= 2 && bestDomain) {
    return `${local}@${bestDomain}`;
  }

  return null;
}
