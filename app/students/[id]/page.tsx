import { supabase } from "@/utils/supabase"; // Import our cloud database client bridge
import Link from "next/link";

interface ProfilePageProps {
    params: Promise<{ id: string }>;
}

export default async function StudentProfilePage({ params }: ProfilePageProps) {
    const resolvedParams = await params;
    const targetId = resolvedParams.id;

    let student = null;
    let databaseError = null;

    try {
        // Query our cloud 'students' table, filtering for the row that matches this exact URL ID
        const { data, error } = await supabase
            .from("students")
            .select("*")
            .eq("id", targetId)
            .single(); // Tells Postgres to return a single clean object instead of an array list

        if (error) throw error;
        if (data) student = data;
    } catch (err) {
        databaseError = err;
        console.error("Profile database query lookup failure:", err);
    }

    // Fallback state logic if a user manual types an invalid ID link or data fails to load
    if (!student) {
        return (
            <div className="text-center p-12 bg-slate-800 border border-slate-700 rounded-2xl max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-rose-400">
                    Profile Log Not Found
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                    The system identifier {targetId} could not be resolved from cloud
                    infrastructure pools.
                </p>
                <Link
                    href="/students"
                    className="mt-4 inline-block px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs font-medium transition-colors"
                >
                    Back to Registry
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Link
                href="/students"
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
            >
                ← Back to Student Registry
            </Link>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                <div
                    className={`absolute top-0 left-0 right-0 h-2.5 ${student.status === "Active"
                            ? "bg-emerald-500"
                            : student.status === "Pending"
                                ? "bg-amber-500"
                                : "bg-rose-500"
                        }`}
                />

                <div className="flex justify-between items-start mb-6">
                    <div>
                        <span className="font-mono text-xs font-bold text-blue-400 uppercase tracking-widest">
                            {student.id}
                        </span>
                        <h1 className="text-3xl font-extrabold text-slate-100 mt-1 tracking-tight">
                            {student.name}
                        </h1>
                        <p className="text-slate-400 text-sm mt-0.5">{student.email}</p>
                    </div>
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${student.status === "Active"
                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                : student.status === "Pending"
                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            }`}
                    >
                        {student.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-6 border-t border-slate-700/60 pt-6 text-sm">
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Assigned Curricula Track
                        </h4>
                        <p className="mt-1 font-medium text-slate-200">{student.course}</p>
                    </div>
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            System Records Enrollment Date
                        </h4>
                        <p className="mt-1 font-mono text-slate-200">
                            {student.enrollmentDate}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
