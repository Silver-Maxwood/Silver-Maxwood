"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function logFeedSale(formData: FormData) {
  const supabase = createClient();

  const { error } = await supabase.from("feed_sales").insert({
    date: (formData.get("date") as string) || new Date().toISOString().slice(0, 10),
    buyer_name: formData.get("buyer_name") as string,
    phone_number: (formData.get("phone_number") as string) || null,
    national_id: (formData.get("national_id") as string) || null,
    quantity_kg: Number(formData.get("quantity_kg") || 0),
    price_per_kg: Number(formData.get("price_per_kg") || 0),
    payment_status: "PENDING",
  });

  if (error) return { error: error.message };
  revalidatePath("/feed");
  return { error: null };
}

export async function markFeedSalePaid(saleId: string) {
  const supabase = createClient();
  
  const { data: sale, error: fetchError } = await supabase
    .from("feed_sales")
    .select("*")
    .eq("id", saleId)
    .single();
    
  if (fetchError || !sale) return { error: fetchError?.message || "Sale not found" };
  if (sale.payment_status === "PAID") return { error: "Already paid" };

  const { error: updateError } = await supabase
    .from("feed_sales")
    .update({ payment_status: "PAID" })
    .eq("id", saleId);
    
  if (updateError) return { error: updateError.message };
  
  const { error: incomeError } = await supabase.from("incomes").insert({
    date: new Date().toISOString().slice(0, 10),
    category: "OTHER", // Or a new FEED_SALE category
    amount: Number(sale.total_amount),
    description: `Feed sale to ${sale.buyer_name} (${sale.quantity_kg}kg)`,
  });
  
  if (incomeError) return { error: incomeError.message };

  revalidatePath("/feed");
  revalidatePath("/finance");
  revalidatePath("/reports");
  revalidatePath("/");
  return { error: null };
}
