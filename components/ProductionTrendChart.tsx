"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatDate } from "@/lib/utils/format";

export function ProductionTrendChart({ data }: { data: { date: string; litres: number }[] }) {
  if (data.length === 0) {
    return <p className="text-sm text-silver-600 py-10 text-center">No milk records yet.</p>;
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
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
            formatter={(value: number) => [`${value} L`, "Milk"]}
            labelFormatter={(d) => formatDate(d)}
            contentStyle={{ borderRadius: 10, borderColor: "#E5E7EB", fontSize: 13 }}
          />
          <Line type="monotone" dataKey="litres" stroke="#16A34A" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
