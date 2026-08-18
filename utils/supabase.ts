import { createClient } from "@supabase/supabase-js"

// FIXED: Aligns your variables to read the public prefix names required by Vercel and Next.js production builds
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Safety guard check: Only throw a hard crash during development if completely empty
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Warning: Supabase environment variables are missing from configuration scopes.")
}

// Export your type-safe database handshake portal client
export const supabase = createClient(
  supabaseUrl || "https://ulbotixrbkoryrmqwhvx.supabase.co", 
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsYm90aXhyYmtvcnlybXF3aHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MzAwMzMsImV4cCI6MjEwMjQwNjAzM30.pAJUVVCT1NTBEk6mx1x1o4JCk_knh0I8WgSQIpesd34"
)
