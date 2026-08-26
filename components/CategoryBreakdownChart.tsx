"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { formatKSh } from "@/lib/utils/format";

const COLORS = ["#16A34A", "#14532D", "#C9A648", "#5B6470", "#22B559", "#9AA1AB", "#D97706", "#1B6B3A"];

export function CategoryBreakdownChart({ data }: { data: { category: string; amount: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-silver-600 py-10 text-center">No expenses recorded yet.</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
          <CartesianGrid stroke="#E5E7EB" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#5B6470" }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="category"
            tick={{ fontSize: 11, fill: "#5B6470" }}
            axisLine={false}
            tickLine={false}
            width={90}
          />
          <Tooltip formatter={(v: number) => formatKSh(v)} contentStyle={{ borderRadius: 10, borderColor: "#E5E7EB", fontSize: 13 }} />
          <Bar dataKey="amount" radius={[0, 6, 6, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
