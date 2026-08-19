import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const currentUrlPath = request.nextUrl.pathname

    // 1. FAST PASS ROAD: Always let login portals and automated n8n routes pass instantly
    if (
        currentUrlPath.startsWith("/login") ||
        currentUrlPath.startsWith("/api/save-panel") ||
        currentUrlPath.includes("webhook")
    ) {
        return NextResponse.next()
    }

    // 2. PARSE THE HOSTNAME TO LOCATE THE EXCLUSIVELY TYPED COOKIE HEADER
    // Supabase saves cookie files locally using your project's unique reference ID token string.
    const supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://supabase.co"

    let projectId = "ulbotixrbkoryrmqwhvx" // clean fallback anchor
    try {
        const hostname = new URL(supabaseProjectUrl).hostname
        projectId = hostname.split(".")[0]
    } catch {
        // Falls back to your verified project ID string unhindered
    }

    // 3. TARGET THE EXACT COOKIE NAME PATTERN REQUIRED BY NEXT.JS AND SUPABASE AUTH
    const targetCookieName = `sb-${projectId}-auth-token`
    const activeSessionToken = request.cookies.get(targetCookieName)?.value

    // 🛡️ THE EDGE RUNTIME GATE:
    // If no auth token cookie session chunk is found in the browser records pool,
    // intercept the connection line and send them right back to the admin entryway!
    if (!activeSessionToken) {
        console.log("🔒 MIDDLEWARE INTERCEPT: Redirecting unauthenticated request to /login")
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

// Ensure the matcher ignores images, styles, and internal next asset engines
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
