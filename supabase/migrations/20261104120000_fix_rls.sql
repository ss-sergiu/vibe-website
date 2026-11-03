-- Închide accesul direct la date prin cheia anon.
-- Toate scrierile și citirea rezervărilor trec prin rutele API, cu service role (care ocolește RLS).
-- IMPORTANT: se aplică DUPĂ deploy-ul codului care folosește supabaseAdmin.

-- Șterge policy-urile existente, ca starea finală să fie exact cea de mai jos
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT tablename, policyname FROM pg_policies
    WHERE schemaname = 'public' AND tablename IN ('produse', 'categorii', 'rezervari')
  LOOP
    EXECUTE format('DROP POLICY %I ON public.%I', p.policyname, p.tablename);
  END LOOP;
END $$;

ALTER TABLE public.produse   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorii ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rezervari ENABLE ROW LEVEL SECURITY;

-- Meniul e public: doar citire
CREATE POLICY "public_read" ON public.produse   FOR SELECT USING (true);
CREATE POLICY "public_read" ON public.categorii FOR SELECT USING (true);

-- rezervari: fără policy-uri = anon nu are niciun acces (date personale)
