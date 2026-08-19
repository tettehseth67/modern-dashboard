import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
    const currentUrlPath = request.nextUrl.pathname

    // 1. FAST PASS ROAD: Always let login pages and backend n8n API handlers pass instantly
    if (
        currentUrlPath.startsWith("/login") ||
        currentUrlPath.startsWith("/api/save-panel") ||
        currentUrlPath.includes("webhook")
    ) {
        return NextResponse.next()
    }

    // 2. Initialize a fast, direct server-side connection client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || "https://supabase.co",
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsYm90aXhyYmtvcnlybXF3aHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MzAwMzMsImV4cCI6MjEwMjQwNjAzM30.pAJUVVCT1NTBEk6mx1x1o4JCk_knh0I8WgSQIpesd34"
    )

    // 3. Extract the raw session chunk from the basic browser cookies pool
    // This bypasses the heavy @supabase/ssr cookie manager completely!
    const authCookieName = `sb-${new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname.split('.')[0]}-auth-token`
    const tokenSession = request.cookies.get(authCookieName)?.value

    // 🛡️ SECURITY SHIELD GATE:
    // If no auth token session is present in the browser data banks,
    // bounce them straight to the entry gate.
    if (!tokenSession) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
