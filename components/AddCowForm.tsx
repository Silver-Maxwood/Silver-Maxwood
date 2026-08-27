"use client";

import { useRef, useState, useTransition } from "react";
import { Plus, X } from "lucide-react";
import { addCow } from "@/app/cows/actions";

export function AddCowForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addCow(formData);
      if (result?.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
        setOpen(false);
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 bg-pasture-600 hover:bg-pasture-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
      >
        <Plus size={16} /> Add cow
      </button>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg text-forest-900">Add a cow</h3>
        <button onClick={() => setOpen(false)} className="text-silver-600 hover:text-forest-900">
          <X size={18} />
        </button>
      </div>

      <form ref={formRef} action={handleSubmit} className="grid sm:grid-cols-2 gap-4">
        <Field label="Tag number" name="tag_number" required placeholder="SMD-101" />
        <Field label="Name" name="name" placeholder="Malaika" />
        <div>
          <Label>Breed</Label>
          <select name="breed" className="input" defaultValue="Friesian">
            {["Friesian", "Holstein", "Ayrshire", "Guernsey", "Jersey", "Sahiwal Cross", "Crossbreed", "Other"].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Sex</Label>
          <select name="sex" className="input" defaultValue="FEMALE">
            <option value="FEMALE">Female</option>
            <option value="MALE">Male</option>
          </select>
        </div>
        <Field label="Date of birth" name="dob" type="date" />
        <div>
          <Label>Status</Label>
          <select name="status" className="input" defaultValue="MILKING">
            {["MILKING", "DRY", "PREGNANT", "CALF", "SICK", "SOLD", "DEAD"].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <Field label="Source" name="source" placeholder="Born on farm / Purchased" />
        <Field label="Purchase price (KSh)" name="purchase_price" type="number" step="0.01" />

        {error && <p className="sm:col-span-2 text-sm text-alert-red">{error}</p>}

        <div className="sm:col-span-2 flex gap-3 pt-1">
          <button
            type="submit"
            disabled={isPending}
            className="bg-pasture-600 hover:bg-pasture-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            {isPending ? "Saving…" : "Save cow"}
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-sm font-medium px-4 py-2.5 rounded-lg text-silver-600 hover:bg-silver-100"
          >
            Cancel
          </button>
        </div>
      </form>

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
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-medium text-silver-600 mb-1">{children}</label>;
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  step?: string;
}) {
  return (
    <div>
      <Label>{label}{required && <span className="text-alert-red"> *</span>}</Label>
      <input name={name} type={type} required={required} placeholder={placeholder} step={step} className="input" />
    </div>
  );
}
