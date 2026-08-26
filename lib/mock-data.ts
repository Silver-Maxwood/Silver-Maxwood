import type {
  Cow,
  MilkRecord,
  FeedRecord,
  BreedingRecord,
  HealthRecord,
  Expense,
  Income,
  Farmer,
  Delivery,
  FeedType,
  ExpenseCategory,
} from "@/types/database";

// ----------------------------------------------------------------------------
// Deterministic-ish mock data for Silver Maxwood Dairies. Used by
// `npm run seed` (writes to Supabase) and by the dashboard as a graceful
// fallback so the UI has something to show before you've connected data.
// ----------------------------------------------------------------------------

const BREEDS = ["Friesian", "Ayrshire", "Guernsey", "Jersey", "Sahiwal Cross"];
const COW_NAMES = [
  "Malaika", "Zawadi", "Furaha", "Amani", "Nia", "Bahati", "Neema", "Baraka",
  "Queen", "Duchess", "Maple", "Willow", "Rosa", "Daisy", "Hazel",
];

function rand(min: number, max: number) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function isoDaysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}
function isoDaysFromNow(days: number) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function generateMockCows(count = 24): Cow[] {
  const statuses: Cow["status"][] = ["MILKING", "MILKING", "MILKING", "DRY", "PREGNANT", "CALF", "SICK"];
  return Array.from({ length: count }).map((_, i) => ({
    id: `mock-cow-${i + 1}`,
    tag_number: `SMD-${String(100 + i)}`,
    name: pick(COW_NAMES),
    breed: pick(BREEDS),
    sex: "FEMALE",
    dob: isoDaysAgo(365 * (2 + Math.floor(Math.random() * 5))),
    source: Math.random() > 0.7 ? "Purchased" : "Born on farm",
    dam_id: null,
    sire_id: null,
    lactation_no: Math.floor(Math.random() * 5) + 1,
    pregnancy_status: null,
    mode_of_conception: null,
    status: pick(statuses),
    purchase_price: Math.random() > 0.7 ? rand(45000, 120000) : null,
    photo_url: null,
    created_at: isoDaysAgo(400),
    updated_at: isoDaysAgo(1),
  }));
}

export function generateMockMilkRecords(cows: Cow[], days = 7): MilkRecord[] {
  const records: MilkRecord[] = [];
  const milkingCows = cows.filter((c) => c.status === "MILKING");
  for (let d = 0; d < days; d++) {
    const date = isoDaysAgo(d);
    for (const cow of milkingCows) {
      const morning = rand(6, 16);
      const evening = rand(5, 14);
      const rejected = Math.random() < 0.04;
      records.push({
        id: `mock-milk-${cow.id}-${d}`,
        date,
        cow_id: cow.id,
        morning_litres: morning,
        evening_litres: evening,
        total_litres: Math.round((morning + evening) * 100) / 100,
        is_rejected: rejected,
        rejection_reason: rejected ? pick(["Antibiotic residue", "High SCC", "Adulteration suspected"]) : null,
        buyer: pick(["Brookside", "New KCC", "Local Cooperative", "Direct Retail"]),
        price_per_litre: 52,
        total_income: rejected ? 0 : Math.round((morning + evening) * 52 * 100) / 100,
        created_at: `${date}T06:00:00Z`,
      });
    }
  }
  return records;
}

export function generateMockFeedRecords(days = 7): FeedRecord[] {
  const types: FeedType[] = ["DAIRY_MEAL", "SILAGE", "NAPIER", "HAY", "SUPPLEMENTS", "SALT", "DCP"];
  const costs: Record<FeedType, number> = {
    DAIRY_MEAL: 55, SILAGE: 8, NAPIER: 4, HAY: 18, SUPPLEMENTS: 120, SALT: 45, DCP: 90, OTHER: 20,
  };
  const records: FeedRecord[] = [];
  for (let d = 0; d < days; d++) {
    const date = isoDaysAgo(d);
    for (const type of types) {
      const qty = rand(20, 220);
      records.push({
        id: `mock-feed-${type}-${d}`,
        date,
        feed_type: type,
        quantity: qty,
        unit: "kg",
        cost_per_kg: costs[type],
        total_cost: Math.round(qty * costs[type] * 100) / 100,
        fed_to: "Milking Herd",
        created_at: `${date}T05:30:00Z`,
      });
    }
  }
  return records;
}

export function generateMockBreedingRecords(cows: Cow[]): BreedingRecord[] {
  return cows
    .filter((c) => c.status === "PREGNANT" || Math.random() > 0.6)
    .slice(0, 10)
    .map((cow, i) => {
      const aiDate = isoDaysAgo(rand(30, 200));
      const expected = isoDaysFromNow(rand(-10, 60));
      return {
        id: `mock-breeding-${i}`,
        cow_id: cow.id,
        heat_date: isoDaysAgo(rand(200, 220)),
        heat_symptoms: "Standing heat, mucus discharge",
        ai_date: aiDate,
        semen_used: "Friesian Sexed Semen #4471",
        technician: "Dr. Otieno",
        pd_date: isoDaysAgo(rand(60, 120)),
        pd_result: pick(["POSITIVE", "PENDING", "NEGATIVE"]),
        expected_calving_date: expected,
        actual_calving_date: null,
        services_count: Math.floor(Math.random() * 2) + 1,
        calf_id: null,
        created_at: aiDate,
      };
    });
}

export function generateMockHealthRecords(cows: Cow[]): HealthRecord[] {
  return cows
    .filter((c) => c.status === "SICK" || Math.random() > 0.85)
    .slice(0, 8)
    .map((cow, i) => {
      const date = isoDaysAgo(rand(0, 10));
      const withdrawalDays = pick([0, 0, 3, 5, 7]);
      return {
        id: `mock-health-${i}`,
        cow_id: cow.id,
        condition: pick(["Mastitis", "Foot rot", "Bloat", "Retained placenta", "Routine deworming"]),
        symptoms: "Reduced appetite, mild fever",
        diagnosis: "Bacterial infection",
        treatment: "Antibiotic course + anti-inflammatory",
        medicine: "Penstrep",
        dosage: "20ml IM for 3 days",
        date,
        vet: "Dr. Otieno",
        withdrawal_days: withdrawalDays,
        withdrawal_end_date: withdrawalDays > 0 ? isoDaysFromNow(withdrawalDays - rand(0, 2)) : null,
        recovery_date: null,
        cmt_result: pick(["Negative", "Trace", "+1"]),
        created_at: date,
      };
    });
}

export function generateMockExpenses(days = 30): Expense[] {
  const categories: ExpenseCategory[] = ["FEED", "VET", "LABOUR", "UTILITIES", "FUEL", "REPAIRS", "EQUIPMENT"];
  return Array.from({ length: days }).flatMap((_, d) =>
    categories
      .filter(() => Math.random() > 0.5)
      .map((cat, i) => ({
        id: `mock-expense-${d}-${i}`,
        date: isoDaysAgo(d),
        category: cat,
        amount: rand(500, 15000),
        description: `${cat.charAt(0)}${cat.slice(1).toLowerCase()} expense`,
        created_at: isoDaysAgo(d),
      }))
  );
}

export function generateMockIncomes(days = 30): Income[] {
  return Array.from({ length: days }).map((_, d) => ({
    id: `mock-income-${d}`,
    date: isoDaysAgo(d),
    category: "MILK",
    amount: rand(15000, 45000),
    description: "Daily milk sales",
    created_at: isoDaysAgo(d),
  }));
}

export function generateMockFarmers(count = 12): Farmer[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: `mock-farmer-${i + 1}`,
    reg_no: `FRM-${String(200 + i)}`,
    name: pick(["John Kamau", "Grace Wanjiru", "Peter Mwangi", "Alice Achieng", "Samuel Kiplagat", "Mary Njeri"]),
    phone: `07${Math.floor(10000000 + Math.random() * 89999999)}`,
    bank_or_mobile_money: pick(["M-Pesa", "Equity Bank", "KCB", "Co-op Bank"]),
    price_per_litre: 48,
    created_at: isoDaysAgo(200),
  }));
}

export function generateMockDeliveries(farmers: Farmer[], days = 7): Delivery[] {
  const records: Delivery[] = [];
  for (let d = 0; d < days; d++) {
    const date = isoDaysAgo(d);
    for (const farmer of farmers) {
      const qty = rand(5, 40);
      const rejected = Math.random() < 0.06;
      const deductions = Math.random() > 0.6 ? rand(0, 50) : 0;
      records.push({
        id: `mock-delivery-${farmer.id}-${d}`,
        date,
        farmer_id: farmer.id,
        quantity: qty,
        quality_status: rejected ? "REJECTED" : "ACCEPTED",
        price_per_litre: farmer.price_per_litre,
        deductions,
        net_payable: rejected ? 0 : Math.round((qty * farmer.price_per_litre - deductions) * 100) / 100,
        payment_status: pick(["PENDING", "PAID"]),
        created_at: `${date}T07:00:00Z`,
      });
    }
  }
  return records;
}
