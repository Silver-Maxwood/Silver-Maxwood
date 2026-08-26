"use client";

import { useRef, useState, useTransition } from "react";
import { logAiService, logHealthEvent } from "@/app/breeding/actions";
import type { Cow } from "@/types/database";

function CowSelect({ cows }: { cows: Cow[] }) {
  return (
    <select name="cow_id" required className="input">
      <option value="">Select cow…</option>
      {cows.map((c) => (
        <option key={c.id} value={c.id}>
          {c.tag_number} {c.name ? `— ${c.name}` : ""}
        </option>
      ))}
    </select>
  );
}

export function AiServiceForm({ cows }: { cows: Cow[] }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await logAiService(formData);
      if (result?.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-display text-lg text-forest-900">Log AI service</h3>
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Cow</label>
        <CowSelect cows={cows} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Heat date</label>
          <input name="heat_date" type="date" className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">AI date</label>
          <input name="ai_date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="input" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Semen used</label>
        <input name="semen_used" type="text" placeholder="Friesian Sexed Semen #..." className="input" />
      </div>
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Technician</label>
        <input name="technician" type="text" className="input" />
      </div>
      {error && <p className="text-sm text-alert-red">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-pasture-600 hover:bg-pasture-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        {isPending ? "Saving…" : "Save AI record"}
      </button>
    </form>
  );
}

export function HealthEventForm({ cows }: { cows: Cow[] }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await logHealthEvent(formData);
      if (result?.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-display text-lg text-forest-900">Log treatment</h3>
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Cow</label>
        <CowSelect cows={cows} />
      </div>
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Condition</label>
        <input name="condition" type="text" required placeholder="Mastitis, foot rot…" className="input" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Medicine</label>
          <input name="medicine" type="text" className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Dosage</label>
          <input name="dosage" type="text" className="input" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Treatment notes</label>
        <input name="treatment" type="text" className="input" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Vet</label>
          <input name="vet" type="text" className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Withdrawal days</label>
          <input name="withdrawal_days" type="number" min="0" defaultValue={0} className="input" />
        </div>
      </div>
      <input type="hidden" name="date" value={new Date().toISOString().slice(0, 10)} />
      {error && <p className="text-sm text-alert-red">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-pasture-600 hover:bg-pasture-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        {isPending ? "Saving…" : "Save treatment"}
      </button>
    </form>
  );
}
