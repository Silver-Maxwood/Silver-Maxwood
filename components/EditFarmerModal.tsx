"use client";

import { useRef, useState, useTransition } from "react";
import { updateFarmer } from "@/app/collection/actions";
import type { Farmer } from "@/types/database";

export function EditFarmerModal({ farmer, onClose }: { farmer: Farmer | null; onClose: () => void }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!farmer) return null;

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await updateFarmer(farmer!.id, formData);
      if (result?.error) setError(result.error);
      else onClose();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-silver-200 flex justify-between items-center sticky top-0 bg-white">
          <h3 className="font-display text-lg text-forest-900">Edit Farmer</h3>
          <button onClick={onClose} className="text-silver-500 hover:text-forest-900 transition-colors text-2xl leading-none">&times;</button>
        </div>
        
        <form action={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-silver-600 mb-1">Reg. number</label>
            <input name="reg_no" type="text" required defaultValue={farmer.reg_no} className="input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-silver-600 mb-1">Name</label>
            <input name="name" type="text" required defaultValue={farmer.name} className="input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-silver-600 mb-1">Phone</label>
              <input name="phone" type="tel" defaultValue={farmer.phone ?? ""} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-silver-600 mb-1">National ID</label>
              <input name="national_id" type="text" defaultValue={farmer.national_id ?? ""} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-silver-600 mb-1">Payout method</label>
              <input name="bank_or_mobile_money" type="text" defaultValue={farmer.bank_or_mobile_money ?? ""} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-silver-600 mb-1">Price / litre (KSh)</label>
              <input name="price_per_litre" type="number" step="0.5" min="0" defaultValue={farmer.price_per_litre} className="input" />
            </div>
          </div>
          
          {error && <p className="text-sm text-alert-red">{error}</p>}
          
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-sm font-medium text-silver-600 hover:text-forest-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="bg-pasture-600 hover:bg-pasture-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              {isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
