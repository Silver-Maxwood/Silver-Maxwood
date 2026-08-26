"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDate } from "@/lib/utils/format";

interface DailyData {
  date: string;
  acceptedLitres: number;
  rejectedLitres: number;
  totalLitres: number;
  income: number;
}

export function MonthlyProductionChart({ data }: { data: DailyData[] }) {
  const hasData = data.some((d) => d.totalLitres > 0);

  if (!hasData) {
    return <p className="text-sm text-silver-600 py-10 text-center">No milk recorded in this month.</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <CartesianGrid stroke="#E5E7EB" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => formatDate(d).slice(0, 5)}
            tick={{ fontSize: 11, fill: "#5B6470" }}
            axisLine={{ stroke: "#E5E7EB" }}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: "#5B6470" }} axisLine={false} tickLine={false} width={44} />
          <Tooltip
            formatter={(value: number, name: string) => [
              `${value} L`,
              name === "acceptedLitres" ? "Accepted Milk" : "Rejected Milk",
            ]}
            labelFormatter={(d) => formatDate(d)}
            contentStyle={{ borderRadius: 10, borderColor: "#E5E7EB", fontSize: 13 }}
          />
          <Bar dataKey="acceptedLitres" name="acceptedLitres" fill="#16A34A" radius={[4, 4, 0, 0]} stackId="milk" />
          <Bar dataKey="rejectedLitres" name="rejectedLitres" fill="#EF4444" radius={[4, 4, 0, 0]} stackId="milk" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
