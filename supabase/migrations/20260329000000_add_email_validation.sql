-- Șterge rândurile cu email invalid (date de test) înainte de a adăuga constrângerea
DELETE FROM rezervari
WHERE email !~ '^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$';

-- Adaugă validare format email la nivel de bază de date
ALTER TABLE rezervari
  ADD CONSTRAINT email_format_check
  CHECK (email ~ '^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$');
