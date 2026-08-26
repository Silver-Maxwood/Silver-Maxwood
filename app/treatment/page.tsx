import { Topbar } from "@/components/Topbar";
import { HealthEventForm } from "@/components/BreedingHealthForms";
import { VaccineForm } from "@/components/TreatmentVaccineForms";
import { getCows, getHealthRecords } from "@/lib/queries";
import { formatDate } from "@/lib/utils/format";

export const metadata = {
  title: "Treatment & Vaccines — Silver Maxwood Dairies",
  description: "Log and track cow treatments, medicines, and vaccine records.",
};

export default async function TreatmentPage() {
  const [cows, health] = await Promise.all([getCows(), getHealthRecords()]);
  const cowMap = new Map(cows.map((c) => [c.id, c]));

  return (
    <>
      <Topbar
        title="Treatment & Vaccines"
        subtitle="Log treatments, medicines, and vaccination records"
      />

      <div className="px-4 lg:px-8 py-6 grid lg:grid-cols-3 gap-6">
        {/* Forms column */}
        <div className="space-y-6">
          <HealthEventForm cows={cows} />
          <VaccineForm cows={cows} />
        </div>

        {/* Records column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Treatment history */}
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
                  <th className="px-4 py-3 font-medium">Vet</th>
                  <th className="px-4 py-3 font-medium">Withdrawal ends</th>
                </tr>
              </thead>
              <tbody>
                {health.map((h) => {
                  const active =
                    h.withdrawal_end_date && new Date(h.withdrawal_end_date) >= new Date();
                  return (
                    <tr
                      key={h.id}
                      className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60"
                    >
                      <td className="px-4 py-3 font-medium text-forest-900">
                        {cowMap.get(h.cow_id)?.tag_number ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-silver-600">{formatDate(h.date)}</td>
                      <td className="px-4 py-3 text-silver-600">{h.condition}</td>
                      <td className="px-4 py-3 text-silver-600">{h.medicine ?? "—"}</td>
                      <td className="px-4 py-3 text-silver-600">{h.vet ?? "—"}</td>
                      <td className="px-4 py-3">
                        {h.withdrawal_end_date ? (
                          <span
                            className={
                              active
                                ? "font-medium text-alert-red"
                                : "text-silver-600"
                            }
                          >
                            {formatDate(h.withdrawal_end_date)}{" "}
                            {active && "(NOT FOR SALE)"}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })}
                {health.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-silver-600">
                      No treatment records yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Vaccine records placeholder */}
          <div className="card overflow-x-auto">
            <div className="px-4 py-3 border-b border-silver-200">
              <h3 className="font-display text-lg text-forest-900">Vaccine records</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
                  <th className="px-4 py-3 font-medium">Cow</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Disease</th>
                  <th className="px-4 py-3 font-medium">Vaccine type</th>
                  <th className="px-4 py-3 font-medium">Dosage</th>
                  <th className="px-4 py-3 font-medium">Vet</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-silver-600">
                    No vaccine records yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
