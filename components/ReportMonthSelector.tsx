"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface ReportMonthSelectorProps {
  currentYear: number;
  currentMonth: number;
  startDate: string;
  endDate: string;
}

export function ReportMonthSelector({
  currentYear,
  currentMonth,
  startDate,
  endDate,
}: ReportMonthSelectorProps) {
  const router = useRouter();

  const handlePrev = () => {
    let y = currentYear;
    let m = currentMonth - 1;
    if (m < 1) {
      m = 12;
      y -= 1;
    }
    const monthStr = `${y}-${String(m).padStart(2, "0")}`;
    router.push(`/reports?month=${monthStr}`);
  };

  const handleNext = () => {
    let y = currentYear;
    let m = currentMonth + 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
    const monthStr = `${y}-${String(m).padStart(2, "0")}`;
    router.push(`/reports?month=${monthStr}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      router.push(`/reports?month=${e.target.value}`);
    }
  };

  const monthValue = `${currentYear}-${String(currentMonth).padStart(2, "0")}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrev}
          title="Previous month"
          className="p-2 rounded-lg border border-silver-200 bg-white hover:bg-silver-100 text-forest-900 transition-colors shadow-sm"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="relative flex items-center">
          <input
            type="month"
            value={monthValue}
            onChange={handleChange}
            className="pl-9 pr-3 py-1.5 rounded-lg border border-silver-200 bg-white text-sm font-medium text-forest-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-pasture-600"
          />
          <Calendar size={16} className="absolute left-3 text-silver-500 pointer-events-none" />
        </div>

        <button
          onClick={handleNext}
          title="Next month"
          className="p-2 rounded-lg border border-silver-200 bg-white hover:bg-silver-100 text-forest-900 transition-colors shadow-sm"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="text-xs text-silver-600 bg-silver-100 px-3 py-1.5 rounded-full font-medium">
        Period: <span className="text-forest-900 font-semibold">{formatDate(startDate)}</span> to{" "}
        <span className="text-forest-900 font-semibold">{formatDate(endDate)}</span>
      </div>
    </div>
  );
}
