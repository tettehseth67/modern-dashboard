"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function Sidebar() {
    const pathname = usePathname()
    return (
        <aside className="w-64 min-h-screen bg-slate-800 border-r border-slate-700 p-6 flex flex-col text-slate-300">
            {/* Dashboard Bran Header */}
            <div className="mb-8">
                <h2 className="text-xl font-bold text-white tracking-tight">
                    Admin Portal
                </h2>
                <span className="text-xs text-blue-400 font-medium">
                    v1.0 Basline
                </span>
            </div>
            {/* Navigation Layout List */}
            <nav className="flex-1 space-y-2">
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
                    Invoices
                </Link>
            </nav>

            {/* Workspace Footer Block */}
            <div className="pt-4 border-t border-slate-700 text-sm text-slate-400">
                Logged in as Operator
            </div>
        </aside>
    );
}
