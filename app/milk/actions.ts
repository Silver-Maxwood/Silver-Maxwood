"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addMilkRecord(formData: FormData) {
  const supabase = createClient();
  const cowId = formData.get("cow_id") as string;
  const date = (formData.get("date") as string) || new Date().toISOString().slice(0, 10);

  // Business rule: if this cow has an active medicine withdrawal period,
  // block the entry and surface the soft warning instead of silently saving.
  const { data: activeWithdrawal } = await supabase
    .from("health_records")
    .select("id, condition, withdrawal_end_date")
    .eq("cow_id", cowId)
    .not("withdrawal_end_date", "is", null)
    .gte("withdrawal_end_date", date)
    .order("withdrawal_end_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (activeWithdrawal) {
    return {
      error: `This cow is under medicine withdrawal (${activeWithdrawal.condition}) until ${activeWithdrawal.withdrawal_end_date}. Milk is NOT FOR SALE — record will not be saved.`,
    };
  }

  const morning = Number(formData.get("morning_litres") || 0);
  const evening = Number(formData.get("evening_litres") || 0);
  const isRejected = formData.get("is_rejected") === "on";

  const { error } = await supabase.from("milk_records").insert({
    date,
    cow_id: cowId,
    morning_litres: morning,
    evening_litres: evening,
    is_rejected: isRejected,
    rejection_reason: isRejected ? (formData.get("rejection_reason") as string) || null : null,
    buyer: (formData.get("buyer") as string) || null,
    price_per_litre: Number(formData.get("price_per_litre") || 0),
  });

  if (error) return { error: error.message };

  revalidatePath("/milk");
  revalidatePath("/");
  return { error: null };
}
