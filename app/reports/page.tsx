import { Topbar } from "@/components/Topbar";
import { MetricCard } from "@/components/MetricCard";
import { ReportMonthSelector } from "@/components/ReportMonthSelector";
import { ReportExportButtons } from "@/components/ReportExportButtons";
import { MonthlyProductionChart } from "@/components/MonthlyProductionChart";
import { CategoryBreakdownChart } from "@/components/CategoryBreakdownChart";
import { StatusBadge } from "@/components/StatusBadge";
import { getMonthlyReportData } from "@/lib/queries";
import { formatKSh, formatLitres, formatDate } from "@/lib/utils/format";
import {
  TrendingUp,
  Coins,
  Scale,
  Milk,
  Baby,
  Activity,
  Award,
  Truck,
  Percent,
} from "lucide-react";
import Image from "next/image";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: { month?: string };
}) {
  const today = new Date();
  let year = today.getFullYear();
  let month = today.getMonth() + 1;

  if (searchParams.month && /^\d{4}-\d{2}$/.test(searchParams.month)) {
    const [y, m] = searchParams.month.split("-").map(Number);
    if (!isNaN(y) && !isNaN(m) && m >= 1 && m <= 12) {
      year = y;
      month = m;
    }
  }

  const data = await getMonthlyReportData(year, month);

  const profitTone = data.totals.netProfit > 0 ? "positive" : data.totals.netProfit < 0 ? "danger" : "default";

  // Category data for charts
  const expenseChartData = data.expenseByCategory.map((e) => ({
    category: e.category,
    amount: e.amount,
  }));

  const feedChartData = data.feedByType.map((f) => ({
    category: f.feedType,
    amount: f.amount,
  }));

  const rejectionRate =
    data.totals.totalMilkLitres > 0
      ? ((data.totals.rejectedMilkLitres / data.totals.totalMilkLitres) * 100).toFixed(1)
      : "0.0";

  return (
    <>
      <div className="print:hidden">
        <Topbar
          title="Monthly Farm Report"
          subtitle={`Performance summary & farm outcomes for ${data.monthLabel}`}
        />
      </div>

      {/* Printable Report Header */}
      <div className="hidden print:block p-6 border-b-2 border-forest-900 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-forest-900">
              <Image src="/logo.png" alt="Silver Maxwood Dairies" fill className="object-cover" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-forest-950">Silver Maxwood Dairies</h1>
              <p className="text-xs text-forest-800 tracking-wider uppercase font-medium">
                Official Monthly Farm Operations &amp; Outcome Report
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-forest-900 space-y-0.5">
            <p className="font-semibold text-sm">{data.monthLabel}</p>
            <p>Period: {formatDate(data.startDate)} – {formatDate(data.endDate)}</p>
            <p className="text-silver-600">Generated: {formatDate(new Date())}</p>
          </div>
        </div>
      </div>

      <div className="px-4 lg:px-8 py-6 space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 card p-4 print:hidden">
          <ReportMonthSelector
            currentYear={year}
            currentMonth={month}
            startDate={data.startDate}
            endDate={data.endDate}
          />
          <ReportExportButtons data={data} />
        </div>

        {/* Executive Summary Cards */}
        <div>
          <h2 className="font-display text-lg text-forest-900 mb-3 print:text-base">Executive Performance Summary</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Total Milk Output"
              value={formatLitres(data.totals.acceptedMilkLitres)}
              icon={Milk}
              tone="positive"
              hint={`${data.totals.avgLitresPerDay} L/day avg across month`}
            />
            <MetricCard
              label="Gross Milk Income"
              value={formatKSh(data.totals.milkIncome)}
              icon={Coins}
              tone="positive"
              hint={`Avg price: ${formatKSh(data.totals.avgMilkPricePerLitre)}/L`}
            />
            <MetricCard
              label="Total Operating Costs"
              value={formatKSh(data.totals.totalExpenses)}
              icon={TrendingUp}
              tone="warning"
              hint={`Feed: ${formatKSh(data.totals.feedCost)} | Other: ${formatKSh(data.totals.otherExpenses)}`}
            />
            <MetricCard
              label="Net Profit / Margin"
              value={formatKSh(data.totals.netProfit)}
              icon={Scale}
              tone={profitTone}
              hint="Gross revenue minus all operational costs"
            />
          </div>
        </div>

        {/* Secondary KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-silver-600">Feed Cost / Litre</span>
            <p className="font-display text-xl text-forest-900 mt-1">{formatKSh(data.totals.feedCostPerLitre)} / L</p>
            <p className="text-[11px] text-silver-500 mt-0.5">Feed efficiency metric</p>
          </div>
          <div className="card p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-silver-600">Active Milking Cows</span>
            <p className="font-display text-xl text-forest-900 mt-1">{data.totals.activeMilkingCows} head</p>
            <p className="text-[11px] text-silver-500 mt-0.5">~{data.totals.avgLitresPerCowDay} L/cow/day</p>
          </div>
          <div className="card p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-silver-600">Rejection Rate</span>
            <p className="font-display text-xl text-forest-900 mt-1">{rejectionRate}%</p>
            <p className="text-[11px] text-silver-500 mt-0.5">{formatLitres(data.totals.rejectedMilkLitres)} rejected</p>
          </div>
          <div className="card p-4">
            <span className="text-xs font-medium uppercase tracking-wide text-silver-600">Collection Outgrowers</span>
            <p className="font-display text-xl text-forest-900 mt-1">{formatLitres(data.totals.collectionLitres)}</p>
            <p className="text-[11px] text-silver-500 mt-0.5">Payout: {formatKSh(data.totals.collectionPayout)}</p>
          </div>
        </div>

        {/* Milk Production Section */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg text-forest-900">Daily Milk Production Yield</h3>
                <p className="text-xs text-silver-600">Accepted vs. rejected litres per day</p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-pasture-600 inline-block"></span> Accepted</span>
                <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-alert-red inline-block"></span> Rejected</span>
              </div>
            </div>
            <MonthlyProductionChart data={data.dailyProduction} />
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="font-display text-lg text-forest-900">Production Breakdown</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center py-2 border-b border-silver-200">
                <span className="text-silver-600">Morning (AM) Milk</span>
                <span className="font-medium text-forest-900">{formatLitres(data.totals.morningMilkLitres)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-silver-200">
                <span className="text-silver-600">Evening (PM) Milk</span>
                <span className="font-medium text-forest-900">{formatLitres(data.totals.eveningMilkLitres)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-silver-200">
                <span className="text-silver-600">Total Accepted</span>
                <span className="font-medium text-pasture-600">{formatLitres(data.totals.acceptedMilkLitres)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-silver-200">
                <span className="text-silver-600">Total Rejected</span>
                <span className="font-medium text-alert-red">{formatLitres(data.totals.rejectedMilkLitres)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-silver-600">Daily Production Average</span>
                <span className="font-medium text-forest-900">{data.totals.avgLitresPerDay} L / day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Producing Cows Table */}
        <div className="card overflow-x-auto">
          <div className="px-5 py-4 border-b border-silver-200 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-forest-900 flex items-center gap-2">
                <Award size={20} className="text-gold-500" />
                <span>Top Producing Cows Leaderboard</span>
              </h3>
              <p className="text-xs text-silver-600">Ranked by total accepted milk output in {data.monthLabel}</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-pasture-100 text-pasture-700 rounded-full">
              {data.topCows.length} cows recorded
            </span>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200 bg-silver-100/50">
                <th className="px-4 py-3 font-medium">Rank</th>
                <th className="px-4 py-3 font-medium">Tag</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Breed</th>
                <th className="px-4 py-3 font-medium">Total Milk (L)</th>
                <th className="px-4 py-3 font-medium">Days Milked</th>
                <th className="px-4 py-3 font-medium">Daily Avg (L/d)</th>
              </tr>
            </thead>
            <tbody>
              {data.topCows.slice(0, 10).map((cow, idx) => (
                <tr key={cow.cowId} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                  <td className="px-4 py-3 font-medium text-silver-600">#{idx + 1}</td>
                  <td className="px-4 py-3 font-semibold text-forest-900">{cow.tagNumber}</td>
                  <td className="px-4 py-3 text-silver-600">{cow.name || "—"}</td>
                  <td className="px-4 py-3 text-silver-600">{cow.breed || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-pasture-600">{cow.totalLitres} L</td>
                  <td className="px-4 py-3 text-silver-600">{cow.daysMilked} days</td>
                  <td className="px-4 py-3 text-silver-600 font-medium">{cow.avgDaily} L</td>
                </tr>
              ))}
              {data.topCows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-silver-600">
                    No milk records logged in {data.monthLabel}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Financial Breakdown Section */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5 space-y-4">
            <h3 className="font-display text-lg text-forest-900">Operating Expenses by Category</h3>
            <CategoryBreakdownChart data={expenseChartData} />
            <div className="pt-2 border-t border-silver-200 flex justify-between text-sm font-semibold text-forest-900">
              <span>Total Non-Feed Expenses</span>
              <span>{formatKSh(data.totals.otherExpenses)}</span>
            </div>
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="font-display text-lg text-forest-900">Feed Cost Breakdown by Type</h3>
            <CategoryBreakdownChart data={feedChartData} />
            <div className="pt-2 border-t border-silver-200 flex justify-between text-sm font-semibold text-forest-900">
              <span>Total Feed Expenditure</span>
              <span>{formatKSh(data.totals.feedCost)}</span>
            </div>
          </div>
        </div>

        {/* Breeding, Health & Farm Events */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="card p-5 space-y-4">
            <h3 className="font-display text-lg text-forest-900 flex items-center gap-2">
              <Baby size={18} className="text-pasture-600" />
              <span>Breeding &amp; Reproduction</span>
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-silver-200">
                <dt className="text-silver-600">AI Services Performed</dt>
                <dd className="font-semibold text-forest-900">{data.totals.aiServicesCount}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-silver-200">
                <dt className="text-silver-600">Calvings Recorded</dt>
                <dd className="font-semibold text-forest-900">{data.totals.calvingsCount}</dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="text-silver-600">Active Breeding Events</dt>
                <dd className="font-semibold text-forest-900">{data.recentBreeding.length}</dd>
              </div>
            </dl>
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="font-display text-lg text-forest-900 flex items-center gap-2">
              <Activity size={18} className="text-alert-amber" />
              <span>Veterinary &amp; Health</span>
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-silver-200">
                <dt className="text-silver-600">Treatments Logged</dt>
                <dd className="font-semibold text-forest-900">{data.totals.treatmentsCount}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-silver-200">
                <dt className="text-silver-600">Health Events</dt>
                <dd className="font-semibold text-forest-900">{data.recentHealth.length}</dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="text-silver-600">Disease Conditions</dt>
                <dd className="font-semibold text-forest-900">
                  {new Set(data.recentHealth.map((h) => h.condition)).size} types
                </dd>
              </div>
            </dl>
          </div>

          <div className="card p-5 space-y-4">
            <h3 className="font-display text-lg text-forest-900 flex items-center gap-2">
              <Truck size={18} className="text-forest-900" />
              <span>Collection Hub (Outgrowers)</span>
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between py-1.5 border-b border-silver-200">
                <dt className="text-silver-600">Collected Volume</dt>
                <dd className="font-semibold text-forest-900">{formatLitres(data.totals.collectionLitres)}</dd>
              </div>
              <div className="flex justify-between py-1.5 border-b border-silver-200">
                <dt className="text-silver-600">Net Payable</dt>
                <dd className="font-semibold text-forest-900">{formatKSh(data.totals.collectionPayout)}</dd>
              </div>
              <div className="flex justify-between py-1.5">
                <dt className="text-silver-600">Deliveries Recorded</dt>
                <dd className="font-semibold text-forest-900">{data.recentDeliveries.length}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Official Sign-Off Footer for Print */}
        <div className="hidden print:block pt-10 mt-10 border-t border-silver-300">
          <div className="grid grid-cols-3 gap-8 text-xs text-forest-900">
            <div>
              <p className="font-semibold">Prepared By:</p>
              <div className="h-10 border-b border-silver-400 mt-4"></div>
              <p className="text-silver-600 mt-1">Farm Operations Lead</p>
            </div>
            <div>
              <p className="font-semibold">Verified &amp; Audited By:</p>
              <div className="h-10 border-b border-silver-400 mt-4"></div>
              <p className="text-silver-600 mt-1">Finance &amp; Accounts Officer</p>
            </div>
            <div>
              <p className="font-semibold">Approved By:</p>
              <div className="h-10 border-b border-silver-400 mt-4"></div>
              <p className="text-silver-600 mt-1">Managing Director / Owner</p>
            </div>
          </div>
          <p className="text-[10px] text-center text-silver-500 mt-8">
            Silver Maxwood Dairies • Comprehensive Operations &amp; Financial Monthly Audit Report • Confidential
          </p>
        </div>
      </div>
    </>
  );
}
