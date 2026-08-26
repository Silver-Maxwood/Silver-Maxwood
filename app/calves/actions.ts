"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addCalf(formData: FormData) {
  const supabase = createClient();

  function parseDDMMYYYY(dateStr: string | null): string | null {
    if (!dateStr) return null;
    const parts = dateStr.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return dateStr;
  }

  const { error } = await supabase.from("cows").insert({
    tag_number: formData.get("tag_number") as string,
    name: (formData.get("name") as string) || null,
    dob: parseDDMMYYYY(formData.get("dob") as string) || null,
    sex: formData.get("sex") as string,
    dam_id: (formData.get("dam_id") as string) || null,
    source: (formData.get("sire_text") as string) ? `Sire: ${formData.get("sire_text")}` : null, // Storing sire text in source or a new field, but let's use source for now as sire_text is not a UUID
    breed: (formData.get("breed") as string) || null,
    mode_of_conception: (formData.get("mode_of_conception") as string) || null,
    status: 'CALF',
  });

  if (error) {
    if (error.code === '23505') {
      return { error: "A cow or calf with this tag number already exists." };
    }
    return { error: error.message };
  }

  revalidatePath("/calves");
  revalidatePath("/cows");
  return { error: null };
}
