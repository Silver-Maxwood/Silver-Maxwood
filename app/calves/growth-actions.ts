"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addGrowthRecord(formData: FormData) {
  const supabase = createClient();
  const cowId = formData.get("cow_id") as string;
  const date = (formData.get("date") as string) || new Date().toISOString().slice(0, 10);
  const weight = formData.get("weight") ? Number(formData.get("weight")) : null;
  const height = formData.get("height") ? Number(formData.get("height")) : null;

  if (!weight && !height) {
    return { error: "Please provide either weight or height." };
  }

  const { error } = await supabase.from("growth_records").insert({
    cow_id: cowId,
    date,
    weight,
    height,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/calves");
  revalidatePath("/cows");
  return { error: null };
}
