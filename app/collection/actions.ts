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
    national_id: (formData.get("national_id") as string) || null,
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
    time: (formData.get("time") as string) || new Date().toISOString().slice(11, 16),
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

export async function markDeliveryPaid(deliveryId: string) {
  const supabase = createClient();
  
  // Get delivery details
  const { data: delivery, error: fetchError } = await supabase
    .from("deliveries")
    .select("*, farmers(name)")
    .eq("id", deliveryId)
    .single();
    
  if (fetchError || !delivery) return { error: fetchError?.message || "Delivery not found" };
  if (delivery.payment_status === "PAID") return { error: "Already paid" };

  // Mark as paid
  const { error: updateError } = await supabase
    .from("deliveries")
    .update({ payment_status: "PAID" })
    .eq("id", deliveryId);
    
  if (updateError) return { error: updateError.message };
  
  // Add to expenses
  const { error: expenseError } = await supabase.from("expenses").insert({
    date: new Date().toISOString().slice(0, 10),
    category: "OTHER",
    amount: Number(delivery.net_payable),
    description: `Payout to ${delivery.farmers?.name || "Farmer"} for milk delivery on ${delivery.date}`,
  });
  
  if (expenseError) return { error: expenseError.message };

  revalidatePath("/collection");
  revalidatePath("/finance");
  revalidatePath("/reports");
  revalidatePath("/");
  return { error: null };
}
