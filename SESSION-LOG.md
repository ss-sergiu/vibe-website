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
