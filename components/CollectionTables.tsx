"use client";

import { useState } from "react";
import { Printer } from "lucide-react";
import type { Delivery, Farmer } from "@/types/database";
import { formatKSh, formatDate } from "@/lib/utils/format";
import { StatusBadge } from "@/components/StatusBadge";
import { MarkDeliveryPaidButton } from "@/components/MarkDeliveryPaidButton";
import { EditFarmerModal } from "@/components/EditFarmerModal";

export function CollectionTables({ deliveries, farmers }: { deliveries: Delivery[]; farmers: Farmer[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
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

  const generateReceipt = (delivery: Delivery, farmer: Farmer | undefined) => {
    const receiptContent = `
      <html>
        <head>
          <title>Receipt - Silver Maxwood Dairies</title>
          <style>
            body { font-family: sans-serif; padding: 20px; line-height: 1.6; }
            h1 { text-align: center; }
            .details { margin-top: 20px; }
            .total { font-weight: bold; font-size: 1.2em; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>Silver Maxwood Dairies</h1>
          <p style="text-align: center;">Milk Delivery Receipt</p>
          <hr />
          <div class="details">
            <p><strong>Date:</strong> ${formatDate(delivery.date)} ${delivery.time?.slice(0, 5) || ""}</p>
            <p><strong>Farmer:</strong> ${farmer?.name ?? "Unknown"} (Reg: ${farmer?.reg_no ?? "—"})</p>
            <p><strong>Quantity:</strong> ${delivery.quantity} L</p>
            <p><strong>Price/L:</strong> ${formatKSh(delivery.price_per_litre)}</p>
            <p><strong>Deductions:</strong> ${formatKSh(delivery.deductions)}</p>
          </div>
          <div class="total">
            <p>Net Paid: ${formatKSh(delivery.net_payable)}</p>
          </div>
          <p style="text-align: center; margin-top: 40px; font-size: 0.9em; color: #666;">Thank you for your business!</p>
        </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

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
                  <td className="px-4 py-3 flex items-center gap-2">
                    <StatusBadge status={d.payment_status} />
                    {d.payment_status === "PENDING" ? (
                      <MarkDeliveryPaidButton deliveryId={d.id} />
                    ) : (
                      <button
                        onClick={() => generateReceipt(d, farmerMap.get(d.farmer_id))}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-pasture-600 hover:text-pasture-700 transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Receipt
                      </button>
                    )}
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
              <th className="px-4 py-3 font-medium text-right">Actions</th>
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
                <td className="px-4 py-3 text-right">
                  <button 
                    onClick={() => setEditingFarmer(f)}
                    className="text-xs font-medium text-pasture-600 hover:text-pasture-700"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditFarmerModal farmer={editingFarmer} onClose={() => setEditingFarmer(null)} />
    </div>
  );
}
