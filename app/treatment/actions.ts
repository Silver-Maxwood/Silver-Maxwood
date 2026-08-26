"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logVaccine(formData: FormData) {
  const supabase = createClient();
  function parseDDMMYYYY(dateStr: string | null): string | null {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  }

  const { error } = await supabase.from("vaccine_records").insert({
    cow_id: formData.get("cow_id") as string,
    disease: formData.get("disease") as string,
    vaccine_type: (formData.get("vaccine_type") as string) || null,
    dosage: (formData.get("dosage") as string) || null,
    vet_name: (formData.get("vet_name") as string) || null,
    vet_contact: (formData.get("vet_contact") as string) || null,
    date: parseDDMMYYYY(formData.get("date") as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/treatment");
  revalidatePath("/");
  return { error: null };
}
