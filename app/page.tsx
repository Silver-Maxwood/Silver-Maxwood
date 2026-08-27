import { Topbar } from "@/components/Topbar";
import { MetricCard } from "@/components/MetricCard";
import { ProductionTrendChart } from "@/components/ProductionTrendChart";
import { getAlerts } from "@/lib/alerts";
import { getTodaySummary, getMilkRecords } from "@/lib/queries";
import { formatKSh, formatLitres } from "@/lib/utils/format";
import { Beef, Milk, Coins, TrendingUp, Baby, CalendarClock, AlertTriangle } from "lucide-react";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function DashboardPage() {
  const [summary, alerts, milkRecords] = await Promise.all([
    getTodaySummary(),
    getAlerts(),
    getMilkRecords(14),
  ]);

  const netMargin = summary.todays_milk_income - summary.todays_feed_cost;
  const criticalAlerts = alerts.filter((a) => a.severity === "danger");

  // Aggregate litres per day for the trend chart
  const byDate = new Map<string, number>();
  for (const m of milkRecords) {
    if (m.is_rejected) continue;
    byDate.set(m.date, (byDate.get(m.date) ?? 0) + Number(m.total_litres));
  }
  const trend = Array.from(byDate.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, litres]) => ({ date, litres: Math.round(litres * 10) / 10 }));

  return (
    <>
      <Topbar title="Dashboard" subtitle="Today's snapshot across the herd, milk and finances" />

      <div className="px-4 lg:px-8 py-6 space-y-6">
        {criticalAlerts.length > 0 && (
          <div className="rounded-card border border-alert-red/30 bg-alert-red-bg px-4 py-3 flex items-start gap-3">
            <AlertTriangle size={18} className="text-alert-red mt-0.5 shrink-0" />
            <div className="text-sm text-forest-900">
              <p className="font-medium">{criticalAlerts.length} item{criticalAlerts.length > 1 ? "s" : ""} need attention now</p>
              <p className="text-forest-800/80 mt-0.5">{criticalAlerts[0].message}{criticalAlerts.length > 1 ? ` — and ${criticalAlerts.length - 1} more.` : ""}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard label="Total Cattle" value={summary.total_cattle.toString()} icon={Beef} />
          <MetricCard label="Today's Milk" value={formatLitres(summary.todays_milk_litres)} icon={Milk} tone="positive" />
          <MetricCard label="Today's Milk Income" value={formatKSh(summary.todays_milk_income)} icon={Coins} tone="positive" />
          <MetricCard label="Today's Feed Cost" value={formatKSh(summary.todays_feed_cost)} icon={Coins} tone="warning" />
          <MetricCard
            label="Daily Net Margin"
            value={formatKSh(netMargin)}
            icon={TrendingUp}
            tone={netMargin >= 0 ? "positive" : "danger"}
            hint="Milk income minus feed cost"
          />
          <MetricCard label="Pregnant Cows" value={summary.pregnant_count.toString()} icon={Baby} />
          <MetricCard
            label="Due / Overdue Calving"
            value={summary.due_calving_count.toString()}
            icon={CalendarClock}
            tone={summary.due_calving_count > 0 ? "warning" : "default"}
          />
          <MetricCard
            label="Critical Alerts"
            value={alerts.length.toString()}
            icon={AlertTriangle}
            tone={criticalAlerts.length > 0 ? "danger" : "default"}
            hint={`${summary.active_withdrawal_count} on milk withdrawal`}
          />
        </div>

        <div className="card p-5">
          <h2 className="font-display text-lg text-forest-900 mb-1">Milk production, last 14 days</h2>
          <p className="text-sm text-silver-600 mb-4">Accepted litres across the herd, by day</p>
          <ProductionTrendChart data={trend} />
        </div>
      </div>
    </>
  );
}
