"use client";

import Link from "next/link";
import {
    Users,
    BookOpen,
    FileText,
    UserSquare2,
    LayoutDashboard,
    Calendar,
} from "lucide-react";

export default function OpenDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // 🌟 ZERO SECURITY CHECKS: Draws the sidebar layout instantly for everyone!
    return (
        <div className="flex flex-col md:flex-row min-h-screen w-full bg-slate-900 text-slate-100">
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
                        href="/dashboard"
                        className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 transition-all whitespace-nowrap"
                    >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        <span>Overview Center</span>
                    </Link>
                    <Link
                        href="/students"
                        className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 transition-all whitespace-nowrap"
                    >
                        <Users className="w-4 h-4 text-slate-400" />
                        <span>Student Roster</span>
                    </Link>
                    <Link
                        href="/attendance"
                        className="flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg text-slate-300 hover:text-slate-100 hover:bg-slate-700/50 transition-all whitespace-nowrap"
                    >
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span>Daily Attendance</span>
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

            {/* CONTENT ROUTE VIEWPORT CONTAINER */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-7xl mx-auto">
                {children}
            </main>
        </div>
    );
}
