"use client";

import { Printer, Download } from "lucide-react";
import type { MonthlyReportData } from "@/types/database";
import { formatDate } from "@/lib/utils/format";

export function ReportExportButtons({ data }: { data: MonthlyReportData }) {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadCsv = () => {
    const lines: string[] = [];

    // Header metadata
    lines.push(`"SILVER MAXWOOD DAIRIES - MONTHLY FARM REPORT"`);
    lines.push(`"Report Period","${formatDate(data.startDate)} to ${formatDate(data.endDate)}"`);
    lines.push(`"Month","${data.monthLabel}"`);
    lines.push(`"Generated At","${new Date().toISOString()}"`);
    lines.push("");

    // Section 1: Executive Summary
    lines.push(`"--- EXECUTIVE SUMMARY ---"`);
    lines.push(`"Metric","Value"`);
    lines.push(`"Total Milk Production (L)","${data.totals.totalMilkLitres}"`);
    lines.push(`"Accepted Milk (L)","${data.totals.acceptedMilkLitres}"`);
    lines.push(`"Rejected Milk (L)","${data.totals.rejectedMilkLitres}"`);
    lines.push(`"Morning Milk (L)","${data.totals.morningMilkLitres}"`);
    lines.push(`"Evening Milk (L)","${data.totals.eveningMilkLitres}"`);
    lines.push(`"Daily Average Production (L/day)","${data.totals.avgLitresPerDay}"`);
    lines.push(`"Active Milking Cows","${data.totals.activeMilkingCows}"`);
    lines.push(`"Average Yield Per Milking Cow (L/cow/day)","${data.totals.avgLitresPerCowDay}"`);
    lines.push(`"Gross Milk Income (KSh)","${data.totals.milkIncome}"`);
    lines.push(`"Other Income (KSh)","${data.totals.otherIncome}"`);
    lines.push(`"Total Gross Revenue (KSh)","${data.totals.totalIncome}"`);
    lines.push(`"Total Feed Cost (KSh)","${data.totals.feedCost}"`);
    lines.push(`"Other Operating Expenses (KSh)","${data.totals.otherExpenses}"`);
    lines.push(`"Total Operational Costs (KSh)","${data.totals.totalExpenses}"`);
    lines.push(`"Net Farm Margin / Profit (KSh)","${data.totals.netProfit}"`);
    lines.push(`"Feed Cost Per Litre Produced (KSh/L)","${data.totals.feedCostPerLitre}"`);
    lines.push(`"Average Milk Price Realized (KSh/L)","${data.totals.avgMilkPricePerLitre}"`);
    lines.push(`"Calvings Recorded","${data.totals.calvingsCount}"`);
    lines.push(`"AI Services Logged","${data.totals.aiServicesCount}"`);
    lines.push(`"Health Treatments Logged","${data.totals.treatmentsCount}"`);
    lines.push(`"Collection Hub Volume (L)","${data.totals.collectionLitres}"`);
    lines.push(`"Collection Payouts (KSh)","${data.totals.collectionPayout}"`);
    lines.push("");

    // Section 2: Top Producing Cows
    lines.push(`"--- TOP PRODUCING COWS ---"`);
    lines.push(`"Tag Number","Name","Breed","Total Litres (L)","Days Milked","Avg Daily (L/day)"`);
    for (const cow of data.topCows) {
      lines.push(`"${cow.tagNumber}","${cow.name || ""}","${cow.breed || ""}","${cow.totalLitres}","${cow.daysMilked}","${cow.avgDaily}"`);
    }
    lines.push("");

    // Section 3: Daily Milk Records
    lines.push(`"--- DAILY MILK PRODUCTION ---"`);
    lines.push(`"Date","Accepted Litres (L)","Rejected Litres (L)","Total Litres (L)","Income (KSh)"`);
    for (const d of data.dailyProduction) {
      lines.push(`"${formatDate(d.date)}","${d.acceptedLitres}","${d.rejectedLitres}","${d.totalLitres}","${d.income}"`);
    }
    lines.push("");

    // Section 4: Expense Breakdown
    lines.push(`"--- EXPENSES BY CATEGORY ---"`);
    lines.push(`"Category","Amount (KSh)"`);
    for (const exp of data.expenseByCategory) {
      lines.push(`"${exp.category}","${exp.amount}"`);
    }
    lines.push("");

    // Section 5: Feed Breakdown
    lines.push(`"--- FEED COST BREAKDOWN ---"`);
    lines.push(`"Feed Type","Quantity","Unit","Total Cost (KSh)"`);
    for (const f of data.feedByType) {
      lines.push(`"${f.feedType}","${f.quantity}","${f.unit}","${f.amount}"`);
    }

    const csvContent = "data:text/csv;charset=utf-8," + encodeURIComponent(lines.join("\n"));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", csvContent);
    downloadAnchor.setAttribute(
      "download",
      `Silver_Maxwood_Dairies_Report_${data.year}_${String(data.month).padStart(2, "0")}.csv`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  return (
    <div className="flex items-center gap-2.5 print:hidden">
      <button
        onClick={handleDownloadCsv}
        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-silver-200 bg-white hover:bg-silver-100 text-forest-900 text-sm font-medium transition-colors shadow-sm"
      >
        <Download size={16} className="text-silver-600" />
        <span>Export CSV</span>
      </button>

      <button
        onClick={handlePrint}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-pasture-600 hover:bg-pasture-500 text-white text-sm font-medium transition-colors shadow-sm"
      >
        <Printer size={16} />
        <span>Print / Save PDF</span>
      </button>
    </div>
  );
}
