-- Tabel rezervări Vibe Caffè
CREATE TABLE rezervari (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nume        TEXT NOT NULL,
  email       TEXT NOT NULL,
  telefon     TEXT NOT NULL,
  nr_persoane INTEGER NOT NULL DEFAULT 2,
  data_ora    TIMESTAMPTZ NOT NULL,
  status      TEXT NOT NULL DEFAULT 'în așteptare',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Activează Row Level Security
ALTER TABLE rezervari ENABLE ROW LEVEL SECURITY;

-- Oricine poate citi rezervări
CREATE POLICY "public_select" ON rezervari
  FOR SELECT USING (true);

-- Oricine poate adăuga o rezervare
CREATE POLICY "public_insert" ON rezervari
  FOR INSERT WITH CHECK (true);

-- Oricine poate modifica o rezervare
CREATE POLICY "public_update" ON rezervari
  FOR UPDATE USING (true);

-- Oricine poate șterge o rezervare
CREATE POLICY "public_delete" ON rezervari
  FOR DELETE USING (true);
