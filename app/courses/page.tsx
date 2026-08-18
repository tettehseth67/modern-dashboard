"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import {
  BookOpen,
  Search,
  AlertCircle,
  ArrowLeft,
  Users,
  ShieldAlert,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  department: string;
  capacity: number;
  enrolled: number;
  status: string;
}

export default function CoursesCatalogPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Unified Asynchronous Cloud Database Fetcher
  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;

      // Safe fallbacks to handle potential schema variations between local mock profiles and cloud tables
      const mappedData = (data || []).map((c: any) => ({
        id: c.id || c.ClassID || c.CourseID || "N/A",
        title: c.title || c.ClassName || c.CourseName || "Untitled Course",
        department: c.department || c.DepartmentName || "General",
        capacity: parseInt(c.capacity || c.MaxCapacity || "30", 10),
        enrolled: parseInt(c.enrolled || c.CurrentEnrolled || "0", 10),
        status: c.status || "Active",
      }));

      setCourses(mappedData);
    } catch (err) {
      console.error("Error reading cloud courses table:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 2. Defensive, Null-Safe Real-Time Filtering Algorithm
  const filteredCourses = courses.filter((c) => {
    const query = (searchTerm || "").toLowerCase();
    const titleMatch = (c.title || "").toLowerCase().includes(query);
    const deptMatch = (c.department || "").toLowerCase().includes(query);
    const idMatch = (c.id || "").toLowerCase().includes(query);

    return titleMatch || deptMatch || idMatch;
  });

  return (
    <div className="space-y-6">
      {/* Top Navigation Header */}
      <div className="border-b border-slate-800 pb-3">
        <Link
          href="/"
          className="text-xs text-blue-400 hover:underline flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="w-3 h-3" /> Back to Dashboard Overview
        </Link>
        <h1 className="text-2xl font-bold text-slate-100">
          Academic Course Track Registry
        </h1>
        <p className="text-slate-400 text-sm mt-0.5">
          Monitoring cloud infrastructure capacities, enrollment loads, and
          department segments.
        </p>
      </div>

      {/* Control Utility Search Toolbar */}
      <div className="relative max-w-md bg-slate-800 p-1.5 rounded-xl border border-slate-700 shadow-md">
        <Search className="absolute left-4 top-4 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Filter courses by title, code ID, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* Main Grid Frame Viewport */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-2 p-12 text-center text-sm text-slate-400 flex items-center justify-center gap-3 bg-slate-800 rounded-xl border border-slate-700">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            Synchronizing live course catalog matrix modules...
          </div>
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => {
            // Dynamic cloud math calculations for progress safety indicators
            const fillPercentage = Math.min(
              Math.round((course.enrolled / course.capacity) * 100),
              100,
            );
            const isFull = course.enrolled >= course.capacity;

            return (
              <div
                key={course.id}
                className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-semibold text-blue-400 tracking-wide uppercase">
                        {course.id}
                      </span>
                      <h3 className="text-lg font-bold text-slate-100 mt-1 leading-snug">
                        {course.title}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300 border border-slate-600">
                      {course.department}
                    </span>
                  </div>
                </div>

                {/* Progress Tracking Bar Assembly */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-medium flex items-center gap-1">
                      <Users className="w-3 h-3" /> Roster Status:{" "}
                      {course.enrolled} / {course.capacity} seats
                    </span>
                    <span
                      className={`font-mono font-bold ${isFull ? "text-rose-400" : "text-emerald-400"}`}
                    >
                      {fillPercentage}% Allocated
                    </span>
                  </div>

                  {/* Outer Frame Tracker */}
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
                    {/* Inner Metric Fill */}
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isFull
                          ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                          : fillPercentage > 85
                            ? "bg-amber-500"
                            : "bg-emerald-500"
                      }`}
                      style={{ width: `${fillPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Status Indicator Flags */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-700/60">
                  <span
                    className={`inline-flex items-center gap-1 font-medium ${isFull ? "text-rose-400" : "text-slate-400"}`}
                  >
                    {isFull && <ShieldAlert className="w-3.5 h-3.5" />}
                    {isFull ? "Registration Closed" : "Open for Enrollment"}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-2 p-12 text-center text-sm text-slate-500 bg-slate-800 rounded-xl border border-slate-700 flex flex-col items-center gap-2">
            <AlertCircle className="w-5 h-5 text-slate-600" />
            No academic course records matched your search query filter.
          </div>
        )}
      </div>
    </div>
  );
}
