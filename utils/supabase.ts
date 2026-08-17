import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Safety guard check: Throw a clean warning if keys are missing from .env.local
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables inside .env.local file")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
