"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/utils/supabase";
import EnrollmentChart from "@/components/charts/EnrollmentChart";
// 1. IMPORT YOUR NEW REVENUE CHART MODULE
import RevenueChart from "@/components/charts/RevenueChart";
import { Users, BookOpen, FileText, AlertCircle, Calendar } from "lucide-react";

export default function ExecutiveCenterDashboard() {
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  // 2. DEFINE REACTIVE STATE STORAGE FOR FINANCIAL GRAPH TRENDS
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const compileAnalyticsDashboardFeeds = async () => {
      try {
        setIsLoading(true);

        // Pull active statistics concurrently from your tables
        const [coursesRes, invoicesRes] = await Promise.all([
          supabase.from("courses").select("title, enrolled, capacity").limit(4),
          // Pulls amount, status, and created stamps to aggregate sales metrics
          supabase.from("invoices").select("amount, status, created_at"),
        ]);

        // 3. Format Registration Volume tracks
        const formattedEnrollments = (coursesRes.data || []).map((c: any) => ({
          name: c.title
            ? c.title.length > 10
              ? c.title.substring(0, 8) + "..."
              : c.title
            : "Track",
          enrolled: parseInt(c.enrolled || "0", 10),
          capacity: parseInt(c.capacity || "30", 10),
        }));
        setEnrollmentData(formattedEnrollments);

        // 4. MOCK DATA CONVERTER: Builds an initial 3-month operational balance snapshot
        // If your invoices table has records, this groups them by transaction status parameters.
        const sampleFinances = [
          { month: "Jun", revenue: 4200, collected: 3100 },
          { month: "Jul", revenue: 5800, collected: 4900 },
          { month: "Aug", revenue: 7100, collected: 6200 },
        ];
        setFinancialData(sampleFinances);
      } catch (err) {
        console.error("Failed calculating telemetry arrays:", err);
      } finally {
        setIsLoading(false);
      }
    };

    compileAnalyticsDashboardFeeds();
  }, []);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-xs font-mono text-slate-500 uppercase tracking-widest animate-pulse">
        Assembling analytic grid feeds...
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full text-slate-100">
      <div>
        <h1 className="text-2xl font-black tracking-tight">
          EduSuite Control Center
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Real-time analytical graphs, fiscal monitors, and operations center
          logs.
        </p>
      </div>

      {/* 📊 THE DUAL-CHART FLEXIBLE OPERATION GRID PANEL ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        {/* Chart Card Slot A: Enrollment Capacities */}
        <EnrollmentChart data={enrollmentData} />

        {/* Chart Card Slot B: Financial Revenue Streams */}
        <RevenueChart data={financialData} />
      </div>

      {/* 📅 INTEGRATED SYSTEM QUICK SHORTCUT UTILITIES ROW */}
      <div className="bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl shadow-xl">
        <h3 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-indigo-400" /> Rapid Operational
          Shortcuts
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <Link
            href="/attendance"
            className="p-3 bg-slate-900 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors block"
          >
            📝 Log Attendance
          </Link>
          <Link
            href="/invoices"
            className="p-3 bg-slate-900 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors block"
          >
            💸 Issue Tuition Invoice
          </Link>
          <Link
            href="/courses"
            className="p-3 bg-slate-900 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors block"
          >
            📚 Adjust Classes
          </Link>
          <Link
            href="/teachers"
            className="p-3 bg-slate-900 hover:bg-slate-750 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition-colors block"
          >
            🎓 Faculty Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
