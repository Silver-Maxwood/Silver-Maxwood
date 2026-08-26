"use client";

import { useRef, useState, useTransition } from "react";
import { addExpense, addIncome } from "@/app/finance/actions";

const EXPENSE_CATEGORIES = ["FEED", "VET", "LABOUR", "UTILITIES", "FUEL", "REPAIRS", "EQUIPMENT", "LOAN", "OTHER"];
const INCOME_CATEGORIES = ["MILK", "CALF_SALE", "COW_SALE", "MANURE", "BREEDING", "OTHER"];

export function ExpenseIncomeForm() {
  const [mode, setMode] = useState<"expense" | "income">("expense");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = mode === "expense" ? await addExpense(formData) : await addIncome(formData);
      if (result?.error) setError(result.error);
      else formRef.current?.reset();
    });
  }

  const categories = mode === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  return (
    <div className="card p-5 space-y-4">
      <div className="flex rounded-lg border border-silver-200 overflow-hidden text-sm font-medium">
        <button
          onClick={() => setMode("expense")}
          className={mode === "expense" ? "flex-1 bg-forest-900 text-white py-2" : "flex-1 bg-white text-silver-600 py-2"}
        >
          Expense
        </button>
        <button
          onClick={() => setMode("income")}
          className={mode === "income" ? "flex-1 bg-forest-900 text-white py-2" : "flex-1 bg-white text-silver-600 py-2"}
        >
          Income
        </button>
      </div>

      <form ref={formRef} action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Category</label>
          <select name="category" className="input" required>
            {categories.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Amount (KSh)</label>
          <input name="amount" type="number" step="0.01" min="0" required className="input" />
        </div>
        <div>
          <label className="block text-xs font-medium text-silver-600 mb-1">Description</label>
          <input name="description" type="text" className="input" />
        </div>
        <input type="hidden" name="date" value={new Date().toISOString().slice(0, 10)} />

        {error && <p className="text-sm text-alert-red">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-pasture-600 hover:bg-pasture-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          {isPending ? "Saving…" : `Save ${mode}`}
        </button>
      </form>
    </div>
  );
}
