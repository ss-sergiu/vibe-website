-- Scoate toate policy-urile bucket-ului produse-imagini.
-- Imaginile rămân accesibile prin URL public, iar upload-ul trece prin service role.
-- Fără ele, nimeni nu mai poate lista sau încărca fișiere cu cheia anon.
DO $$
DECLARE p RECORD;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
      AND concat(qual, with_check) LIKE '%produse-imagini%'
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

-- Verificare: nu trebuie să mai apară niciun policy pentru acest bucket
SELECT policyname, cmd, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'storage' AND tablename = 'objects';
