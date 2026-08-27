"use client";

import { useRef, useState, useTransition } from "react";
import { addGrowthRecord } from "@/app/calves/growth-actions";
import { Plus } from "lucide-react";

export function AddGrowthForm({ cowId }: { cowId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addGrowthRecord(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
        setIsOpen(false);
      }
    });
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-sm font-medium text-pasture-600 hover:text-pasture-700 transition-colors"
      >
        <Plus size={16} /> Add Measurement
      </button>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="p-4 bg-silver-50 border border-silver-200 rounded-xl space-y-3 mt-3">
      <h4 className="text-sm font-medium text-forest-900">New Growth Record</h4>
      
      <input type="hidden" name="cow_id" value={cowId} />
      
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Date</label>
          <input name="date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} required className="w-full px-2.5 py-1.5 text-sm border border-silver-200 rounded-lg outline-none focus:ring-2 focus:ring-pasture-500" />
        </div>
        <div></div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Weight (kg)</label>
          <input name="weight" type="number" step="0.1" placeholder="e.g. 45" className="w-full px-2.5 py-1.5 text-sm border border-silver-200 rounded-lg outline-none focus:ring-2 focus:ring-pasture-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Height (cm)</label>
          <input name="height" type="number" step="0.1" placeholder="e.g. 85" className="w-full px-2.5 py-1.5 text-sm border border-silver-200 rounded-lg outline-none focus:ring-2 focus:ring-pasture-500" />
        </div>
      </div>

      {error && <p className="text-xs text-alert-red">{error}</p>}

      <div className="flex gap-2 justify-end pt-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="text-xs font-medium text-silver-600 hover:text-forest-900 px-3 py-1.5"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="bg-pasture-600 hover:bg-pasture-700 text-white text-xs font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save Record"}
        </button>
      </div>
    </form>
  );
}
