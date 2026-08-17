import Link from "next/link";
import { supabase } from "@/utils/supabase";

;

export default async function DashboardHomePage() {
  let totalStudents = 0
  let totalCourses = 0
  let activeStudents = 0

  try {
    // 1. Fire parallel database requests to fetch our aggregate totals
    const [studentsRes, coursesRes] = await Promise.all([
      supabase.from("students").select("*"),
      supabase.from("courses").select("*")
    ])

    if (studentsRes.data) {
      totalStudents = studentsRes.data.length
      activeStudents = studentsRes.data.filter(s => s.status === "Active").length
    }

    if (coursesRes.data) {
      totalCourses = coursesRes.data.length
    }
  } catch (err) {
    console.error("Dasboard metric aggregation breakdown:", err)
  }
  return (
    <div className="space-y-8">
      {/* Welcome Title */}
      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
          System Dashboard
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Real-time infrastructure summary logs across educational registries
        </p>
      </div>

      {/* Aggregate Metric Row Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Enrolled Capacity</span>
          <div className="text-4xl font-mono font-bold text-slate-100 mt-2">{totalStudents}</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl border-l-4 border-l-emerald-500">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active System Accesses</span>
          <div className="text-4xl font-mono font-bold text-emerald-400 mt-2">{activeStudents}</div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl border-l-4 border-l-blue-500">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Monitored Course Track</span>
          <div className="text-4xl font-mono font-bold text-blue-400 mt-2">{totalCourses}</div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shortcut Box 1 */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between items-start min-h-40">
          <div>
            <h3 className="text-lg font-bold text-slate-200">Registry Records Control</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Review live active rosters, modify registration status parameters, or append new student entries to the cloud table.
            </p>
          </div>
          <Link href="/students" className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-medium text-white rounded-lg transition-all cursor-pointer">
            Open Registry
          </Link>
        </div>

        {/* Shortcut Box 2 */}
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex flex-col justify-between items-start min-h-[160px]">
          <div>
            <h3 className="text-lg font-bold text-slate-200">Academic Curriculum Monitor</h3>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">
              Track seating metrics, analyze capacity bar warnings, and manage individual department catalog segments.
            </p>
          </div>
          <Link href="/courses" className="mt-4 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-xs font-medium text-white rounded-lg transition-all cursor-pointer">
            View Curriculums →
          </Link>
        </div>
      </div>
    </div>
  );
}
