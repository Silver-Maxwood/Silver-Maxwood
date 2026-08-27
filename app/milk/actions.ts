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

  // Check if quality metrics are provided
  if (formData.get("has_quality_metrics") === "on") {
    const { error: qualityError } = await supabase.from("milk_quality_records").insert({
      date,
      cow_id: cowId,
      fat: formData.get("fat") ? Number(formData.get("fat")) : null,
      protein: formData.get("protein") ? Number(formData.get("protein")) : null,
      snf: formData.get("snf") ? Number(formData.get("snf")) : null,
      density: formData.get("density") ? Number(formData.get("density")) : null,
      freezing_point: formData.get("freezing_point") ? Number(formData.get("freezing_point")) : null,
      ph: formData.get("ph") ? Number(formData.get("ph")) : null,
      tta: formData.get("tta") ? Number(formData.get("tta")) : null,
      resazurin: (formData.get("resazurin") as string) || null,
      aflatoxin: formData.get("aflatoxin") ? Number(formData.get("aflatoxin")) : null,
      antibiotic_residue: formData.get("antibiotic_residue") === "on",
      temp: formData.get("temp") ? Number(formData.get("temp")) : null,
      sensory: (formData.get("sensory") as string) || null,
      frothing: (formData.get("frothing") as any) || null,
      peroxide: (formData.get("peroxide") as string) || null,
      status: isRejected ? "REJECTED" : "ACCEPTED",
    });

    if (qualityError) return { error: qualityError.message };
  }

  revalidatePath("/milk");
  revalidatePath("/");
  return { error: null };
}
