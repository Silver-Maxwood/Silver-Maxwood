"use client";

import { useRef, useState, useTransition } from "react";
import { logAiService, logHealthEvent } from "@/app/breeding/actions";
import type { Cow } from "@/types/database";

function todayDDMMYYYY() {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

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

      {/* Cow */}
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Cow</label>
        <CowSelect cows={cows} />
      </div>

      {/* AI date */}
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">AI date</label>
        <input name="ai_date" type="text" required placeholder="DD/MM/YYYY" pattern="\d{2}/\d{2}/\d{4}" defaultValue={todayDDMMYYYY()} className="input" />
      </div>

      {/* Heat date */}
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Heat date</label>
        <input name="heat_date" type="text" placeholder="DD/MM/YYYY" pattern="\d{2}/\d{2}/\d{4}" className="input" />
      </div>

      {/* Technician */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">AI technician</label>
          <input name="technician" type="text" className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Technician contact</label>
          <input name="technician_id" type="text" placeholder="Phone number" className="input" />
        </div>
      </div>

      {/* Semen details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Semen company</label>
          <input name="semen_company" type="text" className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Semen type</label>
          <select name="semen_type" className="input">
            <option value="">Select type…</option>
            <option value="sexed">Sexed</option>
            <option value="conventional">Conventional</option>
          </select>
        </div>
      </div>

      {/* Bull details */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Bull name</label>
          <input name="bull_name" type="text" className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Bull ID / code</label>
          <input name="bull_id" type="text" className="input" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Breed of bull</label>
        <input name="breed_of_bull" type="text" className="input" />
      </div>

      {/* Semen batch & straw */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Semen batch / lot number</label>
          <input name="semen_batch" type="text" className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Straw number</label>
          <input name="straw_number" type="text" className="input" />
        </div>
      </div>

      {/* Semen cost */}
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Semen cost</label>
        <input name="semen_cost" type="number" min="0" step="0.01" placeholder="0.00" className="input" />
      </div>

      {/* AI service number & method */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">AI service number</label>
          <select name="service_number" className="input">
            <option value="">Select…</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Method</label>
          <select name="method" className="input">
            <option value="">Select…</option>
            <option value="ai">AI</option>
            <option value="natural">Natural service</option>
          </select>
        </div>
      </div>

      {/* Remarks */}
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Remarks</label>
        <textarea name="remarks" rows={3} className="input resize-none" placeholder="Any additional notes…" />
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
          <label className="block text-xs font-medium text-silver-600 mb-1">Vet name</label>
          <input name="vet" type="text" className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Vet contact</label>
          <input name="vet_contact" type="text" placeholder="Phone number" className="input" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Date of treatment</label>
          <input
            name="date"
            type="text"
            required
            placeholder="DD/MM/YYYY"
            pattern="\d{2}/\d{2}/\d{4}"
            defaultValue={todayDDMMYYYY()}
            className="input"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Withdrawal days</label>
          <input name="withdrawal_days" type="number" min="0" defaultValue={0} className="input" />
        </div>
      </div>
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
