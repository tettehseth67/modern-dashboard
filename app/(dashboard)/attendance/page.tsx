"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Search,
  Save,
} from "lucide-react";

type AttendanceStatus = "Present" | "Absent" | "Tardy";

interface AttendanceRecord {
  id: string;
  student_name: string;
  student_id: string;
  status: AttendanceStatus;
  date: string;
}

export default function DailyAttendancePage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Inside app/(dashboard)/attendance/page.tsx -> fetchAttendanceRoster function block

  const fetchAttendanceRoster = async () => {
    try {
      setIsLoading(true);

      // REMOVED THE RIGID .eq("status", "Active") LIMIT BLOCK!
      // This fetches all available student rows from your table automatically
      const { data: students, error: studentErr } = await supabase
        .from("students")
        .select("id, name, status");

      if (studentErr) throw studentErr;

      const todayDateString = new Date().toISOString().split("T")[0];

      // Map profiles into reactive component tracking status objects safely
      const initializedRecords = (students || []).map((student: any) => ({
        id: student.id || "N/A",
        student_id: student.id || "N/A",
        // Defensive fallback text strings to guard against empty cells or null values
        student_name: student.name || "Untitled Profile Student",
        status: "Present" as const, // Default starting anchor state
        date: todayDateString,
      }));

      setRecords(initializedRecords);
    } catch (err) {
      console.error("Error building attendance sheet roster grid:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadAttendanceRoster = async () => {
      await Promise.resolve();
      await fetchAttendanceRoster();
    };

    void loadAttendanceRoster();
  }, []);

  // Local Memory Status Toggle Controller
  const toggleStatus = (
    id: string,
    currentStatus: "Present" | "Absent" | "Tardy",
  ) => {
    const nextStatusMap: Record<string, "Present" | "Absent" | "Tardy"> = {
      Present: "Absent",
      Absent: "Tardy",
      Tardy: "Present",
    };

    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === id ? { ...rec, status: nextStatusMap[currentStatus] } : rec,
      ),
    );
  };

  // 2. Batch Cloud Database Transaction Submitter
  const handleSaveAttendance = async () => {
    try {
      setIsSaving(true);

      // Format records to match our PostgreSQL junction criteria fields
      const payload = records.map((rec) => ({
        student_id: rec.student_id,
        status: rec.status,
        logged_date: rec.date,
      }));

      const { error } = await supabase
        .from("attendance")
        .upsert(payload, { onConflict: "student_id,logged_date" });

      if (error) throw error;
      alert(
        "🏁 SUCCESS: Daily attendance rosters submitted and locked into database!",
      );
    } catch (err: any) {
      console.error("Cloud insertion drop aborted:", err.message);
      alert(`Submission Blocked: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Defensive search filter computation lines
  const filteredRecords = records.filter((rec) =>
    (rec.student_name || "")
      .toLowerCase()
      .includes((searchTerm || "").toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Dynamic Header Toolbar Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <Link
            href="/dashboard"
            className="text-xs text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Core Center
          </Link>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-400" /> Daily Attendance
            Manager
          </h1>
          <p className="text-slate-400 text-sm mt-0.5">
            Log student presence indicators, track check-in anomalies, and
            submit daily records.
          </p>
        </div>

        {/* Bulk Action Processing Button */}
        <button
          type="button"
          onClick={handleSaveAttendance}
          disabled={!!isSaving || records.length === 0}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-lg shadow-blue-600/10 cursor-pointer disabled:opacity-40 shrink-0 self-start sm:self-center"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving Roster Changes..." : "Submit Daily Log"}
        </button>
      </div>

      {/* Control Utility Filter Layout */}
      <div className="relative max-w-md bg-slate-800 p-1.5 rounded-xl border border-slate-700 shadow-md">
        <Search className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter students by profile name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Roster Spreadsheet Interface Container */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <div className="grid grid-cols-3 gap-2 md:gap-4 bg-slate-700/50 p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
            <div>Student Identity Name</div>
            <div>Date Track</div>
            <div className="text-center">Presence Status (Click to Toggle)</div>
          </div>

          <div className="divide-y divide-slate-700">
            {isLoading ? (
              <div className="p-12 text-center text-sm text-slate-400 flex items-center justify-center gap-3">
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                Compiling registry roster listings...
              </div>
            ) : filteredRecords.length > 0 ? (
              filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="grid grid-cols-3 gap-2 md:gap-4 p-4 text-sm items-center hover:bg-slate-700/20 transition-colors"
                >
                  {/* Column 1: Student Name Details */}
                  <div className="font-medium text-slate-200 truncate">
                    {rec.student_name}
                    <span className="block font-mono text-[10px] text-blue-400 mt-0.5">
                      {rec.student_id}
                    </span>
                  </div>

                  {/* Column 2: Date String Tracker */}
                  <div className="text-slate-400 font-mono text-xs">
                    {rec.date}
                  </div>

                  {/* Column 3: Interactive Toggling Badge */}
                  <div className="text-center flex justify-center">
                    <button
                      type="button"
                      onClick={() => toggleStatus(rec.id, rec.status)}
                      className={`px-4 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all cursor-pointer min-w-[110px] justify-center ${
                        rec.status === "Present"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                          : rec.status === "Absent"
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                      }`}
                    >
                      {rec.status === "Present" && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                      {rec.status === "Absent" && (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      {rec.status === "Tardy" && (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}
                      <span>{rec.status}</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-sm text-slate-500">
                No matching student profiles located inside workspace rosters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
