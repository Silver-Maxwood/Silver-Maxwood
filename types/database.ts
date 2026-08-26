// Hand-written types mirroring supabase/schema.sql.
// If you prefer generated types, run:
//   npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/supabase-generated.ts
// and swap these out.

export type CowStatus = "MILKING" | "DRY" | "PREGNANT" | "CALF" | "SICK" | "SOLD" | "DEAD";
export type CowSex = "FEMALE" | "MALE";
export type FeedType = "DAIRY_MEAL" | "SILAGE" | "NAPIER" | "HAY" | "SUPPLEMENTS" | "SALT" | "DCP" | "OTHER";
export type ExpenseCategory = "FEED" | "VET" | "LABOUR" | "UTILITIES" | "FUEL" | "REPAIRS" | "EQUIPMENT" | "LOAN" | "OTHER";
export type IncomeCategory = "MILK" | "CALF_SALE" | "COW_SALE" | "MANURE" | "BREEDING" | "OTHER";
export type PdResult = "PENDING" | "POSITIVE" | "NEGATIVE";
export type PassFail = "PASS" | "FAIL";
export type QualityStatus = "ACCEPTED" | "REJECTED";
export type PaymentStatus = "PENDING" | "PAID";

export type FarmProfile = {
  id: string;
  name: string;
  owner: string | null;
  location: string | null;
  contact: string | null;
  acres: number | null;
  reg_details: string | null;
  employees_count: number | null;
  created_at: string;
};

export type Cow = {
  id: string;
  tag_number: string;
  name: string | null;
  breed: string | null;
  sex: CowSex;
  dob: string | null;
  source: string | null;
  dam_id: string | null;
  sire_id: string | null;
  lactation_no: number | null;
  pregnancy_status: string | null;
  mode_of_conception: string | null;
  status: CowStatus;
  purchase_price: number | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
};

export type MilkRecord = {
  id: string;
  date: string;
  cow_id: string;
  morning_litres: number;
  evening_litres: number;
  total_litres: number; // generated
  is_rejected: boolean;
  rejection_reason: string | null;
  buyer: string | null;
  price_per_litre: number;
  total_income: number; // generated
  created_at: string;
};

export type FeedRecord = {
  id: string;
  date: string;
  feed_type: FeedType;
  quantity: number;
  unit: string;
  cost_per_kg: number;
  total_cost: number; // generated
  fed_to: string | null;
  created_at: string;
};

export type BreedingRecord = {
  id: string;
  cow_id: string;
  heat_date: string | null;
  heat_symptoms: string | null;
  ai_date: string | null;
  semen_used: string | null;
  technician: string | null;
  pd_date: string | null;
  pd_result: PdResult | null;
  expected_calving_date: string | null;
  actual_calving_date: string | null;
  services_count: number | null;
  calf_id: string | null;
  created_at: string;
};

export type HealthRecord = {
  id: string;
  cow_id: string;
  condition: string;
  symptoms: string | null;
  diagnosis: string | null;
  treatment: string | null;
  medicine: string | null;
  dosage: string | null;
  date: string;
  vet: string | null;
  withdrawal_days: number | null;
  withdrawal_end_date: string | null;
  recovery_date: string | null;
  cmt_result: string | null;
  created_at: string;
};

export type MilkQualityRecord = {
  id: string;
  date: string;
  cow_id: string | null;
  farmer_id: string | null;
  fat: number | null;
  protein: number | null;
  snf: number | null;
  density: number | null;
  freezing_point: number | null;
  ph: number | null;
  tta: number | null;
  resazurin: string | null;
  aflatoxin: number | null;
  antibiotic_residue: boolean;
  scc: number | null;
  alcohol_test: PassFail | null;
  clot_on_boiling: PassFail | null;
  temp: number | null;
  status: QualityStatus;
  created_at: string;
};

export type Expense = {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  description: string | null;
  created_at: string;
};

export type Income = {
  id: string;
  date: string;
  category: IncomeCategory;
  amount: number;
  description: string | null;
  created_at: string;
};

export type Farmer = {
  id: string;
  reg_no: string;
  name: string;
  phone: string | null;
  bank_or_mobile_money: string | null;
  price_per_litre: number;
  created_at: string;
};

export type Delivery = {
  id: string;
  date: string;
  farmer_id: string;
  quantity: number;
  quality_status: QualityStatus;
  price_per_litre: number;
  deductions: number;
  net_payable: number; // generated
  payment_status: PaymentStatus;
  created_at: string;
};

export type TodaySummary = {
  todays_milk_litres: number;
  todays_milk_income: number;
  todays_feed_cost: number;
  milking_count: number;
  pregnant_count: number;
  total_cattle: number;
  due_calving_count: number;
  active_withdrawal_count: number;
};

export interface MonthlyReportData {
  year: number;
  month: number;
  monthLabel: string;
  startDate: string;
  endDate: string;
  daysInMonth: number;
  totals: {
    totalMilkLitres: number;
    acceptedMilkLitres: number;
    rejectedMilkLitres: number;
    morningMilkLitres: number;
    eveningMilkLitres: number;
    milkIncome: number;
    otherIncome: number;
    totalIncome: number;
    feedCost: number;
    otherExpenses: number;
    totalExpenses: number;
    netProfit: number;
    avgLitresPerDay: number;
    activeMilkingCows: number;
    avgLitresPerCowDay: number;
    feedCostPerLitre: number;
    avgMilkPricePerLitre: number;
    calvingsCount: number;
    aiServicesCount: number;
    treatmentsCount: number;
    collectionLitres: number;
    collectionPayout: number;
  };
  topCows: Array<{
    cowId: string;
    tagNumber: string;
    name: string | null;
    breed: string | null;
    totalLitres: number;
    daysMilked: number;
    avgDaily: number;
  }>;
  dailyProduction: Array<{
    date: string;
    acceptedLitres: number;
    rejectedLitres: number;
    totalLitres: number;
    income: number;
  }>;
  expenseByCategory: Array<{ category: string; amount: number }>;
  incomeByCategory: Array<{ category: string; amount: number }>;
  feedByType: Array<{ feedType: string; amount: number; quantity: number; unit: string }>;
  recentBreeding: BreedingRecord[];
  recentHealth: HealthRecord[];
  recentDeliveries: Delivery[];
  cows: Cow[];
  farmers: Farmer[];
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      farm_profiles: {
        Row: FarmProfile;
        Insert: Partial<FarmProfile>;
        Update: Partial<FarmProfile>;
        Relationships: [];
      };
      cows: {
        Row: Cow;
        Insert: Partial<Cow>;
        Update: Partial<Cow>;
        Relationships: [
          {
            foreignKeyName: "cows_dam_id_fkey";
            columns: ["dam_id"];
            isOneToOne: false;
            referencedRelation: "cows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cows_sire_id_fkey";
            columns: ["sire_id"];
            isOneToOne: false;
            referencedRelation: "cows";
            referencedColumns: ["id"];
          }
        ];
      };
      milk_records: {
        Row: MilkRecord;
        Insert: Partial<MilkRecord>;
        Update: Partial<MilkRecord>;
        Relationships: [
          {
            foreignKeyName: "milk_records_cow_id_fkey";
            columns: ["cow_id"];
            isOneToOne: false;
            referencedRelation: "cows";
            referencedColumns: ["id"];
          }
        ];
      };
      feed_records: {
        Row: FeedRecord;
        Insert: Partial<FeedRecord>;
        Update: Partial<FeedRecord>;
        Relationships: [];
      };
      breeding_records: {
        Row: BreedingRecord;
        Insert: Partial<BreedingRecord>;
        Update: Partial<BreedingRecord>;
        Relationships: [
          {
            foreignKeyName: "breeding_records_cow_id_fkey";
            columns: ["cow_id"];
            isOneToOne: false;
            referencedRelation: "cows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "breeding_records_calf_id_fkey";
            columns: ["calf_id"];
            isOneToOne: false;
            referencedRelation: "cows";
            referencedColumns: ["id"];
          }
        ];
      };
      health_records: {
        Row: HealthRecord;
        Insert: Partial<HealthRecord>;
        Update: Partial<HealthRecord>;
        Relationships: [
          {
            foreignKeyName: "health_records_cow_id_fkey";
            columns: ["cow_id"];
            isOneToOne: false;
            referencedRelation: "cows";
            referencedColumns: ["id"];
          }
        ];
      };
      milk_quality_records: {
        Row: MilkQualityRecord;
        Insert: Partial<MilkQualityRecord>;
        Update: Partial<MilkQualityRecord>;
        Relationships: [
          {
            foreignKeyName: "milk_quality_records_cow_id_fkey";
            columns: ["cow_id"];
            isOneToOne: false;
            referencedRelation: "cows";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "fk_quality_farmer";
            columns: ["farmer_id"];
            isOneToOne: false;
            referencedRelation: "farmers";
            referencedColumns: ["id"];
          }
        ];
      };
      expenses: {
        Row: Expense;
        Insert: Partial<Expense>;
        Update: Partial<Expense>;
        Relationships: [];
      };
      incomes: {
        Row: Income;
        Insert: Partial<Income>;
        Update: Partial<Income>;
        Relationships: [];
      };
      farmers: {
        Row: Farmer;
        Insert: Partial<Farmer>;
        Update: Partial<Farmer>;
        Relationships: [];
      };
      deliveries: {
        Row: Delivery;
        Insert: Partial<Delivery>;
        Update: Partial<Delivery>;
        Relationships: [
          {
            foreignKeyName: "deliveries_farmer_id_fkey";
            columns: ["farmer_id"];
            isOneToOne: false;
            referencedRelation: "farmers";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      v_today_summary: {
        Row: TodaySummary;
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      cow_status: CowStatus;
      cow_sex: CowSex;
      feed_type: FeedType;
      expense_category: ExpenseCategory;
      income_category: IncomeCategory;
      pd_result: PdResult;
      pass_fail: PassFail;
      quality_status: QualityStatus;
      payment_status: PaymentStatus;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
