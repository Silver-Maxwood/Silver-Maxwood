"use client";

import { useTransition } from "react";
import { deleteFarmer } from "@/app/collection/actions";
import { Trash2 } from "lucide-react";

export function DeleteFarmerButton({ farmerId, farmerName }: { farmerId: string; farmerName: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete farmer ${farmerName}? This will also delete all their delivery records.`)) {
      startTransition(async () => {
        const result = await deleteFarmer(farmerId);
        if (result?.error) {
          alert(`Failed to delete farmer: ${result.error}`);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-xs font-medium text-alert-red hover:text-alert-red/80 disabled:opacity-50 transition-colors inline-flex items-center gap-1 ml-3"
      title="Delete Farmer"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {isPending ? "..." : "Delete"}
    </button>
  );
}
