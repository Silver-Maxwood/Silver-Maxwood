"use client";

import { useState, useTransition } from "react";
import { markFeedSalePaid } from "@/app/feed/actions";

export function MarkFeedSalePaidButton({ saleId }: { saleId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const res = await markFeedSalePaid(saleId);
      if (res?.error) alert(res.error);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-xs font-medium bg-forest-900 text-white px-2 py-1 rounded hover:bg-forest-800 disabled:opacity-50 transition-colors whitespace-nowrap"
    >
      {isPending ? "Updating…" : "Mark Paid"}
    </button>
  );
}
