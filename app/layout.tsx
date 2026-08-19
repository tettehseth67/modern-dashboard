"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Users,
  BookOpen,
  FileText,
  UserSquare2,
  LayoutDashboard,
} from "lucide-react";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Observe the browser's current address path track layout
  const pathname = usePathname();

  // 2. Determine if the current screen viewport is sitting on the login page
  const isLoginPage = pathname?.startsWith("/login");

  // 🛡️ CONDITIONAL INTERFACE RENDER GATE:
  // If the user is on the login screen, render the form flat on the screen
  // with 100% full width and completely skip drawing the layout sidebar!
  if (isLoginPage) {
    return (
      <html lang="en" className="dark">
        <body className="bg-slate-900 text-slate-100 antialiased min-h-screen">
          <main className="w-full min-h-screen">{children}</main>
        </body>
      </html>
    );
  }

  // 🌟 REGULAR FULL DASHBOARD VIEWPORT (For /students, /courses, etc.)
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-900 text-slate-100 antialiased min-h-screen">
        <div className="flex flex-col md:flex-row min-h-screen w-full">
          {/* THE SIDEBAR NAVIGATION PANEL */}
          <aside className="w-full md:w-64 bg-slate-800 border-b md:border-b-0 md:border-r border-slate-700/80 p-4 md:p-6 flex flex-col md:justify-start justify-between shrink-0">
            <div className="flex items-center justify-between md:mb-8 border-b border-transparent md:border-slate-700/60 md:pb-4 pb-0">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                  <LayoutDashboard className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-bold text-sm text-slate-100 tracking-tight leading-none">
                    EduSuite
                  </h1>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider uppercase mt-1 inline-block">
                    v1.0 Core
                  </span>
                </div>
              </div>
            </div>

            <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible md:py-0 py-3 scrollbar-none">
              <Link
                href="/students"
                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 transition-all whitespace-nowrap"
              >
                <Users className="w-4 h-4 text-slate-400" />
                <span>Student Roster</span>
              </Link>
              <Link
                href="/courses"
                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 transition-all whitespace-nowrap"
              >
                <BookOpen className="w-4 h-4 text-slate-400" />
                <span>Course Track</span>
              </Link>
              <Link
                href="/teachers"
                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 transition-all whitespace-nowrap"
              >
                <UserSquare2 className="w-4 h-4 text-slate-400" />
                <span>Faculty Catalog</span>
              </Link>
              <Link
                href="/invoices"
                className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 transition-all whitespace-nowrap"
              >
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Financial Ledger</span>
              </Link>
            </nav>
          </aside>

          {/* CONTENT ROUTE VIEWPORT */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
