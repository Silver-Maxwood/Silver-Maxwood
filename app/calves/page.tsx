import { Topbar } from "@/components/Topbar";
import { AddCalfForm } from "@/components/AddCalfForm";
import { HealthEventForm } from "@/components/BreedingHealthForms";
import { VaccineForm } from "@/components/TreatmentVaccineForms";
import { CowDetailsModal } from "@/components/CowDetailsModal";
import { getCows, getHealthRecords, getBreedingRecords, getVaccineRecords } from "@/lib/queries";
import { formatDate } from "@/lib/utils/format";
import Link from "next/link";

export const metadata = {
  title: "Calves — Silver Maxwood Dairies",
  description: "Manage calf records, genetics, and health",
};

export default async function CalvesPage({
  searchParams,
}: {
  searchParams: { cowId?: string };
}) {
  const [allCows, healthRecords, breedingRecords, vaccineRecords] = await Promise.all([
    getCows(),
    getHealthRecords(),
    getBreedingRecords(),
    getVaccineRecords(),
  ]);

  const calves = allCows.filter((c) => c.status === "CALF");
  const cowMap = new Map(allCows.map((c) => [c.id, c]));

  // Filter logs for calves only
  const calfIds = new Set(calves.map(c => c.id));
  const calfHealth = healthRecords.filter(h => calfIds.has(h.cow_id));
  const calfVaccines = vaccineRecords.filter(v => calfIds.has(v.cow_id));

  return (
    <>
      <Topbar title="Calves" subtitle={`${calves.length} calves in the herd`} />

      <div className="px-4 lg:px-8 py-6 space-y-8">
        <div className="flex justify-end">
          <AddCalfForm cows={allCows} />
        </div>

        {/* Calves Table */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
                <th className="px-4 py-3 font-medium">Tag / Name</th>
                <th className="px-4 py-3 font-medium">Mother (Dam)</th>
                <th className="px-4 py-3 font-medium">Father (Sire)</th>
                <th className="px-4 py-3 font-medium">Breed</th>
                <th className="px-4 py-3 font-medium">Sex</th>
                <th className="px-4 py-3 font-medium">Conception</th>
                <th className="px-4 py-3 font-medium">Age (DOB)</th>
              </tr>
            </thead>
            <tbody>
              {calves.map((calf) => {
                const searchStr = new URLSearchParams({ cowId: calf.id }).toString();
                const mother = calf.dam_id ? cowMap.get(calf.dam_id) : null;
                const sireName = calf.source?.startsWith("Sire: ") ? calf.source.replace("Sire: ", "") : "—";
                
                return (
                  <tr key={calf.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60 group cursor-pointer">
                    <td className="px-4 py-3 font-medium text-forest-900">
                      <Link href={`/calves?${searchStr}`} className="block w-full">
                        {calf.tag_number} {calf.name ? `(${calf.name})` : ""}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-silver-600">
                      <Link href={`/calves?${searchStr}`} className="block w-full">
                        {mother ? mother.tag_number : "—"}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-silver-600">
                      <Link href={`/calves?${searchStr}`} className="block w-full">{sireName}</Link>
                    </td>
                    <td className="px-4 py-3 text-silver-600">
                      <Link href={`/calves?${searchStr}`} className="block w-full">{calf.breed ?? "—"}</Link>
                    </td>
                    <td className="px-4 py-3 text-silver-600">
                      <Link href={`/calves?${searchStr}`} className="block w-full">{calf.sex === "FEMALE" ? "Heifer" : "Bull"}</Link>
                    </td>
                    <td className="px-4 py-3 text-silver-600">
                      <Link href={`/calves?${searchStr}`} className="block w-full">{calf.mode_of_conception ?? "—"}</Link>
                    </td>
                    <td className="px-4 py-3 text-silver-600">
                      <Link href={`/calves?${searchStr}`} className="block w-full">{formatDate(calf.dob)}</Link>
                    </td>
                  </tr>
                );
              })}
              {calves.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-silver-600">
                    No calves currently in the system.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Health & Vaccine Logs Section */}
        <div className="grid lg:grid-cols-3 gap-6 pt-4 border-t border-silver-200">
          <div className="space-y-6">
            <h3 className="font-display text-lg text-forest-900 px-2">Log Calf Treatments</h3>
            <HealthEventForm cows={calves} />
            <VaccineForm cows={calves} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-display text-lg text-forest-900 px-2">Recent Calf Health History</h3>
            
            <div className="card overflow-x-auto">
              <div className="px-4 py-3 border-b border-silver-200">
                <h4 className="font-medium text-forest-900">Treatment Logs</h4>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200 bg-silver-50">
                    <th className="px-4 py-3 font-medium">Calf</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Condition & Medicine</th>
                  </tr>
                </thead>
                <tbody>
                  {calfHealth.map(h => (
                    <tr key={h.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                      <td className="px-4 py-3 font-medium text-forest-900">{cowMap.get(h.cow_id)?.tag_number}</td>
                      <td className="px-4 py-3 text-silver-600">{formatDate(h.date)}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-forest-900 block">{h.condition}</span>
                        {h.medicine && <span className="text-silver-500 text-xs">Med: {h.medicine}</span>}
                      </td>
                    </tr>
                  ))}
                  {calfHealth.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-6 text-center text-silver-500">No treatments logged for calves.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="card overflow-x-auto">
              <div className="px-4 py-3 border-b border-silver-200">
                <h4 className="font-medium text-forest-900">Vaccine Logs</h4>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200 bg-silver-50">
                    <th className="px-4 py-3 font-medium">Calf</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Disease & Vaccine</th>
                  </tr>
                </thead>
                <tbody>
                  {calfVaccines.map(v => (
                    <tr key={v.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                      <td className="px-4 py-3 font-medium text-forest-900">{cowMap.get(v.cow_id)?.tag_number}</td>
                      <td className="px-4 py-3 text-silver-600">{formatDate(v.date)}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-forest-900 block">{v.disease}</span>
                        {v.vaccine_type && <span className="text-silver-500 text-xs">Type: {v.vaccine_type}</span>}
                      </td>
                    </tr>
                  ))}
                  {calfVaccines.length === 0 && (
                    <tr><td colSpan={3} className="px-4 py-6 text-center text-silver-500">No vaccines logged for calves.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
      
      <CowDetailsModal cows={allCows} healthRecords={healthRecords} breedingRecords={breedingRecords} />
    </>
  );
}
