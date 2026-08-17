

import { MOCK_COURSES } from '@/data/mockStudents'
import React from 'react'

export default function CourseManagementPage() {
    return (
        <div className="space-y-6">
            {/* Sub-Header Section */}
            <div className="border-b border-slate-800 pb-5">
                <h1 className="text-2xl font-bold text-slate-100">Course management</h1>
                <p className="text-slate-400 text-sm">Monitor active program tracks, capacity thresholds, and structural metrics</p>
            </div>

            {/* Course Cards Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                {MOCK_COURSES.map((course) => {
                    // // Calculate active seating parameters on the fly
                    const fillPercentage = Math.round(
                        (course.enrolledCount / course.maxCapacity) * 100,
                    );
                    const availableSeats =
                        course.maxCapacity - course.enrolledCount;

                    return (
                        <div
                            key={course.id}
                            className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[220px]"
                        >
                            <div>
                                {/* Header Metadata Ribbon */}
                                <div className="flex justify-between items-center mb-3">
                                    <span className="font-mono text-xs font-bold text-blue-400">
                                        {course.id}
                                    </span>
                                    <span
                                        className={`px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wider uppercase ${course.difficulty === "Beginner"
                                                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                : course.difficulty === "Intermediate"
                                                    ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                                    : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                            }`}
                                    >
                                        {course.difficulty}
                                    </span>
                                </div>

                                {/* Course Title Information */}
                                <h3 className="text-lg font-bold text-slate-100 tracking-tight leading-snug">
                                    {course.title}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                    {course.department}
                                </p>
                            </div>

                            {/* Progress Tracker and Capacity Analytics */}
                            <div className="mt-6 space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-slate-400">
                                        Roster Capacity
                                    </span>
                                    <span className="text-slate-200 font-mono">
                                        {course.enrolledCount} / {course.maxCapacity} Seats
                                    </span>
                                </div>

                                {/* Custom Styled Visual Progress Bar Progress Bar */}
                                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-700/50">
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${fillPercentage >= 85
                                                ? "bg-rose-500"
                                                : fillPercentage >= 60
                                                    ? "bg-amber-500"
                                                    : "bg-blue-500"
                                            }`}
                                        style={{ width: `${fillPercentage}%` }}
                                    />
                                </div>

                                <div className="flex justify-between items-center text-[11px] pt-1">
                                    <span className="text-slate-500 font-medium">
                                        {fillPercentage}% Filled
                                    </span>
                                    <span
                                        className={`font-mono ${availableSeats <= 3 ? "text-rose-400 font-bold" : "text-slate-400"}`}
                                    >
                                        {availableSeats} seats remaining
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    )
}
