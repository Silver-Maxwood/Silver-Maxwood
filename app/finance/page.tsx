import { Topbar } from "@/components/Topbar";
import { MetricCard } from "@/components/MetricCard";
import { ExpenseIncomeForm } from "@/components/FinanceForms";
import { CategoryBreakdownChart } from "@/components/CategoryBreakdownChart";
import { getExpenses, getIncomes, getFeedRecords } from "@/lib/queries";
import { formatKSh, formatDate } from "@/lib/utils/format";
import { TrendingUp, TrendingDown, Scale } from "lucide-react";

export default async function FinancePage() {
  const [expenses, incomes, feed] = await Promise.all([
    getExpenses(30),
    getIncomes(30),
    getFeedRecords(30),
  ]);

  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const totalIncome = incomes.reduce((s, i) => s + Number(i.amount), 0);
  const netProfit = totalIncome - totalExpenses;

  const expenseByCategory = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount);
      return acc;
    }, {})
  )
    .map(([category, amount]) => ({ category: category.replace(/_/g, " "), amount: Math.round(amount) }))
    .sort((a, b) => b.amount - a.amount);

  const feedByType = Object.entries(
    feed.reduce<Record<string, number>>((acc, f) => {
      acc[f.feed_type] = (acc[f.feed_type] ?? 0) + Number(f.total_cost);
      return acc;
    }, {})
  )
    .map(([category, amount]) => ({ category: category.replace(/_/g, " "), amount: Math.round(amount) }))
    .sort((a, b) => b.amount - a.amount);

  const recentTransactions = [
    ...expenses.map((e) => ({ ...e, kind: "Expense" as const })),
    ...incomes.map((i) => ({ ...i, kind: "Income" as const })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 20);

  return (
    <>
      <Topbar title="Finance & Profitability" subtitle="Last 30 days — profit & loss and cost breakdowns" />

      <div className="px-4 lg:px-8 py-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard label="Total Income" value={formatKSh(totalIncome)} icon={TrendingUp} tone="positive" />
          <MetricCard label="Total Expenses" value={formatKSh(totalExpenses)} icon={TrendingDown} tone="warning" />
          <MetricCard label="Net Profit" value={formatKSh(netProfit)} icon={Scale} tone={netProfit >= 0 ? "positive" : "danger"} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ExpenseIncomeForm />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="card p-5">
              <h3 className="font-display text-lg text-forest-900 mb-1">Expenses by category</h3>
              <p className="text-sm text-silver-600 mb-4">Last 30 days</p>
              <CategoryBreakdownChart data={expenseByCategory} />
            </div>

            <div className="card p-5">
              <h3 className="font-display text-lg text-forest-900 mb-1">Feed cost breakdown</h3>
              <p className="text-sm text-silver-600 mb-4">Last 30 days, by feed type</p>
              <CategoryBreakdownChart data={feedByType} />
            </div>

            <div className="card overflow-x-auto">
              <div className="px-4 py-3 border-b border-silver-200">
                <h3 className="font-display text-lg text-forest-900">Recent transactions</h3>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Type</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Description</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTransactions.map((t) => (
                    <tr key={`${t.kind}-${t.id}`} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                      <td className="px-4 py-3 text-silver-600">{formatDate(t.date)}</td>
                      <td className={`px-4 py-3 font-medium ${t.kind === "Income" ? "text-pasture-600" : "text-alert-red"}`}>{t.kind}</td>
                      <td className="px-4 py-3 text-silver-600">{t.category.replace(/_/g, " ")}</td>
                      <td className="px-4 py-3 text-silver-600">{t.description ?? "—"}</td>
                      <td className="px-4 py-3 text-right font-medium text-forest-900">{formatKSh(t.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
