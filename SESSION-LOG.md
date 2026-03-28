## 29.03.2026 — Pagina de rezervări cu formular 3 pași

### Ce s-a făcut
- Creat API endpoint `POST /api/rezervari` pentru salvare în Supabase
- Adăugat `GET /api/rezervari` pentru citirea rezervărilor (cele mai noi primele)
- Construit pagina `/rezervari` cu formular în 3 pași: calendar, ore, detalii
- Calendar cu navigare pe luni, butoane rapide 14 zile, maxim 6 luni în viitor
- Ore disponibile 10:00–22:00 din 30 în 30 de minute
- Design aliniat cu restul site-ului: fundal crem, text brun, inversare la selectare
- Modal custom (React) de confirmare la navigare din pasul 3 — nu poate fi blocat de browser
- Adăugat buton „Rezervări" în navbar și pe Hero
- Fix navbar: linkuri absolute (`/#features` etc.) funcționează pe orice pagină

### Ce rămâne
- [ ] Email de confirmare la rezervare
- [ ] Panou de administrare rezervări
- [ ] Autentificare (dacă se dorește restricționarea RLS)

### Commits
- `ac3468d` feat: adaugă pagina de rezervări cu formular 3 pași și integrare Supabase

### Decizii importante
- Modal de navigare implementat ca React div (nu `window.confirm`) — nu poate fi blocat de ad-blockere
- Design pattern: neselectat = border brun + text brun, selectat = fundal brun + text crem (identic cu taburile din Meniu)

---

## 28.03.2026 — Integrare Supabase + Setup tooling

### Ce s-a făcut
- Instalat `@supabase/supabase-js` în proiect
- Instalat Supabase CLI v2.84.2 (via GitHub binary)
- Instalat Vercel CLI v50.37.3
- Creat proiect `vibe-caffe` pe Supabase (Frankfurt, Central EU)
- Creat și aplicat migrația tabelului `rezervari` cu RLS
- Configurat `lib/supabase.ts` și variabilele din `.env.local`
- Creat 4 comenzi custom Claude Code: `/start`, `/end`, `/commit`, `/push`

### Ce rămâne
- [ ] Formular de rezervări în frontend
- [ ] Email de confirmare la rezervare
- [ ] Panou de administrare rezervări
- [ ] Autentificare (dacă se dorește restricționarea RLS)

### Commits
- `d3fcf75` feat: adaugă integrare Supabase, tabel rezervări și comenzi custom Claude

### Decizii importante
- Supabase region: Frankfurt (cel mai aproape de România)
- RLS activat cu politici publice — oricine poate CRUD (poate fi restricționat ulterior cu auth)
- Comenzile custom `/commit` folosesc mesaje în română
