"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import Link from "next/link";
import {
  Users,
  BookOpen,
  Trash2,
  ArrowLeft,
  Search,
  Plus,
  Mail,
} from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  email: string;
  course: string;
  department: string;
  status: string;
  createdAt?: string;
}

export default function TeacherDirectoryPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. Unified Asynchronous Cloud Fetcher
  const fetchTeachers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("teachers")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      if (data) setTeachers(data as Teacher[]);
    } catch (err) {
      console.error("Error reading teachers table:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Asynchronous Cloud Row Deletion Controller
  const handleDeleteTeacher = async (idToDelete: string) => {
    try {
      const { error } = await supabase
        .from("teachers")
        .delete()
        .eq("id", idToDelete);

      if (error) throw error;
      setTeachers(teachers.filter((t) => t.id !== idToDelete));
    } catch (err) {
      console.error("Failed faculty row deletion:", err);
    }
  };

  // THE FIXED FILTER: Uses logical OR gates (|| "") to substitute null database values with empty strings!
  const filteredTeachers = teachers.filter((t) => {
    const query = (searchQuery || "").toLowerCase();

    const nameMatch = (t.name || "").toLowerCase().includes(query);
    const emailMatch = (t.email || "").toLowerCase().includes(query);

    // Guard both .course and .department values depending on what the AI named your table columns
    const courseMatch = (t.course || t.department || "")
      .toLowerCase()
      .includes(query);

    return nameMatch || emailMatch || courseMatch;
  });

  return (
    <div className="space-y-6 p-3">
      {/* Header Navigation Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-5 gap-4">
        <div>
          <Link
            href="/dashboard"
            className="text-xs text-blue-400 hover:underline flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3 h-3" /> Back to Workspace Summary
          </Link>
          <h1 className="text-2xl font-bold text-slate-100">
            Faculty & Teacher Directory
          </h1>
          <p className="text-slate-400 text-sm">
            Managing core educational instructors and tracking program
            assignments.
          </p>
        </div>
      </div>

      {/* Metric Aggregate Blocks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Active Faculty
            </span>
            <div className="text-2xl font-mono font-bold text-slate-100 mt-0.5">
              {teachers.length} Instructors
            </div>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Departmental Tracks
            </span>
            <div className="text-2xl font-mono font-bold text-emerald-400 mt-0.5">
              {new Set(teachers.map((t) => t.course)).size} Divisions
            </div>
          </div>
        </div>
      </div>

      {/* Control Utility Toolbar Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-md">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search instructors by name, email, or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {/* Master Data Grid Framework */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-700/40 p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700 hidden md:grid">
          <div>Instructor Profile</div>
          <div>Assigned Subject Track</div>
          <div>System Access Status</div>
          <div className="text-right hidden md:block">Roster Actions</div>
        </div>

        <div className="divide-y divide-slate-700">
          {isLoading ? (
            <div className="p-12 text-center text-sm text-slate-400 flex items-center justify-center gap-3">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              Syncing dynamic cloud roster pools...
            </div>
          ) : filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4 p-4 text-sm items-center hover:bg-slate-700/20 transition-colors"
              >
                {/* Profile Identity Col */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center font-bold text-slate-200 border border-slate-600">
                    {teacher.name}
                  </div>
                  <div>
                    <div className="font-medium text-slate-100">
                      {teacher.name}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3" /> {teacher.email}
                    </div>
                  </div>
                </div>

                {/* Course Track Col */}
                <div className="text-slate-300 font-medium md:block flex justify-between">
                  <span className="md:hidden text-xs text-slate-500 uppercase font-bold">
                    Track:{" "}
                  </span>
                  {teacher.course}
                </div>

                {/* Badge Status Status Col */}
                <div className="md:block flex justify-between">
                  <span className="md:hidden text-xs text-slate-500 uppercase font-bold">
                    Status:{" "}
                  </span>
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      teacher.status === "Active"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : teacher.status === "Pending"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {teacher.status}
                  </span>
                </div>

                {/* Action Interactive Controllers */}
                <div className="text-right flex md:justify-end justify-between items-center gap-2">
                  <span className="md:hidden text-xs text-slate-500 uppercase font-bold">
                    Actions:{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDeleteTeacher(teacher.id)}
                    className="p-1.5 text-rose-400 hover:text-white hover:bg-rose-600 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-sm text-slate-500">
              No faculty registry profiles located matching your parameters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
