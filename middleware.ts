import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(request: NextRequest) {
    // 1. Initialize an independent server response pipeline object block
    const response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // 2. Establish a background server-side handshake with your Supabase Auth layer
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ulbotixrbkoryrmqwhvx.supabase.co"
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsYm90aXhyYmtvcnlybXF3aHZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4MzAwMzMsImV4cCI6MjEwMjQwNjAzM30.pAJUVVCT1NTBEk6mx1x1o4JCk_knh0I8WgSQIpesd34"

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll().map((cookie) => ({
                        name: cookie.name,
                        value: cookie.value,
                    }))
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set({ name, value, ...options })
                    )
                },
            },
        }
    )

    // 3. Extract the active user authentication session directly from the secure browser cookies
    const {
        data: { user },
    } = await supabase.auth.getUser()

    const currentUrlPath = request.nextUrl.pathname

    // 🛡️ SECURITY FILTER GATE A: 
    // We explicitly add checks to let '/login', your local assets, AND your automation 
    // file writer routes bypass the gate completely without needing an active cookie!
    if (
        !user &&
        !currentUrlPath.startsWith("/login") &&
        !currentUrlPath.startsWith("/api/save-panel") &&
        !currentUrlPath.includes("webhook")
    ) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    // 🛡️ SECURITY FILTER GATE B: 
    // If an already logged-in user tries to manually navigate back to the login screen,
    // intercept them and send them straight back to the workspace dashboard homepage!
    if (user && currentUrlPath.startsWith("/login")) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    return response
}

// 📐 THE MATCHING CONFIGURATION SHIELD FILTER:
// Tells Next.js to intercept absolutely all sub-pages, while ignoring 
// background static asset assets, images, and next framework engine files.
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
}
