"use client";

import { useRef, useState, useTransition } from "react";
import { addFarmer, logDelivery } from "@/app/collection/actions";
import type { Farmer } from "@/types/database";

export function AddFarmerForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addFarmer(formData);
      if (result?.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-display text-lg text-forest-900">Register farmer</h3>
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Reg. number</label>
        <input name="reg_no" type="text" required placeholder="FRM-201" className="input" />
      </div>
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Name</label>
        <input name="name" type="text" required className="input" />
      </div>
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Phone</label>
        <input name="phone" type="tel" className="input" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Payout method</label>
          <input name="bank_or_mobile_money" type="text" placeholder="M-Pesa" className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Price / litre (KSh)</label>
          <input name="price_per_litre" type="number" step="0.5" min="0" defaultValue={48} className="input" />
        </div>
      </div>
      {error && <p className="text-sm text-alert-red">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-pasture-600 hover:bg-pasture-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        {isPending ? "Saving…" : "Save farmer"}
      </button>
    </form>
  );
}

export function LogDeliveryForm({ farmers }: { farmers: Farmer[] }) {
  const [error, setError] = useState<string | null>(null);
  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const price = farmers.find((f) => f.id === selectedFarmer)?.price_per_litre;

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await logDelivery(formData);
      if (result?.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-display text-lg text-forest-900">Log delivery</h3>
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Farmer</label>
        <select
          name="farmer_id"
          required
          value={selectedFarmer}
          onChange={(e) => setSelectedFarmer(e.target.value)}
          className="input"
        >
          <option value="">Select farmer…</option>
          {farmers.map((f) => (
            <option key={f.id} value={f.id}>{f.reg_no} — {f.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Quantity (L)</label>
          <input name="quantity" type="number" step="0.1" min="0" required className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Price / litre (KSh)</label>
          <input name="price_per_litre" type="number" step="0.5" min="0" defaultValue={price ?? 48} className="input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Quality check</label>
          <select name="quality_status" className="input" defaultValue="ACCEPTED">
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Deductions (KSh)</label>
          <input name="deductions" type="number" step="0.5" min="0" defaultValue={0} className="input" />
        </div>
      </div>
      <input type="hidden" name="date" value={new Date().toISOString().slice(0, 10)} />
      {error && <p className="text-sm text-alert-red">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-pasture-600 hover:bg-pasture-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        {isPending ? "Saving…" : "Save delivery"}
      </button>
    </form>
  );
}
