"use client";

import Link from "next/link";
import {
    BookOpen,
    GraduationCap,
    ShieldCheck,
    ArrowRight,
    CheckCircle2,
    Landmark,
} from "lucide-react";

export default function PublicAcademyLandingPage() {
    return (
        <div className="bg-slate-900 text-slate-100 min-h-screen selection:bg-blue-500/30">
            {/* 🌐 MARKETING NAVIGATION BAR */}
            <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-blue-500" />
                        <span className="font-black tracking-tight text-lg">
                            EduSuite Academy
                        </span>
                    </div>
                    <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-slate-300">
                        <Link
                            href="#about"
                            className="hover:text-blue-400 transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            href="#academics"
                            className="hover:text-blue-400 transition-colors"
                        >
                            Academics
                        </Link>
                        <Link
                            href="#admissions"
                            className="hover:text-blue-400 transition-colors"
                        >
                            Tuition
                        </Link>
                    </nav>
                    <div>
                        <Link
                            href="/dashboard"
                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5"
                        >
                            Portal Login <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </header>

            {/* 🚀 HERO CALL-TO-ACTION SECTION */}
            <section className="max-w-5xl mx-auto px-6 py-20 lg:py-32 text-center space-y-6">
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold rounded-full uppercase tracking-wider font-mono">
                    Enrollment Open for Autumn 2026
                </span>
                <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-100 max-w-4xl mx-auto leading-none">
                    Cultivating Excellence Through Advanced Innovation
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-normal leading-relaxed">
                    Welcome to EduSuite Academy. We empower modern students with
                    foundational core curriculums, data-driven software mastery, and
                    industry-expert faculty guidance.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        href="#academics"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/15 text-sm transition-colors cursor-pointer"
                    >
                        Explore Academic Tracks
                    </Link>
                    <Link
                        href="/dashboard"
                        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-sm transition-colors"
                    >
                        Access Portal Gateway
                    </Link>
                </div>
            </section>

            {/* 📖 ACADEMICS SECTOR CARD GRID */}
            <section
                id="academics"
                className="max-w-7xl mx-auto px-6 py-16 border-t border-slate-800 space-y-12"
            >
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
                        Our Academic Divisions
                    </h2>
                    <p className="text-slate-400 text-sm max-w-xl mx-auto">
                        Explore high-demand career preparation tracks crafted by our
                        specialized staff instructors.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl space-y-4">
                        <div className="w-10 h-10 bg-blue-500/10 text-blue-400 rounded-xl flex items-center justify-center">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-200">
                            Computer Science
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Full-stack layout software engineering, active relational data
                            querying syntax, and system architecture parameters.
                        </p>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl space-y-4">
                        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                            <Landmark className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-200">
                            Business & Finance
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Macroeconomic balance sheet logic, transactional ledger
                            reconciliation workflows, and data-driven management models.
                        </p>
                    </div>
                    <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl space-y-4">
                        <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-200">
                            Data Infrastructure
                        </h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Cloud cluster provisioning management, server-side runtime
                            automation networks, and predictive model matrices.
                        </p>
                    </div>
                </div>
            </section>

            {/* 👥 ABOUT SECTION */}
            <section
                id="about"
                className="bg-slate-800/20 border-t border-b border-slate-800 py-16"
            >
                <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-100">
                        Our Shared Mission
                    </h2>
                    <p className="text-slate-400 text-md leading-relaxed font-normal">
                        Founded with a vision to eliminate technical and educational
                        barriers, EduSuite Academy provides modern, transparent learning
                        environments. We bridge the gap between classroom theory and
                        cloud-based industry applications, ensuring every graduate is
                        prepared to lead in tomorrows technology workforce.
                    </p>
                </div>
            </section>

            {/* 🏁 MARKETING FOOTER ELEMENT */}
            <footer className="py-8 text-center text-xs text-slate-600 font-mono">
                © 2026 EduSuite Academy Inc. All technical portal rights reserved.
            </footer>
        </div>
    );
}
