"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logVaccine(formData: FormData) {
  const supabase = createClient();

  const { error } = await supabase.from("vaccine_records").insert({
    cow_id: formData.get("cow_id") as string,
    disease: formData.get("disease") as string,
    vaccine_type: (formData.get("vaccine_type") as string) || null,
    dosage: (formData.get("dosage") as string) || null,
    vet_name: (formData.get("vet_name") as string) || null,
    vet_contact: (formData.get("vet_contact") as string) || null,
    date: (formData.get("date") as string) || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/treatment");
  revalidatePath("/");
  return { error: null };
}
