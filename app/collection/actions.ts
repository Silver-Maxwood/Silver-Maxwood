"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { QualityStatus } from "@/types/database";

export async function addFarmer(formData: FormData) {
  const supabase = createClient();
  const { error } = await supabase.from("farmers").insert({
    reg_no: formData.get("reg_no") as string,
    name: formData.get("name") as string,
    phone: (formData.get("phone") as string) || null,
    bank_or_mobile_money: (formData.get("bank_or_mobile_money") as string) || null,
    price_per_litre: Number(formData.get("price_per_litre") || 0),
  });
  if (error) return { error: error.message };
  revalidatePath("/collection");
  return { error: null };
}

export async function logDelivery(formData: FormData) {
  const supabase = createClient();
  const qualityStatus = formData.get("quality_status") as QualityStatus;

  const { error } = await supabase.from("deliveries").insert({
    date: (formData.get("date") as string) || new Date().toISOString().slice(0, 10),
    farmer_id: formData.get("farmer_id") as string,
    quantity: Number(formData.get("quantity") || 0),
    quality_status: qualityStatus,
    price_per_litre: Number(formData.get("price_per_litre") || 0),
    deductions: Number(formData.get("deductions") || 0),
    payment_status: "PENDING",
  });

  if (error) return { error: error.message };
  revalidatePath("/collection");
  revalidatePath("/");
  return { error: null };
}
