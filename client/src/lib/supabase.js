import { createClient } from '@supabase/supabase-js'

// DECISION: Using anon key in client — RLS policies on balloons table provide
// the security boundary. Service role key stays server-only.
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default supabase
