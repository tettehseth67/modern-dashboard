"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase"; // Import our cloud database client bridge
import { Student } from "@/types/dashboard";

export default function StudentRosterPage() {
    // 1. Initialize our states. Start with an empty array and loading set to true
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeStatusTab, setActiveStatusTab] = useState<
        "All" | "Active" | "Pending" | "Suspended"
    >("All");

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newName, setNewName] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const [newCourse, setNewCourse] = useState("Web Development Core");
    const [newStatus, setNewStatus] = useState<
        "All" | "Active" | "Pending" | "Suspended"
    >("All");

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newName.trim() || !newEmail.trim()) return;

        const newStudentData = {
            id: `STU-00${students.length + 1}`,
            name: newName.trim(),
            email: newEmail.trim(),
            course: newCourse,
            status: newStatus,
            // THE FIX: Append [0] to extract just the YYYY-MM-DD string fragment
            enrollmentDate: new Date().toISOString().split("T")[0],
        };

        try {
            const { error } = await supabase
                .from("students")
                .insert([newStudentData])
                .select();

            if (error) {
                console.error("Supabase Database Error Code:", error.code);
                console.error("Supabase Error Message:", error.message);
                return;
            }

            // Update frontend state layout
            setStudents([...students, newStudentData as Student]);

            // Clear and close
            setNewName("");
            setNewEmail("");
            setIsModalOpen(false);
        } catch (err) {
            console.error("Browser Fetch Crash:", err);
        }
    };



    // 2. The Asynchronous Data Fetcher
    const fetchStudents = async () => {
        try {
            setIsLoading(true);

            // Query our cloud PostgreSQL 'students' table directly
            const { data, error } = await supabase
                .from("students")
                .select("*")
                .order("id", { ascending: true }); // Keep rows sorted by ID cleanly

            if (error) throw error;
            if (data) setStudents(data as Student[]);
        } catch (err) {
            console.error("Database connection failure:", err);
        } finally {
            setIsLoading(false); // Turn off the loading state once the network task finishes
        }
    };

    // 3. Trigger the data handshake immediately when the page mounts on screen
    useEffect(() => {
        // 1. Declare the async logic block inside the safe execution channel
        const loadCloudData = async () => {
            await fetchStudents();
        };

        // 2. Fire the async worker block immediately
        loadCloudData();
    }, []);

    // 4. Asynchronous Cloud Deletion Handler
    const handleDeleteStudent = async (idToDelete: string) => {
        try {
            // Execute a real-world hard delete command targeting the row matching the ID
            const { error } = await supabase
                .from("students")
                .delete()
                .eq("id", idToDelete);

            if (error) throw error;

            // Optimistically update our local frontend display state grid so the row pops out instantly
            setStudents(students.filter((student) => student.id !== idToDelete));
        } catch (err) {
            console.error("Failed to delete record from cloud:", err);
        }
    };

    // Compound filter logic processing your live state rows
    const filteredStudents = students.filter((student) => {
        const matchesSearch = student.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesStatus =
            activeStatusTab === "All" || student.status === activeStatusTab;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <h1 className="text-2xl font-bold text-slate-100">
                        Live Student Registry
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Streaming live rows directly from your cloud Postgres database
                        instance.
                    </p>
                </div>

                <div className="w-full md:w-72">
                    <input
                        type="text"
                        placeholder="Search student names..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                </div>
            </div>

            {/* Filter Tabs Strip */}
            <div className="flex flex-row justify-between">
                <div className="flex gap-2 p-1 bg-slate-800/60 border border-slate-700/60 rounded-xl w-fit">
                    {(["All", "Active", "Pending", "Suspended"] as const).map((tab) => (
                        <button
                            type="button"
                            key={tab}
                            onClick={() => setActiveStatusTab(tab)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${activeStatusTab === tab
                                    ? "bg-blue-500 text-white shadow-md"
                                    : "text-slate-400 hover:text-slate-200"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
                <div>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="px-4 py-1 bg-blue-600 hover:bg-blue-500 font-medium text-sm rounded-lg transition-colors shadow-lg shadow-blue-600/10 cursor-pointer"
                    >
                        Add Student
                    </button>
                </div>
            </div>
            {/* Master Data Grid Container Card */}
            <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
                <div className="grid grid-cols-6 gap-4 bg-slate-700/50 p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-700">
                    <div>System ID</div>
                    <div>Student Profile</div>
                    <div>Course Track</div>
                    <div>Status</div>
                    <div>Enrollment Date</div>
                    <div className="text-right">Actions</div>
                </div>

                <div className="divide-y divide-slate-700">
                    {/* 5. Conditional Loading Visual Fallback Block */}
                    {isLoading ? (
                        <div className="p-12 text-center text-sm text-slate-400 flex items-center justify-center gap-3">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                            Establishing live handshake with cloud data nodes...
                        </div>
                    ) : filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => (
                            <div
                                key={student.id}
                                className="grid grid-cols-6 gap-4 p-4 text-sm items-center hover:bg-slate-700/20 transition-colors"
                            >
                                <div className="font-mono text-xs font-semibold text-blue-400">
                                    {student.id}
                                </div>
                                {/* Column 2: Personal Profile Row Block */}
                                <div>
                                    <Link
                                        href={`/students/${student.id}`} // Uses backticks to inject the matching ID on the fly
                                        className="font-medium text-slate-200 hover:text-blue-400 hover:underline transition-all block cursor-pointer z-10"
                                    >
                                        {student.name}
                                    </Link>
                                    <span className="text-xs text-slate-400 block">
                                        {student.email}
                                    </span>
                                </div>

                                <div className="text-slate-300">{student.course}</div>
                                <div>
                                    <span
                                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${student.status === "Active"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : student.status === "Pending"
                                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                            }`}
                                    >
                                        {student.status}
                                    </span>
                                </div>
                                <div className="text-slate-400 font-mono text-xs">
                                    {student.enrollmentDate}
                                </div>
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteStudent(student.id)}
                                        className="px-2.5 py-1 text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-md hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-12 text-center text-sm text-slate-500">
                            No matching student profile logs identified in cloud storage.
                        </div>
                    )}
                </div>
            </div>

            {/* Interactive Modal Form Popup Container Layout */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
                    <div className="bg-slate-800 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl p-6">
                        <h3 className="text-lg font-bold text-slate-100 mb-4">
                            Enroll New Student
                        </h3>

                        <form onSubmit={handleAddStudent} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={newEmail}
                                    onChange={(e) => setNewEmail(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                                    placeholder="e.g. j.doe@academy.edu"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Course Assignment
                                </label>
                                <select
                                    value={newCourse}
                                    onChange={(e) => setNewCourse(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="Web Development Core">
                                        Web Development Core
                                    </option>
                                    <option value="Database Management">
                                        Database Management
                                    </option>
                                    <option value="Cybersecurity Fundamentals">
                                        Cybersecurity Fundamentals
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                    Initial Status
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                        setNewStatus(
                                            e.target.value as
                                            | "All"
                                            | "Active"
                                            | "Pending"
                                            | "Suspended",
                                        )
                                    }
                                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="Active">Active</option>
                                    <option value="Pending">Pending</option>
                                    <option value="Suspended">Suspended</option>
                                </select>
                            </div>

                            {/* Action Controls Layout Footer */}
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-sm font-medium text-slate-300 rounded-lg transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white rounded-lg transition-colors cursor-pointer"
                                >
                                    Save Record
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
