"use client";

import { useTransition } from "react";
import { markDeliveryPaid } from "@/app/collection/actions";

export function MarkDeliveryPaidButton({ deliveryId }: { deliveryId: string }) {
  const [isPending, startTransition] = useTransition();

  const handlePay = () => {
    if (confirm("Mark this delivery as paid and create an expense record?")) {
      startTransition(async () => {
        const result = await markDeliveryPaid(deliveryId);
        if (result?.error) {
          alert("Error: " + result.error);
        }
      });
    }
  };

  return (
    <button
      onClick={handlePay}
      disabled={isPending}
      className="ml-2 text-xs font-medium text-white bg-pasture-600 hover:bg-pasture-700 px-2 py-1 rounded transition-colors disabled:opacity-50"
    >
      {isPending ? "..." : "Pay"}
    </button>
  );
}
