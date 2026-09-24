"use client";

import { useTransition } from "react";
import { updateCowStatus } from "@/app/cows/actions";
import type { CowStatus } from "@/types/database";

const ALL_STATUSES: CowStatus[] = ["MILKING", "DRY", "PREGNANT", "CALF", "SICK", "SOLD", "DEAD"];

export function StatusDropdown({ cowId, currentStatus }: { cowId: string; currentStatus: CowStatus }) {
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as CowStatus;
    if (newStatus === currentStatus) return;

    startTransition(async () => {
      const result = await updateCowStatus(cowId, newStatus);
      if (result?.error) {
        alert("Failed to update status: " + result.error);
      }
    });
  }

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`text-xs font-medium rounded-full px-2 py-1 border transition-colors cursor-pointer outline-none ${
        isPending ? "opacity-50" : ""
      } bg-white border-silver-300 text-forest-900 hover:border-forest-900 focus:ring-2 focus:ring-forest-900/20`}
    >
      {ALL_STATUSES.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
