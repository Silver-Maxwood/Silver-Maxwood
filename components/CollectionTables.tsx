"use client";

import { useState } from "react";
import type { Delivery, Farmer } from "@/types/database";
import { formatKSh, formatDate } from "@/lib/utils/format";
import { StatusBadge } from "@/components/StatusBadge";
import { MarkDeliveryPaidButton } from "@/components/MarkDeliveryPaidButton";

export function CollectionTables({ deliveries, farmers }: { deliveries: Delivery[]; farmers: Farmer[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const farmerMap = new Map(farmers.map((f) => [f.id, f]));

  const filteredDeliveries = deliveries.filter((d) => {
    if (!searchQuery) return true;
    const farmer = farmerMap.get(d.farmer_id);
    if (!farmer) return false;
    const query = searchQuery.toLowerCase();
    return (
      farmer.name.toLowerCase().includes(query) ||
      farmer.reg_no.toLowerCase().includes(query)
    );
  });

  return (
    <div className="lg:col-span-2 space-y-6">
      <div className="card overflow-x-auto">
        <div className="px-4 py-3 border-b border-silver-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-display text-lg text-forest-900">Delivery log</h3>
          <input
            type="text"
            placeholder="Search by farmer name or reg no..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input max-w-sm text-sm"
          />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
              <th className="px-4 py-3 font-medium">Date & Time</th>
              <th className="px-4 py-3 font-medium">Farmer</th>
              <th className="px-4 py-3 font-medium">Qty (L)</th>
              <th className="px-4 py-3 font-medium">Quality</th>
              <th className="px-4 py-3 font-medium">Deductions</th>
              <th className="px-4 py-3 font-medium">Net payable</th>
              <th className="px-4 py-3 font-medium">Payment</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeliveries.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-silver-500 italic">No deliveries found.</td>
              </tr>
            ) : (
              filteredDeliveries.slice(0, 40).map((d) => (
                <tr key={d.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                  <td className="px-4 py-3 text-silver-600">
                    <div>{formatDate(d.date)}</div>
                    <div className="text-xs">{d.time?.slice(0, 5) || "—"}</div>
                  </td>
                  <td className="px-4 py-3 font-medium text-forest-900">
                    {farmerMap.get(d.farmer_id)?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-silver-600">{d.quantity}</td>
                  <td className="px-4 py-3"><StatusBadge status={d.quality_status} /></td>
                  <td className="px-4 py-3 text-silver-600">{formatKSh(d.deductions)}</td>
                  <td className="px-4 py-3 font-medium text-forest-900">{formatKSh(d.net_payable)}</td>
                  <td className="px-4 py-3 flex items-center">
                    <StatusBadge status={d.payment_status} />
                    {d.payment_status === "PENDING" && <MarkDeliveryPaidButton deliveryId={d.id} />}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="card overflow-x-auto">
        <div className="px-4 py-3 border-b border-silver-200">
          <h3 className="font-display text-lg text-forest-900">Registered farmers</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
              <th className="px-4 py-3 font-medium">Reg. no</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">National ID</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Payout method</th>
              <th className="px-4 py-3 font-medium">Price / L</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((f) => (
              <tr key={f.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                <td className="px-4 py-3 font-medium text-forest-900">{f.reg_no}</td>
                <td className="px-4 py-3 text-silver-600">{f.name}</td>
                <td className="px-4 py-3 text-silver-600">{f.national_id ?? "—"}</td>
                <td className="px-4 py-3 text-silver-600">{f.phone ?? "—"}</td>
                <td className="px-4 py-3 text-silver-600">{f.bank_or_mobile_money ?? "—"}</td>
                <td className="px-4 py-3 text-silver-600">{formatKSh(f.price_per_litre)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
