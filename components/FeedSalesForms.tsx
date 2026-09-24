"use client";

import { useRef, useState, useTransition } from "react";
import { logFeedSale } from "@/app/feed/actions";
import { todayDDMMYYYY } from "@/lib/utils/format";

export function FeedSalesForms() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await logFeedSale(formData);
      if (result?.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-display text-lg text-forest-900">Record Feed Sale</h3>
      
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Date</label>
        <input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="input" />
      </div>

      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Buyer Name</label>
        <input name="buyer_name" type="text" required className="input" placeholder="Name of buyer" />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Phone Number</label>
          <input name="phone_number" type="tel" className="input" placeholder="Phone" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">National ID</label>
          <input name="national_id" type="text" className="input" placeholder="ID Number" />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Quantity (KG)</label>
          <input name="quantity_kg" type="number" min="0" step="0.5" required className="input" placeholder="0" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Price / KG</label>
          <input name="price_per_kg" type="number" min="0" step="1" required className="input" placeholder="0.00" />
        </div>
      </div>
      
      {error && <p className="text-sm text-alert-red">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-pasture-600 hover:bg-pasture-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors mt-2"
      >
        {isPending ? "Saving…" : "Log Sale"}
      </button>
    </form>
  );
}
