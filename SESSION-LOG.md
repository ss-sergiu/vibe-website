## 29.03.2026 — Panou admin, emailuri Resend, calendar ICS

### Ce s-a făcut

**Panou administrare `/admin`**
- Pagină protejată cu parolă (server-side via `/api/admin/auth`, `ADMIN_PASSWORD` în env)
- Stats: Total / Așteptare / Confirmate / Respinse
- Filtre rapide pe status
- Tabel desktop + carduri mobile
- 3 butoane de status inline: **Așt. / Conf. / Resp.** — click = schimbare imediată
- Iconiță trash SVG pentru ștergere cu confirmare în 2 pași
- Sesiune păstrată în `sessionStorage`

**Emailuri via Resend**
- Instalat `resend`, configurat `RESEND_API_KEY` local + Vercel
- `lib/email.ts` — funcții `trimiteEmailRezervare` + `trimiteEmailStatus`
- La rezervare nouă: email cu detalii + mesaj „O să te anunțăm..."
- La schimbare status din admin: email cu statut + mesaj specific per status
  - Confirmată: „Te așteptăm cu drag" + buton **Adaugă în calendar**
  - Respinsă: text roșu-vișiniu + buton **Fă o altă rezervare**
  - În așteptare: fără buton
- Design email: header brun + body crem, colțuri rotunjite, fundal transparent
- Footer: „Vibe Caffè · București · str. Cafelei nr. 12"
- Timezone fix: `Europe/Bucharest` + `hour12: false` → ore corecte pe serverul Vercel (UTC)

**Calendar ICS** `/api/calendar/[id]`
- Descarcă `.ics` cu evenimentul rezervării (durata 1h)
- `VALARM` cu notificare 1 oră înainte
- Locație: str. Cafelei nr. 12, București

**Modificări formular rezervări**
- `autoComplete="name"` / `"email"` / `"tel-national"` pe câmpuri
- „Confirmă rezervarea" → „Finalizează rezervarea"
- „Rezervare confirmată!" → „Rezervare finalizată"
- Mesaj confirmare pe 3 rânduri fără ghilimele la nume
- Modal: „Nu ai finisat" → „Nu ai finalizat rezervarea!" (font mărit)
- Ora maximă: 22:00 scoasă, ultimul slot = **21:30** (24 sloturi)

**Supabase**
- Status „anulată" redenumit în „respinsă" via migrare
- `lib/supabaseAdmin.ts` — client cu service role pentru operații admin

### Commits
- `90f5f8e` feat: panou admin rezervări, emailuri Resend, calendar ICS și validări formular

### Decizii importante
- Parola admin: `vibe2026` (schimbabilă din `.env.local` → `ADMIN_PASSWORD`)
- Emailurile vin de la `onboarding@resend.dev` (fără domeniu verificat); pentru producție se verifică domeniul în Resend
- Timezone explicit în email pentru a evita decalajul UTC vs Romania

---

## 29.03.2026 — UX mobile pagina rezervări + validări formular

### Ce s-a făcut
- Adăugat font Plus Jakarta Sans via `next/font/google` — afișat consistent pe mobile și PC
- Validare email Supabase: migrare `CHECK constraint` pe coloana `email` în PostgreSQL
- Selector cod țară: scos flag emoji, afișat doar codul (ex: `+40`)
- Câmp telefon: format automat cu spații (XX XXX XXX pentru Moldova, XXX XXX XXX pentru restul)
- Limită max cifre: 8 pentru `+373`, 9 pentru restul — mesaj eroare „Introduceți X cifre"
- Limită max 35 caractere la câmpul Nume (silențios)
- Fix overflow câmp telefon pe mobile (`min-w-0` + `flex-shrink-0`)
- Padding responsiv pagina rezervări: `px-4 sm:px-6`, card `p-4 sm:p-8`
- Label-uri formular indentate cu `pl-1` față de chenar
- Fix confirmare rezervare: cardul nu mai e acoperit de navbar (`pt-28`)
- Mesaj eroare email actualizat: „Introduceți un email valid, ex: / ion@mail.com"
- Buton „Rezervă din nou" redenumit în „Fă o altă rezervare"
- Iconița de pe pagina de confirmare schimbată din ☕ în pin locație (SVG)
- Fix hover butoane rapide dată: adăugat `pt-2` ca să nu fie tăiat chenarul la scale
- Migrare Supabase aplicată: `20260329000000_add_email_validation.sql`

### Ce rămâne
- [ ] Email de confirmare la rezervare
- [ ] Panou de administrare rezervări
- [ ] Autentificare (dacă se dorește restricționarea RLS)

### Commits
- `cf54c70` fix: îmbunătățiri UX pagina rezervări, font Plus Jakarta Sans și validare email Supabase
- `d135e2e` style: îmbunătățiri mobile pe pagina rezervări — padding, flag scos din selector
- `bfbae75` style: indent label-uri formular rezervări pe mobile
- `44f2b8f` fix: câmp telefon nu mai iese din ecran pe mobile
- `09843b4` feat: validări formular rezervări — telefon, email, limită nume

### Decizii importante
- Font Plus Jakarta Sans self-hosted de Next.js (fără request extern la runtime)
- Validare telefon: doar la blur, mesaj discret fără a bloca progresul
- Overflow telefon rezolvat cu `min-w-0` pe `flex-1` input (pattern standard CSS flexbox)

---

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
