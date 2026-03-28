Rulează următoarele acțiuni pentru a face commit la modificările curente:

1. Rulează `git status` și afișează lista de fișiere modificate, staged sau untracked.
   - Dacă nu există nicio modificare, afișează mesajul **"Nu sunt modificări de salvat."** și oprește-te aici.

2. Întreabă utilizatorul: **"Ce fișiere vrei să incluzi în commit? (scrie 'toate' sau listează fișierele)"**
   - Dacă răspunde "toate", folosește `git add .`
   - Dacă listează fișiere specifice, folosește `git add <fisier1> <fisier2> ...`

3. Analizează modificările din fișierele selectate și propune un mesaj de commit în formatul:
   ```
   <tip>: <descriere scurtă în engleză>
   ```
   Tipuri disponibile:
   - `feat` — funcționalitate nouă
   - `fix` — reparare bug
   - `chore` — configurări, dependențe, fișiere auxiliare
   - `refactor` — restructurare cod fără schimbare de funcționalitate
   - `docs` — documentație
   - `style` — modificări vizuale / CSS
   - `test` — teste

   Întreabă: **"Mesajul propus este: `<tip>: <descriere>`. Îl folosim sau vrei altul?"**
   - Dacă utilizatorul acceptă, folosește mesajul propus.
   - Dacă dă un mesaj alternativ, folosește-l pe acela.

4. Execută commit-ul cu mesajul final, adăugând întotdeauna la sfârșit:
   ```
   Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
   ```

5. Confirmă succesul afișând:
   - Hash-ul scurt al commit-ului
   - Mesajul de commit
   - Lista fișierelor incluse

   **NU face `git push` — commit-ul rămâne doar local.**
