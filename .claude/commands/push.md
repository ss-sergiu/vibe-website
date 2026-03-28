Rulează următoarele acțiuni pentru a trimite commit-urile pe GitHub:

1. Verifică dacă există un remote configurat cu `git remote -v`.
   - Dacă nu există niciun remote, spune utilizatorului: **"Nu există un remote configurat."** și ajută-l să îl adauge:
     - Întreabă URL-ul repo-ului GitHub
     - Execută `git remote add origin <url>`
     - Continuă cu pașii următori.

2. Rulează `git status` și verifică dacă există fișiere modificate sau untracked (uncommitted changes).
   - Dacă există, avertizează: **"Ai modificări nesalvate care NU vor fi incluse în push. Vrei să rulezi /commit întâi?"**
     - Dacă da, oprește-te și spune-i să ruleze `/commit` mai întâi.
     - Dacă nu, continuă cu push-ul fără acele modificări.

3. Rulează `git log origin/<branch>..HEAD` (sau `git cherry -v` dacă nu există tracking) pentru a vedea commit-urile locale care nu sunt pe remote.
   - Dacă nu există commit-uri de trimis, afișează: **"Nu există commit-uri noi de trimis. Remote-ul este up to date."** și oprește-te.
   - Dacă există, afișează lista commit-urilor ce urmează să fie trimise (hash scurt + mesaj).

4. Identifică branch-ul curent cu `git branch --show-current`.

5. Cere confirmare: **"Urmează să trimiți [N] commit-uri pe branch `<branch>`. Confirmăm push-ul?"**
   - Dacă utilizatorul refuză, oprește-te fără a face nimic.
   - Dacă confirmă, continuă.

6. Execută push-ul:
   - Verifică dacă branch-ul există pe remote cu `git ls-remote --heads origin <branch>`.
   - Dacă NU există pe remote: `git push -u origin <branch>`
   - Dacă există deja: `git push origin <branch>`

7. Confirmă succesul afișând:
   - Branch-ul pe care s-a făcut push
   - Numărul de commit-uri trimise
   - Lista commit-urilor (hash scurt + mesaj)
   - Link-ul către repo (extrage URL-ul din `git remote get-url origin` și formatează-l ca link clickabil)
