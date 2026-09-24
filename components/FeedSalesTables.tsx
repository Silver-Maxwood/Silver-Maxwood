"use client";

import { useState } from "react";
import { Search, Printer } from "lucide-react";
import type { FeedSale } from "@/types/database";
import { formatKSh, formatDate } from "@/lib/utils/format";
import { StatusBadge } from "@/components/StatusBadge";
import { MarkFeedSalePaidButton } from "@/components/MarkFeedSalePaidButton";

export function FeedSalesTables({ sales }: { sales: FeedSale[] }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSales = sales.filter((s) => {
    const term = searchQuery.toLowerCase();
    return (
      s.buyer_name.toLowerCase().includes(term) ||
      (s.phone_number && s.phone_number.includes(term)) ||
      (s.national_id && s.national_id.includes(term))
    );
  });

  const generateReceipt = (sale: FeedSale) => {
    // In a real app, you might render a PDF or a hidden printable div.
    // For now, we will open a simple print window.
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
          <p style="text-align: center;">Feed Sale Receipt</p>
          <hr />
          <div class="details">
            <p><strong>Date:</strong> ${formatDate(sale.date)}</p>
            <p><strong>Buyer:</strong> ${sale.buyer_name}</p>
            <p><strong>Phone:</strong> ${sale.phone_number || "N/A"}</p>
            <p><strong>ID:</strong> ${sale.national_id || "N/A"}</p>
            <p><strong>Quantity:</strong> ${sale.quantity_kg} kg</p>
            <p><strong>Price/kg:</strong> ${formatKSh(sale.price_per_kg)}</p>
          </div>
          <div class="total">
            <p>Total Paid: ${formatKSh(sale.total_amount)}</p>
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
    <div className="card overflow-hidden flex flex-col">
      <div className="p-5 border-b border-silver-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50">
        <h3 className="font-display text-lg text-forest-900">Recent Sales</h3>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-400" />
          <input
            type="text"
            placeholder="Search buyers…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 text-sm py-2"
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-silver-500 bg-silver-50 border-b border-silver-200">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Buyer</th>
              <th className="px-4 py-3 font-medium">Phone / ID</th>
              <th className="px-4 py-3 font-medium text-right">Quantity (kg)</th>
              <th className="px-4 py-3 font-medium text-right">Amount</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-silver-100">
            {filteredSales.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-silver-500">
                  No sales found.
                </td>
              </tr>
            ) : (
              filteredSales.map((s) => (
                <tr key={s.id} className="hover:bg-silver-50/50 transition-colors group">
                  <td className="px-4 py-3 text-forest-900 font-medium">{formatDate(s.date)}</td>
                  <td className="px-4 py-3 text-silver-600">{s.buyer_name}</td>
                  <td className="px-4 py-3 text-silver-600">
                    <div>{s.phone_number || "—"}</div>
                    <div className="text-xs text-silver-400">{s.national_id || "—"}</div>
                  </td>
                  <td className="px-4 py-3 text-silver-600 text-right">{s.quantity_kg}</td>
                  <td className="px-4 py-3 text-forest-900 font-medium text-right">{formatKSh(s.total_amount)}</td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status={s.payment_status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {s.payment_status === "PENDING" ? (
                      <MarkFeedSalePaidButton saleId={s.id} />
                    ) : (
                      <button
                        onClick={() => generateReceipt(s)}
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
    </div>
  );
}
