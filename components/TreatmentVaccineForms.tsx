"use client";

import { useRef, useState, useTransition } from "react";
import { logVaccine } from "@/app/treatment/actions";
import { useFormStatus } from "react-dom";
import type { Cow } from "@/types/database";
import { todayDDMMYYYY } from "@/lib/utils/format";

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

export function VaccineForm({ cows }: { cows: Cow[] }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await logVaccine(formData);
      if (result?.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  return (
    <form ref={formRef} action={handleSubmit} className="card p-5 space-y-4">
      <h3 className="font-display text-lg text-forest-900">Log vaccine</h3>

      {/* Cow */}
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Cow</label>
        <CowSelect cows={cows} />
      </div>

      {/* Disease & Vaccine type */}
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Disease / condition vaccinated against</label>
        <input name="disease" type="text" required placeholder="e.g. FMD, Brucellosis, Anthrax…" className="input" />
      </div>

      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Type of vaccine</label>
        <input name="vaccine_type" type="text" placeholder="e.g. Killed, Live attenuated…" className="input" />
      </div>

      {/* Dosage */}
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Dosage</label>
        <input name="dosage" type="text" placeholder="e.g. 2 ml IM" className="input" />
      </div>

      {/* Vet name & contact */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Vet name</label>
          <input name="vet_name" type="text" className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Vet contact</label>
          <input name="vet_contact" type="text" placeholder="Phone number" className="input" />
        </div>
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-medium text-silver-600 mb-1">Date of vaccine</label>
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

      {error && <p className="text-sm text-alert-red">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-pasture-600 hover:bg-pasture-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        {isPending ? "Saving…" : "Save vaccine record"}
      </button>
    </form>
  );
}
