import { createClient } from "@/lib/supabase/server";
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
  TodaySummary,
  MonthlyReportData,
  GrowthRecord,
} from "@/types/database";

const isSupabaseConfigured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getCows(): Promise<Cow[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const { data, error } = await supabase.from("cows").select("*").order("tag_number");
    if (!error && data) return data as Cow[];
  }
  return [];
}

export async function getMilkRecords(days = 14): Promise<MilkRecord[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data, error } = await supabase
      .from("milk_records")
      .select("*")
      .gte("date", since.toISOString().slice(0, 10))
      .order("date", { ascending: false });
    if (!error && data) return data as MilkRecord[];
  }
  return [];
}

export async function getFeedRecords(days = 30): Promise<FeedRecord[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data, error } = await supabase
      .from("feed_records")
      .select("*")
      .gte("date", since.toISOString().slice(0, 10))
      .order("date", { ascending: false });
    if (!error && data) return data as FeedRecord[];
  }
  return [];
}

export async function getBreedingRecords(): Promise<BreedingRecord[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("breeding_records")
      .select("*")
      .order("expected_calving_date", { ascending: true });
    if (!error && data) return data as BreedingRecord[];
  }
  return [];
}

export async function getHealthRecords(): Promise<HealthRecord[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("health_records")
      .select("*")
      .order("date", { ascending: false });
    if (!error && data) return data as HealthRecord[];
  }
  return [];
}

export async function getVaccineRecords(): Promise<any[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("vaccine_records")
      .select("*")
      .order("date", { ascending: false });
    if (!error && data) return data;
  }
  return [];
}

export async function getGrowthRecords(): Promise<GrowthRecord[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("growth_records")
      .select("*")
      .order("date", { ascending: false });
    if (!error && data) return data as GrowthRecord[];
  }
  return [];
}

export async function getExpenses(days = 30): Promise<Expense[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .gte("date", since.toISOString().slice(0, 10))
      .order("date", { ascending: false });
    if (!error && data) return data as Expense[];
  }
  return [];
}

export async function getIncomes(days = 30): Promise<Income[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data, error } = await supabase
      .from("incomes")
      .select("*")
      .gte("date", since.toISOString().slice(0, 10))
      .order("date", { ascending: false });
    if (!error && data) return data as Income[];
  }
  return [];
}

export async function getFarmers(): Promise<Farmer[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const { data, error } = await supabase.from("farmers").select("*").order("name");
    if (!error && data) return data as Farmer[];
  }
  return [];
}

export async function getDeliveries(days = 14): Promise<Delivery[]> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const since = new Date();
    since.setDate(since.getDate() - days);
    const { data, error } = await supabase
      .from("deliveries")
      .select("*")
      .gte("date", since.toISOString().slice(0, 10))
      .order("date", { ascending: false });
    if (!error && data) return data as Delivery[];
  }
  return [];
}

export async function getTodaySummary(): Promise<TodaySummary> {
  if (isSupabaseConfigured) {
    const supabase = createClient();
    const today = new Date().toISOString().slice(0, 10);
    const todayDate = new Date(today);
    const in14DaysDate = new Date(todayDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    const in14Days = in14DaysDate.toISOString().slice(0, 10);

    const [
      { data: milkData },
      { data: feedData },
      { count: milkingCount },
      { count: pregnantCount },
      { count: totalCattle },
      { count: dueCalvingCount },
      { count: activeWithdrawalCount },
    ] = await Promise.all([
      supabase.from("milk_records").select("total_litres, total_income, is_rejected").eq("date", today),
      supabase.from("feed_records").select("total_cost").eq("date", today),
      supabase.from("cows").select("*", { count: "exact", head: true }).eq("status", "MILKING"),
      supabase.from("cows").select("*", { count: "exact", head: true }).eq("status", "PREGNANT"),
      supabase.from("cows").select("*", { count: "exact", head: true }),
      supabase.from("breeding_records")
        .select("*", { count: "exact", head: true })
        .not("expected_calving_date", "is", null)
        .lte("expected_calving_date", in14Days)
        .is("actual_calving_date", null),
      supabase.from("health_records")
        .select("*", { count: "exact", head: true })
        .not("withdrawal_end_date", "is", null)
        .gte("withdrawal_end_date", today),
    ]);

    const todays_milk_litres = (milkData || [])
      .filter((m: any) => !m.is_rejected)
      .reduce((sum: number, m: any) => sum + Number(m.total_litres || 0), 0);
    
    const todays_milk_income = (milkData || [])
      .reduce((sum: number, m: any) => sum + Number(m.total_income || 0), 0);

    const todays_feed_cost = (feedData || [])
      .reduce((sum: number, f: any) => sum + Number(f.total_cost || 0), 0);

    return {
      todays_milk_litres,
      todays_milk_income,
      todays_feed_cost,
      milking_count: milkingCount || 0,
      pregnant_count: pregnantCount || 0,
      total_cattle: totalCattle || 0,
      due_calving_count: dueCalvingCount || 0,
      active_withdrawal_count: activeWithdrawalCount || 0,
    };
  }

  return {
    todays_milk_litres: 0,
    todays_milk_income: 0,
    todays_feed_cost: 0,
    milking_count: 0,
    pregnant_count: 0,
    total_cattle: 0,
    due_calving_count: 0,
    active_withdrawal_count: 0,
  };
}

export async function getMonthlyReportData(year: number, month: number): Promise<MonthlyReportData> {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const safeMonth = Math.max(1, Math.min(12, month));
  const monthLabel = `${monthNames[safeMonth - 1]} ${year}`;
  const padMonth = String(safeMonth).padStart(2, "0");
  const startDate = `${year}-${padMonth}-01`;
  const lastDayNum = new Date(year, safeMonth, 0).getDate();
  const endDate = `${year}-${padMonth}-${String(lastDayNum).padStart(2, "0")}`;

  let cows: Cow[] = [];
  let milkRecords: MilkRecord[] = [];
  let feedRecords: FeedRecord[] = [];
  let expenses: Expense[] = [];
  let incomes: Income[] = [];
  let breedingRecords: BreedingRecord[] = [];
  let healthRecords: HealthRecord[] = [];
  let deliveries: Delivery[] = [];
  let farmers: Farmer[] = [];

  if (isSupabaseConfigured) {
    const supabase = createClient();
    const [
      cowsRes,
      milkRes,
      feedRes,
      expRes,
      incRes,
      breedingRes,
      healthRes,
      delivRes,
      farmersRes,
    ] = await Promise.all([
      supabase.from("cows").select("*").order("tag_number"),
      supabase.from("milk_records").select("*").gte("date", startDate).lte("date", endDate).order("date", { ascending: true }),
      supabase.from("feed_records").select("*").gte("date", startDate).lte("date", endDate).order("date", { ascending: true }),
      supabase.from("expenses").select("*").gte("date", startDate).lte("date", endDate).order("date", { ascending: true }),
      supabase.from("incomes").select("*").gte("date", startDate).lte("date", endDate).order("date", { ascending: true }),
      supabase.from("breeding_records").select("*").order("expected_calving_date", { ascending: true }),
      supabase.from("health_records").select("*").gte("date", startDate).lte("date", endDate).order("date", { ascending: true }),
      supabase.from("deliveries").select("*").gte("date", startDate).lte("date", endDate).order("date", { ascending: true }),
      supabase.from("farmers").select("*").order("name"),
    ]);

    if (!cowsRes.error && cowsRes.data) cows = cowsRes.data as Cow[];
    if (!milkRes.error && milkRes.data) milkRecords = milkRes.data as MilkRecord[];
    if (!feedRes.error && feedRes.data) feedRecords = feedRes.data as FeedRecord[];
    if (!expRes.error && expRes.data) expenses = expRes.data as Expense[];
    if (!incRes.error && incRes.data) incomes = incRes.data as Income[];
    if (!breedingRes.error && breedingRes.data) breedingRecords = breedingRes.data as BreedingRecord[];
    if (!healthRes.error && healthRes.data) healthRecords = healthRes.data as HealthRecord[];
    if (!delivRes.error && delivRes.data) deliveries = delivRes.data as Delivery[];
    if (!farmersRes.error && farmersRes.data) farmers = farmersRes.data as Farmer[];
  }

  // Filter breeding records active/occurring in this month
  const monthBreeding = breedingRecords.filter((b) => {
    const aiInMonth = b.ai_date && b.ai_date >= startDate && b.ai_date <= endDate;
    const calvingInMonth = b.actual_calving_date && b.actual_calving_date >= startDate && b.actual_calving_date <= endDate;
    const heatInMonth = b.heat_date && b.heat_date >= startDate && b.heat_date <= endDate;
    return Boolean(aiInMonth || calvingInMonth || heatInMonth);
  });

  const totalMilkLitres = milkRecords.reduce((sum, r) => sum + Number(r.total_litres || 0), 0);
  const acceptedMilkLitres = milkRecords.filter((r) => !r.is_rejected).reduce((sum, r) => sum + Number(r.total_litres || 0), 0);
  const rejectedMilkLitres = milkRecords.filter((r) => r.is_rejected).reduce((sum, r) => sum + Number(r.total_litres || 0), 0);
  const morningMilkLitres = milkRecords.reduce((sum, r) => sum + Number(r.morning_litres || 0), 0);
  const eveningMilkLitres = milkRecords.reduce((sum, r) => sum + Number(r.evening_litres || 0), 0);
  const milkIncome = milkRecords.reduce((sum, r) => sum + Number(r.total_income || 0), 0);
  const otherIncome = incomes.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const totalIncome = milkIncome + otherIncome;

  const feedCost = feedRecords.reduce((sum, r) => sum + Number(r.total_cost || 0), 0);
  const otherExpenses = expenses.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  const totalExpenses = feedCost + otherExpenses;
  const netProfit = totalIncome - totalExpenses;

  const avgLitresPerDay = lastDayNum > 0 ? Math.round((acceptedMilkLitres / lastDayNum) * 10) / 10 : 0;
  const uniqueMilkedCows = new Set(milkRecords.map((m) => m.cow_id)).size;
  const activeMilkingCows = uniqueMilkedCows || cows.filter((c) => c.status === "MILKING").length;
  const avgLitresPerCowDay = (activeMilkingCows > 0 && lastDayNum > 0)
    ? Math.round((acceptedMilkLitres / (activeMilkingCows * lastDayNum)) * 10) / 10
    : 0;
  const feedCostPerLitre = acceptedMilkLitres > 0
    ? Math.round((feedCost / acceptedMilkLitres) * 100) / 100
    : 0;
  const avgMilkPricePerLitre = acceptedMilkLitres > 0
    ? Math.round((milkIncome / acceptedMilkLitres) * 100) / 100
    : 0;

  const calvingsCount = breedingRecords.filter((b) => b.actual_calving_date && b.actual_calving_date >= startDate && b.actual_calving_date <= endDate).length;
  const aiServicesCount = breedingRecords.filter((b) => b.ai_date && b.ai_date >= startDate && b.ai_date <= endDate).length;
  const treatmentsCount = healthRecords.length;

  const acceptedDeliveries = deliveries.filter((d) => d.quality_status === "ACCEPTED");
  const collectionLitres = acceptedDeliveries.reduce((sum, d) => sum + Number(d.quantity || 0), 0);
  const collectionPayout = deliveries.reduce((sum, d) => sum + Number(d.net_payable || 0), 0);

  // Top producing cows
  const cowMap = new Map(cows.map((c) => [c.id, c]));
  const cowStats = new Map<string, { totalLitres: number; days: Set<string> }>();
  for (const m of milkRecords) {
    if (m.is_rejected) continue;
    const current = cowStats.get(m.cow_id) || { totalLitres: 0, days: new Set<string>() };
    current.totalLitres += Number(m.total_litres || 0);
    current.days.add(m.date);
    cowStats.set(m.cow_id, current);
  }

  const topCows = Array.from(cowStats.entries())
    .map(([cowId, stats]) => {
      const cow = cowMap.get(cowId);
      const daysCount = stats.days.size;
      return {
        cowId,
        tagNumber: cow?.tag_number || "Unknown",
        name: cow?.name || null,
        breed: cow?.breed || null,
        totalLitres: Math.round(stats.totalLitres * 10) / 10,
        daysMilked: daysCount,
        avgDaily: daysCount > 0 ? Math.round((stats.totalLitres / daysCount) * 10) / 10 : 0,
      };
    })
    .sort((a, b) => b.totalLitres - a.totalLitres);

  // Daily production
  const dailyMap = new Map<string, { accepted: number; rejected: number; total: number; income: number }>();
  for (let d = 1; d <= lastDayNum; d++) {
    const dateStr = `${year}-${padMonth}-${String(d).padStart(2, "0")}`;
    dailyMap.set(dateStr, { accepted: 0, rejected: 0, total: 0, income: 0 });
  }
  for (const m of milkRecords) {
    const entry = dailyMap.get(m.date) || { accepted: 0, rejected: 0, total: 0, income: 0 };
    const litres = Number(m.total_litres || 0);
    entry.total += litres;
    if (m.is_rejected) {
      entry.rejected += litres;
    } else {
      entry.accepted += litres;
      entry.income += Number(m.total_income || 0);
    }
    dailyMap.set(m.date, entry);
  }

  const dailyProduction = Array.from(dailyMap.entries())
    .map(([date, data]) => ({
      date,
      acceptedLitres: Math.round(data.accepted * 10) / 10,
      rejectedLitres: Math.round(data.rejected * 10) / 10,
      totalLitres: Math.round(data.total * 10) / 10,
      income: Math.round(data.income),
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Category breakdown for expenses
  const expenseCatMap = new Map<string, number>();
  for (const e of expenses) {
    expenseCatMap.set(e.category, (expenseCatMap.get(e.category) || 0) + Number(e.amount || 0));
  }
  const expenseByCategory = Array.from(expenseCatMap.entries())
    .map(([category, amount]) => ({ category: category.replace(/_/g, " "), amount: Math.round(amount) }))
    .sort((a, b) => b.amount - a.amount);

  // Category breakdown for incomes
  const incomeCatMap = new Map<string, number>();
  if (milkIncome > 0) incomeCatMap.set("MILK", milkIncome);
  for (const i of incomes) {
    incomeCatMap.set(i.category, (incomeCatMap.get(i.category) || 0) + Number(i.amount || 0));
  }
  const incomeByCategory = Array.from(incomeCatMap.entries())
    .map(([category, amount]) => ({ category: category.replace(/_/g, " "), amount: Math.round(amount) }))
    .sort((a, b) => b.amount - a.amount);

  // Feed by type breakdown
  const feedTypeMap = new Map<string, { amount: number; quantity: number; unit: string }>();
  for (const f of feedRecords) {
    const cur = feedTypeMap.get(f.feed_type) || { amount: 0, quantity: 0, unit: f.unit || "kg" };
    cur.amount += Number(f.total_cost || 0);
    cur.quantity += Number(f.quantity || 0);
    feedTypeMap.set(f.feed_type, cur);
  }
  const feedByType = Array.from(feedTypeMap.entries())
    .map(([feedType, val]) => ({
      feedType: feedType.replace(/_/g, " "),
      amount: Math.round(val.amount),
      quantity: Math.round(val.quantity * 10) / 10,
      unit: val.unit,
    }))
    .sort((a, b) => b.amount - a.amount);

  return {
    year,
    month: safeMonth,
    monthLabel,
    startDate,
    endDate,
    daysInMonth: lastDayNum,
    totals: {
      totalMilkLitres: Math.round(totalMilkLitres * 10) / 10,
      acceptedMilkLitres: Math.round(acceptedMilkLitres * 10) / 10,
      rejectedMilkLitres: Math.round(rejectedMilkLitres * 10) / 10,
      morningMilkLitres: Math.round(morningMilkLitres * 10) / 10,
      eveningMilkLitres: Math.round(eveningMilkLitres * 10) / 10,
      milkIncome: Math.round(milkIncome),
      otherIncome: Math.round(otherIncome),
      totalIncome: Math.round(totalIncome),
      feedCost: Math.round(feedCost),
      otherExpenses: Math.round(otherExpenses),
      totalExpenses: Math.round(totalExpenses),
      netProfit: Math.round(netProfit),
      avgLitresPerDay,
      activeMilkingCows,
      avgLitresPerCowDay,
      feedCostPerLitre,
      avgMilkPricePerLitre,
      calvingsCount,
      aiServicesCount,
      treatmentsCount,
      collectionLitres: Math.round(collectionLitres * 10) / 10,
      collectionPayout: Math.round(collectionPayout),
    },
    topCows,
    dailyProduction,
    expenseByCategory,
    incomeByCategory,
    feedByType,
    recentBreeding: monthBreeding,
    recentHealth: healthRecords,
    recentDeliveries: deliveries,
    cows,
    farmers,
  };
}

export { isSupabaseConfigured };
