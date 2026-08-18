"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/utils/supabase"
import Link from "next/link"
import { User, BookOpen, ArrowLeft, Mail, ShieldCheck, AlertCircle } from "lucide-react"

export default function StudentProfilePage() {
    // 1. Grab the reactive unwrapped parameter object hook layout from Next.js 15
    const params = useParams();

    const [student, setStudent] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    // 2. FIXED: Pull the ID straight out of the hook parameters safely
    const studentId = params?.id;

    // Asynchronous Nested Relational Database Fetcher
    const fetchStudentProfileData = async (id: string) => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("students")
                .select(
                    `
                    id,
                    name,
                    email,
                    status,
                    enrollments (
                        id,
                        courses (
                        id,
                        title,
                        department
                        )
                    )
                `,
                )
                .eq("id", id) // Match against the verified dynamic ID parameter
                .maybeSingle();

            if (error) throw error;
            setStudent(data);
        } catch (err) {
            console.error("Error fetching relational profile data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    // 3. FIXED: Watch the dynamic parameter change to trigger your cloud fetch
    useEffect(() => {
        if (studentId) {
            fetchStudentProfileData(studentId as string);
        }
    }, [studentId]);

    if (isLoading) {
        return (
            <div className="p-12 text-center text-sm text-slate-400 flex items-center justify-center gap-3 min-h-screen bg-slate-900">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Compiling nested relational student structures...
            </div>
        );
    }

    if (!student) {
        return (
            <div className="p-12 text-center text-sm text-slate-500 bg-slate-900 min-h-screen flex flex-col items-center justify-center gap-2">
                <AlertCircle className="w-6 h-6 text-slate-600" />
                No active registry profile matches student ID index:{" "}
                <span className="font-mono text-rose-400 font-bold">{studentId}</span>
                <Link
                    href="/students"
                    className="mt-4 text-xs text-blue-400 hover:underline flex items-center gap-1"
                >
                    <ArrowLeft className="w-3 h-3" /> Return to Student Roster
                </Link>
            </div>
        );
    }

    return (
        <div className="p-6 bg-slate-900 min-h-screen space-y-8">
            {/* Navigation Layer Row */}
            <div>
                <Link
                    href="/students"
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1 mb-4"
                >
                    <ArrowLeft className="w-3 h-3" /> Back to Student Grid Roster
                </Link>
            </div>

            {/* Main Identity Profile Master Card Layout */}
            <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-6 max-w-4xl">
                <div className="w-20 h-20 bg-blue-600/20 border-2 border-blue-500/30 rounded-full flex items-center justify-center text-blue-400">
                    <User className="w-10 h-10" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-1">
                    <span className="font-mono text-xs font-bold text-slate-500 tracking-wider uppercase">
                        {student.id}
                    </span>
                    <h1 className="text-2xl font-bold text-slate-100 leading-tight">
                        {student.name || "Anonymous Registry Item"}
                    </h1>
                    <p className="text-sm text-slate-400 flex items-center justify-center md:justify-start gap-1.5 pt-0.5">
                        <Mail className="w-3.5 h-3.5 text-slate-500" /> {student.email}
                    </p>
                </div>
                <div>
                    <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${student.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                    >
                        <ShieldCheck className="w-3.5 h-3.5" /> Account status:{" "}
                        {student.status}
                    </span>
                </div>
            </div>

            {/* Relational Course Track Block List Panel */}
            <div className="max-w-4xl space-y-4">
                <div className="border-b border-slate-800 pb-3">
                    <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-400" /> Registered Course
                        Tracks
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Dynamic matrix records extracted from relational middleman table
                        constraints.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {student.enrollments && student.enrollments.length > 0 ? (
                        student.enrollments.map((enrollment: any) => {
                            const course = enrollment.courses;
                            if (!course) return null;

                            return (
                                <div
                                    key={enrollment.id}
                                    className="bg-slate-800 border border-slate-700/80 p-5 rounded-xl shadow-lg hover:border-slate-600 transition-colors flex flex-col justify-between space-y-3"
                                >
                                    <div>
                                        <span className="font-mono text-[10px] font-bold text-blue-400 tracking-wider uppercase bg-blue-500/5 px-2 py-0.5 rounded border border-blue-500/10">
                                            {course.id}
                                        </span>
                                        <h3 className="text-sm font-semibold text-slate-200 mt-2 leading-snug">
                                            {course.title}
                                        </h3>
                                    </div>
                                    <div className="pt-2 border-t border-slate-700/40 flex justify-between items-center text-xs">
                                        <span className="text-slate-400">Division Segment:</span>
                                        <span className="text-slate-300 font-medium px-2 py-0.5 bg-slate-700 rounded border border-slate-600">
                                            {course.department}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-2 bg-slate-800/40 border border-dashed border-slate-700 p-8 rounded-xl text-center text-sm text-slate-500 flex flex-col items-center gap-1.5">
                            <BookOpen className="w-5 h-5 text-slate-600" />
                            <span>
                                This student is not assigned to any live academic course track
                                rosters.
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
