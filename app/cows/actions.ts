"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { CowSex, CowStatus } from "@/types/database";

export async function addCow(formData: FormData) {
  const supabase = createClient();

  const purchasePrice = formData.get("purchase_price") as string;

  const { error } = await supabase.from("cows").insert({
    tag_number: formData.get("tag_number") as string,
    name: (formData.get("name") as string) || null,
    breed: (formData.get("breed") as string) || null,
    sex: (formData.get("sex") as CowSex) || "FEMALE",
    dob: (formData.get("dob") as string) || null,
    source: (formData.get("source") as string) || null,
    status: (formData.get("status") as CowStatus) || "MILKING",
    purchase_price: purchasePrice ? Number(purchasePrice) : null,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/cows");
  revalidatePath("/");
  return { error: null };
}

export async function updateCowStatus(cowId: string, status: CowStatus) {
  const supabase = createClient();
  const { error } = await supabase.from("cows").update({ status }).eq("id", cowId);
  if (error) return { error: error.message };
  revalidatePath("/cows");
  revalidatePath("/");
  return { error: null };
}
