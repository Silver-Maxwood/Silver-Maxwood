/**
 * Clears all data from the Supabase database for Silver Maxwood Dairies.
 * Requires SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) in .env.local.
 *
 * Usage: npm run clear-data
 */
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function main() {
  console.log("Clearing all data from Silver Maxwood Dairies database...");

  const tables = [
    "deliveries",
    "milk_quality_records",
    "farmers",
    "health_records",
    "breeding_records",
    "feed_records",
    "milk_records",
    "expenses",
    "incomes",
    "cows",
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (error) {
      console.warn(`Warning deleting from ${table}:`, error.message);
    } else {
      console.log(`Cleared ${table}`);
    }
  }

  console.log("Done! All records have been cleared.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
