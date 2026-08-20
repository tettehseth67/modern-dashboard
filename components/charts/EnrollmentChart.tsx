"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface EnrollmentData {
  name: string;
  enrolled: number;
  capacity: number;
}

interface EnrollmentChartProps {
  data: EnrollmentData[];
}

export default function EnrollmentChart({ data }: EnrollmentChartProps) {
  // 🌟 DEFENSIVE GUARD check: If data hasn't arrived from Supabase yet,
  // render a clean loading frame instead of crashing the browser!
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[320px] bg-slate-800/40 border border-slate-700/60 rounded-2xl flex items-center justify-center text-xs text-slate-500">
        No active course capacities located to graph.
      </div>
    );
  }

  return (
    // Explicit flex-col and w-full properties guarantee responsive boundaries
    <div className="w-full h-[320px] bg-slate-800/40 border border-slate-700/60 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
      <div>
        <h3 className="text-sm font-bold text-slate-200">
          Registration Volume vs. Capacity
        </h3>
        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
          Real-time seat allocation metrics pulled from cloud schemas
        </p>
      </div>

      {/* Force a fixed percentage height calculation anchor */}
      <div className="w-full h-[220px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.2}
            />
            <XAxis
              dataKey="name"
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
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
              cursor={{ fill: "#334155", opacity: 0.15 }}
            />
            <Bar
              dataKey="enrolled"
              name="Enrolled Students"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
            <Bar
              dataKey="capacity"
              name="Max Seat Capacity"
              fill="#475569"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
