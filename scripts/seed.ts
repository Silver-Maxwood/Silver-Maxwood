/**
 * Seeds a Supabase project with realistic mock data for Silver Maxwood
 * Dairies. Requires SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) in .env.local.
 *
 * Usage: npm run seed
 */
import { createClient } from "@supabase/supabase-js";
import "dotenv/config";
import {
  generateMockCows,
  generateMockMilkRecords,
  generateMockFeedRecords,
  generateMockBreedingRecords,
  generateMockHealthRecords,
  generateMockExpenses,
  generateMockIncomes,
  generateMockFarmers,
  generateMockDeliveries,
} from "../lib/mock-data";

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
  console.log("Seeding Silver Maxwood Dairies data...");

  const cows = generateMockCows(24).map(({ id, ...rest }) => rest); // let DB assign UUIDs
  const { data: insertedCows, error: cowErr } = await supabase
    .from("cows")
    .insert(cows)
    .select();
  if (cowErr) throw cowErr;
  console.log(`Inserted ${insertedCows.length} cows`);

  const milk = generateMockMilkRecords(insertedCows as any, 14).map(({ id, total_litres, total_income, cow_id, ...rest }) => {
    const realCow = insertedCows[Math.floor(Math.random() * insertedCows.length)];
    return { ...rest, cow_id: realCow.id };
  });
  const { error: milkErr } = await supabase.from("milk_records").insert(milk);
  if (milkErr) throw milkErr;
  console.log(`Inserted ${milk.length} milk records`);

  const feed = generateMockFeedRecords(30).map(({ id, total_cost, ...rest }) => rest);
  const { error: feedErr } = await supabase.from("feed_records").insert(feed);
  if (feedErr) throw feedErr;
  console.log(`Inserted ${feed.length} feed records`);

  const breeding = generateMockBreedingRecords(insertedCows as any).map(({ id, calf_id, ...rest }) => {
    const realCow = insertedCows[Math.floor(Math.random() * insertedCows.length)];
    return { ...rest, cow_id: realCow.id, calf_id: null };
  });
  const { error: breedingErr } = await supabase.from("breeding_records").insert(breeding);
  if (breedingErr) throw breedingErr;
  console.log(`Inserted ${breeding.length} breeding records`);

  const health = generateMockHealthRecords(insertedCows as any).map(({ id, ...rest }) => {
    const realCow = insertedCows[Math.floor(Math.random() * insertedCows.length)];
    return { ...rest, cow_id: realCow.id };
  });
  const { error: healthErr } = await supabase.from("health_records").insert(health);
  if (healthErr) throw healthErr;
  console.log(`Inserted ${health.length} health records`);

  const expenses = generateMockExpenses(30).map(({ id, ...rest }) => rest);
  const { error: expErr } = await supabase.from("expenses").insert(expenses);
  if (expErr) throw expErr;
  console.log(`Inserted ${expenses.length} expenses`);

  const incomes = generateMockIncomes(30).map(({ id, ...rest }) => rest);
  const { error: incErr } = await supabase.from("incomes").insert(incomes);
  if (incErr) throw incErr;
  console.log(`Inserted ${incomes.length} incomes`);

  const farmers = generateMockFarmers(12).map(({ id, ...rest }) => rest);
  const { data: insertedFarmers, error: farmerErr } = await supabase
    .from("farmers")
    .insert(farmers)
    .select();
  if (farmerErr) throw farmerErr;
  console.log(`Inserted ${insertedFarmers.length} farmers`);

  const deliveries = generateMockDeliveries(insertedFarmers as any, 14).map(
    ({ id, net_payable, farmer_id, ...rest }) => {
      const realFarmer = insertedFarmers[Math.floor(Math.random() * insertedFarmers.length)];
      return { ...rest, farmer_id: realFarmer.id };
    }
  );
  const { error: delErr } = await supabase.from("deliveries").insert(deliveries);
  if (delErr) throw delErr;
  console.log(`Inserted ${deliveries.length} deliveries`);

  console.log("Done. Your Silver Maxwood Dairies dashboard now has data.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
