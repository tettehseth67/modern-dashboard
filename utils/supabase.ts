import { createClient } from "@supabase/supabase-js"

// Hard default fallback strings bound directly to your verified cloud cluster architecture nodes
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ulbotixrbkoryrmqwhvx.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsYm90aXhyYmtvcnlybXF3aHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MzAwMzMsImV4cCI6MjEwMjQwNjAzM30.pAJUVVCT1NTBEk6mx1x1o4JCk_knh0I8WgSQIpesd34"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})
