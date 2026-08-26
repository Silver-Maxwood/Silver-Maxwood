import { Topbar } from "@/components/Topbar";
import { StatusBadge } from "@/components/StatusBadge";
import { AiServiceForm, HealthEventForm } from "@/components/BreedingHealthForms";
import { getCows, getBreedingRecords, getHealthRecords } from "@/lib/queries";
import { formatDate, daysUntil } from "@/lib/utils/format";
import clsx from "clsx";

export default async function BreedingPage() {
  const [cows, breeding, health] = await Promise.all([
    getCows(),
    getBreedingRecords(),
    getHealthRecords(),
  ]);
  const cowMap = new Map(cows.map((c) => [c.id, c]));

  return (
    <>
      <Topbar title="Breeding & Health" subtitle="AI schedule, PD & calving alerts, and treatment logging" />

      <div className="px-4 lg:px-8 py-6 grid lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <AiServiceForm cows={cows} />
          <HealthEventForm cows={cows} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="card overflow-x-auto">
            <div className="px-4 py-3 border-b border-silver-200">
              <h3 className="font-display text-lg text-forest-900">Breeding schedule</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
                  <th className="px-4 py-3 font-medium">Cow</th>
                  <th className="px-4 py-3 font-medium">AI date</th>
                  <th className="px-4 py-3 font-medium">PD result</th>
                  <th className="px-4 py-3 font-medium">Expected calving</th>
                  <th className="px-4 py-3 font-medium">Countdown</th>
                </tr>
              </thead>
              <tbody>
                {breeding.map((b) => {
                  const until = daysUntil(b.expected_calving_date);
                  return (
                    <tr key={b.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                      <td className="px-4 py-3 font-medium text-forest-900">
                        {cowMap.get(b.cow_id)?.tag_number ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-silver-600">{formatDate(b.ai_date)}</td>
                      <td className="px-4 py-3">{b.pd_result && <StatusBadge status={b.pd_result} />}</td>
                      <td className="px-4 py-3 text-silver-600">{formatDate(b.expected_calving_date)}</td>
                      <td
                        className={clsx(
                          "px-4 py-3 font-medium",
                          until !== null && until <= 14 ? "text-alert-amber" : "text-silver-600"
                        )}
                      >
                        {until === null ? "—" : b.actual_calving_date ? "Calved" : until <= 0 ? "Overdue" : `${until}d`}
                      </td>
                    </tr>
                  );
                })}
                {breeding.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-silver-600">No breeding records yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card overflow-x-auto">
            <div className="px-4 py-3 border-b border-silver-200">
              <h3 className="font-display text-lg text-forest-900">Treatment history</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
                  <th className="px-4 py-3 font-medium">Cow</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Condition</th>
                  <th className="px-4 py-3 font-medium">Medicine</th>
                  <th className="px-4 py-3 font-medium">Withdrawal ends</th>
                </tr>
              </thead>
              <tbody>
                {health.map((h) => {
                  const active = h.withdrawal_end_date && new Date(h.withdrawal_end_date) >= new Date();
                  return (
                    <tr key={h.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                      <td className="px-4 py-3 font-medium text-forest-900">{cowMap.get(h.cow_id)?.tag_number ?? "—"}</td>
                      <td className="px-4 py-3 text-silver-600">{formatDate(h.date)}</td>
                      <td className="px-4 py-3 text-silver-600">{h.condition}</td>
                      <td className="px-4 py-3 text-silver-600">{h.medicine ?? "—"}</td>
                      <td className="px-4 py-3">
                        {h.withdrawal_end_date ? (
                          <span className={clsx("font-medium", active ? "text-alert-red" : "text-silver-600")}>
                            {formatDate(h.withdrawal_end_date)} {active && "(NOT FOR SALE)"}
                          </span>
                        ) : "—"}
                      </td>
                    </tr>
                  );
                })}
                {health.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-10 text-center text-silver-600">No treatment records yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
