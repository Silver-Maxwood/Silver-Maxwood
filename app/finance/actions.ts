"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ExpenseCategory, IncomeCategory } from "@/types/database";

export async function addExpense(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("expenses").insert({
    date: (formData.get("date") as string) || new Date().toISOString().slice(0, 10),
    category: formData.get("category") as ExpenseCategory,
    amount: Number(formData.get("amount") || 0),
    description: (formData.get("description") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/finance");
  revalidatePath("/");
  return { error: null };
}

export async function addIncome(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("incomes").insert({
    date: (formData.get("date") as string) || new Date().toISOString().slice(0, 10),
    category: formData.get("category") as IncomeCategory,
    amount: Number(formData.get("amount") || 0),
    description: (formData.get("description") as string) || null,
  });
  if (error) return { error: error.message };
  revalidatePath("/finance");
  revalidatePath("/");
  return { error: null };
}
