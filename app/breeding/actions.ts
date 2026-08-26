"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logAiService(formData: FormData) {
  const supabase = createClient();
  
  function parseDDMMYYYY(dateStr: string | null): string | null {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  }

  const aiDateStr = formData.get("ai_date") as string;
  const aiDate = parseDDMMYYYY(aiDateStr) || new Date().toISOString().slice(0, 10);
  const expected = new Date(aiDate);
  expected.setDate(expected.getDate() + 283); // ~gestation length for cattle

  const { error } = await supabase.from("breeding_records").insert({
    cow_id: formData.get("cow_id") as string,
    heat_date: parseDDMMYYYY(formData.get("heat_date") as string),
    ai_date: aiDate,
    semen_used: (formData.get("semen_used") as string) || null,
    technician: (formData.get("technician") as string) || null,
    pd_result: "PENDING",
    expected_calving_date: expected.toISOString().slice(0, 10),
    services_count: 1,
  });

  if (error) return { error: error.message };
  revalidatePath("/breeding");
  revalidatePath("/");
  return { error: null };
}

export async function logHealthEvent(formData: FormData) {
  const supabase = createClient();

  function parseDDMMYYYY(dateStr: string | null): string | null {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  }

  const dateStr = formData.get("date") as string;
  const date = parseDDMMYYYY(dateStr) || new Date().toISOString().slice(0, 10);
  const withdrawalDays = Number(formData.get("withdrawal_days") || 0);
  let withdrawalEnd: string | null = null;
  if (withdrawalDays > 0) {
    const end = new Date(date);
    end.setDate(end.getDate() + withdrawalDays);
    withdrawalEnd = end.toISOString().slice(0, 10);
  }

  const { error } = await supabase.from("health_records").insert({
    cow_id: formData.get("cow_id") as string,
    condition: formData.get("condition") as string,
    treatment: (formData.get("treatment") as string) || null,
    medicine: (formData.get("medicine") as string) || null,
    dosage: (formData.get("dosage") as string) || null,
    vet: (formData.get("vet") as string) || null,
    date,
    withdrawal_days: withdrawalDays,
    withdrawal_end_date: withdrawalEnd,
  });

  if (error) return { error: error.message };
  revalidatePath("/breeding");
  revalidatePath("/milk");
  revalidatePath("/");
  return { error: null };
}

export async function updatePdResult(recordId: string, cowId: string, result: 'POSITIVE' | 'NEGATIVE') {
  const supabase = createClient();
  
  // Update breeding record
  const { error: breedingError } = await supabase
    .from("breeding_records")
    .update({ pd_result: result, pd_date: new Date().toISOString().slice(0, 10) })
    .eq("id", recordId);

  if (breedingError) return { error: breedingError.message };

  // Update cow status
  const newStatus = result === 'POSITIVE' ? 'PREGNANT' : 'MILKING';
  const { error: cowError } = await supabase
    .from("cows")
    .update({ status: newStatus })
    .eq("id", cowId);

  if (cowError) return { error: cowError.message };

  revalidatePath("/breeding");
  revalidatePath("/cows");
  revalidatePath("/");
  return { error: null };
}
