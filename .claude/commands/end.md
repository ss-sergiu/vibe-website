Rulează următoarele acțiuni la sfârșitul sesiunii de lucru:

1. Rulează `git status` și verifică dacă există modificări nesalvate.
   - Dacă există fișiere modificate sau untracked, întreabă utilizatorul: **"Ai modificări nesalvate. Vrei să facem commit acum?"**
   - Dacă da, ajută-l să formuleze un mesaj de commit sugestiv bazat pe fișierele modificate, apoi fă commit-ul.
   - Dacă nu, continuă fără commit.

2. Citește `ROADMAP.md` dacă există:
   - Întreabă utilizatorul ce task-uri s-au terminat în această sesiune și marchează-le ca completate (ex: `- [x]`).
   - Întreabă dacă au apărut TODO-uri noi în sesiunea aceasta și adaugă-le în ROADMAP.md.
   - Salvează fișierul actualizat.
   - Dacă ROADMAP.md nu există, sari peste acest pas.

3. Construiește rezumatul sesiunii cu următorul format:

---
## [data în format ZZ.LL.AAAA] — [titlu scurt descriptiv al sesiunii, ex: "Integrare Supabase" sau "Fix navbar + hero"]

### Ce s-a făcut
- [item 1]
- [item 2]
- [...]

### Ce rămâne
- [ ] [task neîncheiat 1]
- [ ] [task neîncheiat 2]
- [ ] [...]

### Commits
- `[hash scurt]` [mesaj commit]
- `[hash scurt]` [mesaj commit]

### Decizii importante
- [decizie tehnică sau de design luată în această sesiune — doar dacă au existat]

---

4. Adaugă rezumatul la **începutul** fișierului `SESSION-LOG.md` (cele mai recente primele). Dacă fișierul nu există, creează-l. Păstrează tot conținutul anterior după intrarea nouă.

5. Afișează rezumatul complet și în chat.

6. La final întreabă: **"Vrei să notez altceva înainte să încheiem?"** și așteaptă răspunsul utilizatorului. Dacă răspunde cu ceva, adaugă nota respectivă în SESSION-LOG.md la intrarea curentă, sub o secțiune `### Note extra`.
