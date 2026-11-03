-- Încercări de login în admin, pentru limitarea pe IP.
-- IMPORTANT: se aplică ÎNAINTE de deploy-ul codului care folosește tabelul.
CREATE TABLE public.admin_login_attempts (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip_hash    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX admin_login_attempts_ip_created_idx
  ON public.admin_login_attempts (ip_hash, created_at);

-- Fără policy-uri: accesibil doar cu service role
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;
