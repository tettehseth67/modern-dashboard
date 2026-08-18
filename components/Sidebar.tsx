"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname()
    return (
        <aside className="w-full md:w-64 bg-slate-800 border-b md:border-b-0 md:border-r border-slate-700/80 p-4 md:p-6 flex flex-col md:justify-start justify-between shrink-0">
            {/* Top Identity Branding Badge */}
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
            {/* Navigation Layout List */}
            <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible md:py-0 py-3 scrollbar-none">
                <Link
                    href="/"
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all font-medium block ${pathname === "/"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                            : "text-slate-400 hover:text-white hover:bg-slate-700/40"
                        }`}
                >
                    Dashboard Overview
                </Link>
                <Link
                    href="/students"
                    className={`w-full text-left px-4 py-2.5 rounded-lg transition-all block font-medium ${pathname === "/students"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                            : "text-slate-400 hover:text-white hover:bg-slate-700/40"
                        }`}
                >
                    Student Roster
                </Link>

                <Link
                    href="/courses"
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all block ${pathname === "/courses"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                            : "text-slate-400 hover:text-white hover:bg-slate-700/40"
                        }`}
                >
                    Course Management
                </Link>
                <Link
                    href="/teachers"
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all block ${pathname === "/teachers"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                            : "text-slate-400 hover:text-white hover:bg-slate-700/40"
                        }`}
                >
                    Teacher 
                </Link>
                <Link
                    href="/invoices"
                    className={`w-full text-left px-4 py-2.5 rounded-lg font-medium transition-all block ${pathname === "/invoices"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-600/10"
                            : "text-slate-400 hover:text-white hover:bg-slate-700/40"
                        }`}
                >
                    Financial Ledger
                </Link>
            </nav>

            {/* Workspace Footer Block */}
            <div className="pt-4 border-t border-slate-700 text-sm text-slate-400">
                Logged in as Operator
            </div>
        </aside>
    );
}
