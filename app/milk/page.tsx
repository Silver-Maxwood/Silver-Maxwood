import { Topbar } from "@/components/Topbar";
import { MilkLogForm } from "@/components/MilkLogForm";
import { StatusBadge } from "@/components/StatusBadge";
import { getCows, getMilkRecords, getHealthRecords } from "@/lib/queries";
import { formatKSh, formatLitres, formatDate } from "@/lib/utils/format";

export default async function MilkPage() {
  const [cows, milkRecords, health] = await Promise.all([
    getCows(),
    getMilkRecords(14),
    getHealthRecords(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const todaysRecords = milkRecords.filter((m) => m.date === today);
  const cowMap = new Map(cows.map((c) => [c.id, c]));

  const withdrawalCowIds = new Set(
    health
      .filter((h) => h.withdrawal_end_date && h.withdrawal_end_date >= today)
      .map((h) => h.cow_id)
  );

  const acceptedToday = todaysRecords.filter((m) => !m.is_rejected);
  const rejectedToday = todaysRecords.filter((m) => m.is_rejected);
  const totalLitres = acceptedToday.reduce((s, m) => s + Number(m.total_litres), 0);
  const totalIncome = acceptedToday.reduce((s, m) => s + Number(m.total_income), 0);

  return (
    <>
      <Topbar title="Milk & Quality Control" subtitle="Daily log, rejection tracking, and quality tests" />

      <div className="px-4 lg:px-8 py-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <MilkLogForm cows={cows} withdrawalCowIds={withdrawalCowIds} />

          <div className="card p-5">
            <h3 className="font-display text-lg text-forest-900 mb-3">Today at a glance</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-silver-600">Accepted litres</dt><dd className="font-medium">{formatLitres(totalLitres)}</dd></div>
              <div className="flex justify-between"><dt className="text-silver-600">Rejected entries</dt><dd className="font-medium">{rejectedToday.length}</dd></div>
              <div className="flex justify-between"><dt className="text-silver-600">Milk income</dt><dd className="font-medium">{formatKSh(totalIncome)}</dd></div>
              <div className="flex justify-between"><dt className="text-silver-600">Cows on withdrawal</dt><dd className="font-medium">{withdrawalCowIds.size}</dd></div>
            </dl>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Cow</th>
                  <th className="px-4 py-3 font-medium">AM (L)</th>
                  <th className="px-4 py-3 font-medium">PM (L)</th>
                  <th className="px-4 py-3 font-medium">Total (L)</th>
                  <th className="px-4 py-3 font-medium">Buyer</th>
                  <th className="px-4 py-3 font-medium">Income</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {milkRecords.slice(0, 60).map((m) => {
                  const cow = cowMap.get(m.cow_id);
                  return (
                    <tr key={m.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                      <td className="px-4 py-3 text-silver-600">{formatDate(m.date)}</td>
                      <td className="px-4 py-3 font-medium text-forest-900">{cow?.tag_number ?? "—"}</td>
                      <td className="px-4 py-3 text-silver-600">{m.morning_litres}</td>
                      <td className="px-4 py-3 text-silver-600">{m.evening_litres}</td>
                      <td className="px-4 py-3 text-silver-600">{m.total_litres}</td>
                      <td className="px-4 py-3 text-silver-600">{m.buyer ?? "—"}</td>
                      <td className="px-4 py-3 text-silver-600">{formatKSh(m.total_income)}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={m.is_rejected ? "REJECTED" : "ACCEPTED"} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
