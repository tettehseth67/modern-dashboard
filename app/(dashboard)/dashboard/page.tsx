"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import EnrollmentChart from "@/components/charts/EnrollmentChart";
import RevenueChart from "@/components/charts/RevenueChart";
import { Users, BookOpen, FileText, AlertCircle, Calendar } from "lucide-react";

export default function CompleteExecutiveDashboard() {
  const [enrollmentData, setEnrollmentData] = useState<any[]>([]);
  const [financialData, setFinancialData] = useState<any[]>([]);
  const [totals, setTotals] = useState({ students: 0, courses: 0, billing: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLiveDatabaseTelem = async () => {
      try {
        setIsLoading(true);

        // 1. RUN CONCURRENT QUERY THREADS STRAIGHT TO YOUR TABLES
        const [coursesRes, invoicesRes, studentsRes] = await Promise.all([
          supabase.from("courses").select("*").limit(4),
          supabase.from("invoices").select("amount, status, department"),
          supabase.from("students").select("id", { count: "exact" }),
        ]);

        if (coursesRes.error) throw coursesRes.error;
        if (invoicesRes.error) throw invoicesRes.error;

        // 2. PARSE ENROLLMENT DATA FIELDS
        const formattedEnrollments = (coursesRes.data || []).map((c: any) => {
          const titleText = c.title || c.name || "Track";
          return {
            name:
              titleText.length > 10
                ? titleText.substring(0, 8) + "..."
                : titleText,
            enrolled: isNaN(parseInt(c.enrolled, 10))
              ? 0
              : parseInt(c.enrolled, 10),
            capacity: isNaN(parseInt(c.capacity, 10))
              ? 30
              : parseInt(c.capacity, 10),
          };
        });
        setEnrollmentData(formattedEnrollments);

        // 3. COMPILE REAL-TIME REVENUE MATRICES BY DEPARTMENT
        // Maps your live 'amount', 'status', and 'department' column fields directly into lines!
        const deptMap: Record<string, { gross: number; cash: number }> = {
          "Computer Science": { gross: 0, cash: 0 },
          Business: { gross: 0, cash: 0 },
          "Data Infrastructure": { gross: 0, cash: 0 },
        };

        let totalBillingSum = 0;

        (invoicesRes.data || []).forEach((inv: any) => {
          if (!inv.amount) return;
          const cleanedAmt = parseFloat(
            String(inv.amount).replace(/[^0-9.-]+/g, ""),
          );
          if (isNaN(cleanedAmt)) return;

          totalBillingSum += cleanedAmt;
          const deptKey = inv.department || "Computer Science"; // Safe structural fallback

          if (deptMap[deptKey]) {
            deptMap[deptKey].gross += cleanedAmt;
            if (inv.status === "Paid") {
              deptMap[deptKey].cash += cleanedAmt;
            }
          }
        });

        // Format object mappings directly into line positions for your RevenueChart
        const formattedFinances = Object.keys(deptMap).map((dept) => ({
          month: dept.length > 10 ? dept.substring(0, 8) + "." : dept, // Uses department text names as X-Axis ticks
          revenue: deptMap[dept].gross,
          collected: deptMap[dept].cash,
        }));
        setFinancialData(formattedFinances);

        setTotals({
          students: studentsRes.count || 0,
          courses: (coursesRes.data || []).length,
          billing: totalBillingSum,
        });
      } catch (err) {
        console.error("Failed synchronizing chart pipelines:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLiveDatabaseTelem();
  }, []);

  if (isLoading) {
    return (
      <div className="p-12 text-center text-sm text-slate-400 flex flex-col items-center justify-center gap-3 min-h-[60vh] bg-slate-900">
        <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <span className="font-mono text-xs text-slate-500 uppercase tracking-widest">
          Compiling live chart feeds...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full text-slate-100 bg-slate-900">
      <div className="border-b border-slate-700 pb-2">
        <h1 className="text-2xl font-black tracking-tight">
          EduSuite Control Center
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Real-time analytical graphs, fiscal monitors, and operations center
          logs.
        </p>
      </div>

      {/* SUMMARY STATS CARDS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Roster Count
            </span>
            <p className="text-2xl font-black text-slate-100">
              {totals.students}
            </p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Active Classes
            </span>
            <p className="text-2xl font-black text-slate-100">
              {totals.courses}
            </p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-slate-800 border border-slate-700 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Gross Ledger Revenue
            </span>
            <p className="text-2xl font-black text-emerald-400">
              ${totals.billing.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <FileText className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 📊 CORE SPLIT ANALYTICS SECTOR ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
        <EnrollmentChart data={enrollmentData} />
        <RevenueChart data={financialData} />
      </div>

      {/* QUICK SYSTEM MODULE SHORTCUTS BOX */}
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
