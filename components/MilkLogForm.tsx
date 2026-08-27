"use client";

import { useRef, useState, useTransition } from "react";
import { AlertTriangle } from "lucide-react";
import { addMilkRecord } from "@/app/milk/actions";
import type { Cow } from "@/types/database";

export function MilkLogForm({ cows, withdrawalCowIds }: { cows: Cow[]; withdrawalCowIds: Set<string> }) {
  const [error, setError] = useState<string | null>(null);
  const [selectedCow, setSelectedCow] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const milkingCows = cows.filter((c) => c.status === "MILKING" || c.status === "SICK");
  const flagged = selectedCow && withdrawalCowIds.has(selectedCow);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addMilkRecord(formData);
      if (result?.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-display text-lg text-forest-900">Log today's milk</h3>

      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Cow</label>
        <select
          name="cow_id"
          required
          value={selectedCow}
          onChange={(e) => setSelectedCow(e.target.value)}
          className="input"
        >
          <option value="">Select cow…</option>
          {milkingCows.map((c) => (
            <option key={c.id} value={c.id}>
              {c.tag_number} {c.name ? `— ${c.name}` : ""} {withdrawalCowIds.has(c.id) ? "(withdrawal active)" : ""}
            </option>
          ))}
        </select>
      </div>

      {flagged && (
        <div className="flex items-start gap-2 bg-alert-red-bg border border-alert-red/30 rounded-lg px-3 py-2.5 text-sm text-alert-red">
          <AlertTriangle size={16} className="mt-0.5 shrink-0" />
          <span>This cow is under medicine withdrawal. Its milk is NOT FOR SALE and this entry will be blocked.</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Morning (L)</label>
          <input name="morning_litres" type="number" step="0.1" min="0" defaultValue={0} className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Evening (L)</label>
          <input name="evening_litres" type="number" step="0.1" min="0" defaultValue={0} className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Price / litre (KSh)</label>
          <input name="price_per_litre" type="number" step="0.5" min="0" defaultValue={52} className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Buyer</label>
          <input name="buyer" type="text" placeholder="Brookside, KCC…" className="input" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-forest-900">
        <input name="is_rejected" type="checkbox" className="rounded border-silver-300" />
        Mark as rejected
      </label>

      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Rejection reason (if rejected)</label>
        <input name="rejection_reason" type="text" placeholder="e.g. High SCC" className="input" />
      </div>

      <div className="pt-2 border-t border-silver-200 mt-6">
        <h4 className="font-display text-md text-forest-900 mb-4">Quality Metrics</h4>
        <div className="p-4 bg-silver-50 border border-silver-200 rounded-xl space-y-4">
           <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             <div><label className="block text-xs font-medium text-silver-600 mb-1">Receiving Temp</label><input name="temp" type="number" step="0.1" placeholder="16.4" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">B.f (%)</label><input name="fat" type="number" step="0.1" placeholder="3.4" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">Snf</label><input name="snf" type="number" step="0.1" placeholder="9.0" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">Fp</label><input name="freezing_point" type="number" step="0.001" placeholder="-0.550" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">Specific Gravity</label><input name="density" type="number" step="0.001" placeholder="1.028" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">Proteins</label><input name="protein" type="number" step="0.1" placeholder="3.0" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">Ph</label><input name="ph" type="number" step="0.01" placeholder="6.78" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">TTA</label><input name="tta" type="number" step="0.1" placeholder="6.2" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">Sensory</label><input name="sensory" type="text" placeholder="e.g. ok" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">Resazurin</label><input name="resazurin" type="text" placeholder="e.g. 4(pass)" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">Aflatoxin (ppt)</label><input name="aflatoxin" type="number" step="0.1" placeholder="220" className="input" /></div>
             <div><label className="block text-xs font-medium text-silver-600 mb-1">Peroxide</label><input name="peroxide" type="text" placeholder="e.g. nil" className="input" /></div>
           </div>
           
           <div className="flex gap-6 mt-3">
             <label className="flex items-center gap-2 text-sm text-forest-900"><input name="antibiotic_residue" type="checkbox" className="rounded border-silver-300" /> Antibiotics Positive (+ve)</label>
             <label className="flex items-center gap-2 text-sm text-forest-900"><input name="frothing" type="checkbox" value="PASS" className="rounded border-silver-300" defaultChecked /> Frothing (Pass)</label>
           </div>
        </div>
      </div>

      <input type="hidden" name="date" value={new Date().toISOString().slice(0, 10)} />

      {error && <p className="text-sm text-alert-red">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-pasture-600 hover:bg-pasture-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        {isPending ? "Saving…" : "Save milk entry"}
      </button>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.55rem 0.75rem;
          font-size: 0.875rem;
          background: white;
        }
        .input:focus {
          outline: 2px solid #16a34a;
          outline-offset: 1px;
        }
      `}</style>
    </form>
  );
}
