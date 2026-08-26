"use client";

import { useTransition, useState } from "react";
import { Plus } from "lucide-react";
import { addCalf } from "@/app/calves/actions";
import { useFormStatus } from "react-dom";
import type { Cow } from "@/types/database";
import { todayDDMMYYYY } from "@/lib/utils/format";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn btn-primary w-full sm:w-auto"
    >
      {pending ? "Adding..." : "Add Calf"}
    </button>
  );
}

export function AddCalfForm({ cows }: { cows: Cow[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function action(formData: FormData) {
    const res = await addCalf(formData);
    if (res?.error) {
      setError(res.error);
    } else {
      setError(null);
      setIsOpen(false);
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary text-sm shadow-sm flex items-center gap-2"
      >
        <Plus size={16} /> Add Calf
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-silver-200 flex justify-between items-center bg-silver-50">
          <h2 className="font-display text-xl text-forest-900">Add New Calf</h2>
          <button onClick={() => setIsOpen(false)} className="text-silver-400 hover:text-forest-900 transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-alert-red/10 text-alert-red rounded-lg text-sm">
              {error}
            </div>
          )}
          <form action={action} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">Tag Number *</label>
                <input
                  name="tag_number"
                  required
                  placeholder="e.g. CALF-001"
                  className="w-full px-3 py-2 border border-silver-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">Name</label>
                <input
                  name="name"
                  placeholder="e.g. Bella"
                  className="w-full px-3 py-2 border border-silver-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none transition-shadow"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">Date of Birth</label>
                <input
                  name="dob"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  defaultValue={todayDDMMYYYY()}
                  pattern="\d{2}/\d{2}/\d{4}"
                  className="w-full px-3 py-2 border border-silver-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">Sex</label>
                <select
                  name="sex"
                  className="w-full px-3 py-2 border border-silver-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none transition-shadow bg-white"
                >
                  <option value="FEMALE">Female / Heifer</option>
                  <option value="MALE">Male / Bull</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">Mother (Dam)</label>
                <select
                  name="dam_id"
                  className="w-full px-3 py-2 border border-silver-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none transition-shadow bg-white"
                >
                  <option value="">Unknown / External</option>
                  {cows.filter(c => c.sex === 'FEMALE').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.tag_number} {c.name ? `(${c.name})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">Father (Sire ID/Name)</label>
                <input
                  name="sire_text"
                  placeholder="e.g. Bull 402"
                  className="w-full px-3 py-2 border border-silver-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none transition-shadow"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">Breed</label>
                <input
                  name="breed"
                  placeholder="e.g. Holstein"
                  className="w-full px-3 py-2 border border-silver-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-forest-900 mb-1">Mode of Conception</label>
                <select
                  name="mode_of_conception"
                  className="w-full px-3 py-2 border border-silver-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none transition-shadow bg-white"
                >
                  <option value="">Unknown</option>
                  <option value="AI">Artificial Insemination (AI)</option>
                  <option value="Natural">Natural Service</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
