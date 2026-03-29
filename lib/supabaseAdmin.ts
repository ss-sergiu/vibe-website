import { createClient } from '@supabase/supabase-js';

// Client cu service role — bypass RLS, doar pentru server
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
