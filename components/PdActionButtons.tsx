"use client";

import { useTransition } from "react";
import { updatePdResult } from "@/app/breeding/actions";
import { StatusBadge } from "@/components/StatusBadge";
import { Check, X } from "lucide-react";

interface Props {
  recordId: string;
  cowId: string;
  currentResult: string | null;
}

export function PdActionButtons({ recordId, cowId, currentResult }: Props) {
  const [isPending, startTransition] = useTransition();

  if (currentResult && currentResult !== "PENDING") {
    return <StatusBadge status={currentResult} />;
  }

  function handleUpdate(result: 'POSITIVE' | 'NEGATIVE') {
    startTransition(async () => {
      await updatePdResult(recordId, cowId, result);
    });
  }

  return (
    <div className="flex items-center gap-1.5">
      <StatusBadge status="PENDING" />
      <button
        onClick={() => handleUpdate('POSITIVE')}
        disabled={isPending}
        title="Confirm Pregnant"
        className="p-1 rounded bg-pasture-50 text-pasture-600 hover:bg-pasture-100 disabled:opacity-50 transition-colors"
      >
        <Check size={14} strokeWidth={2.5} />
      </button>
      <button
        onClick={() => handleUpdate('NEGATIVE')}
        disabled={isPending}
        title="Confirm Not Pregnant"
        className="p-1 rounded bg-alert-red/10 text-alert-red hover:bg-alert-red/20 disabled:opacity-50 transition-colors"
      >
        <X size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}
