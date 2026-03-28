Rulează următoarele acțiuni la începutul sesiunii de lucru:

1. Citește fișierul `ROADMAP.md` dacă există — extrage toate task-urile marcate ca TODO, IN PROGRESS sau necompletate.

2. Citește `CLAUDE.md` din rădăcina proiectului pentru a-ți reaminti contextul specific al proiectului.

3. Rulează `git status` și notează fișierele modificate, nesalvate sau netracked.

4. Rulează `git log --oneline -5` și notează ultimele 5 commit-uri.

5. Afișează un rezumat formatat cu următoarele secțiuni:

---
## Sesiune de lucru — Vibe Caffè

### Ultimele modificări (git log)
[lista ultimelor 5 commits]

### Modificări nesalvate (git status)
[lista fișierelor modificate / untracked]

### TODO-uri active (din ROADMAP.md)
[lista task-urilor necompletate, sau "Niciun ROADMAP.md găsit" dacă fișierul nu există]

---

6. La final întreabă: **"Cu ce continuăm azi?"** și așteaptă direcția utilizatorului.
