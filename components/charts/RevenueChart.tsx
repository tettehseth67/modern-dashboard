"use client";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

interface RevenueData {
    month: string;
    revenue: number;
    collected: number;
}

interface RevenueChartProps {
    data: RevenueData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
    return (
        <div className="w-full h-[320px] bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
                <h3 className="text-sm font-bold text-slate-200">
                    Financial Ledger Revenue Trajectory
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Month-by-month gross invoice collections vs actual cash flow
                </p>
            </div>

            <ResponsiveContainer width="100%" height="80%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#334155"
                        opacity={0.25}
                    />

                    <XAxis
                        dataKey="month"
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                    />

                    <YAxis
                        stroke="#94a3b8"
                        fontSize={11}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `$${value}`}
                    />

                    <Tooltip
                        contentStyle={{
                            backgroundColor: "#1e293b",
                            borderColor: "#334155",
                            borderRadius: "12px",
                            color: "#f8fafc",
                            fontSize: "12px",
                        }}
                    />

                    {/* Line 1: Total Gross Billed Invoices (Glowing Indigo) */}
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Gross Billed"
                        stroke="#6366f1"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: "#1e293b" }}
                        activeDot={{ r: 6 }}
                    />

                    {/* Line 2: Actual Collected Revenue (Glow Emerald) */}
                    <Line
                        type="monotone"
                        dataKey="collected"
                        name="Collected Cash"
                        stroke="#10b981"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: "#1e293b" }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
