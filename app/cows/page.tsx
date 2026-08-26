import Link from "next/link";
import { Topbar } from "@/components/Topbar";
import { AddCowForm } from "@/components/AddCowForm";
import { StatusBadge } from "@/components/StatusBadge";
import { getCows } from "@/lib/queries";
import { formatDate } from "@/lib/utils/format";
import type { CowStatus } from "@/types/database";
import clsx from "clsx";

const STATUSES: (CowStatus | "ALL")[] = ["ALL", "MILKING", "DRY", "PREGNANT", "CALF", "SICK", "SOLD", "DEAD"];

export default async function CowsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const cows = await getCows();
  const activeStatus = (searchParams.status as CowStatus | undefined) ?? "ALL";
  const filtered = activeStatus === "ALL" ? cows : cows.filter((c) => c.status === activeStatus);

  return (
    <>
      <Topbar title="Cows" subtitle={`${cows.length} animals in the herd`} />

      <div className="px-4 lg:px-8 py-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Link
                key={s}
                href={s === "ALL" ? "/cows" : `/cows?status=${s}`}
                className={clsx(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                  activeStatus === s
                    ? "bg-forest-900 text-white border-forest-900"
                    : "bg-white text-silver-600 border-silver-200 hover:border-forest-900/40"
                )}
              >
                {s === "ALL" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
              </Link>
            ))}
          </div>
          <AddCowForm />
        </div>

        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-silver-600 border-b border-silver-200">
                <th className="px-4 py-3 font-medium">Tag</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Breed</th>
                <th className="px-4 py-3 font-medium">DOB</th>
                <th className="px-4 py-3 font-medium">Lactation</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cow) => (
                <tr key={cow.id} className="border-b border-silver-200 last:border-0 hover:bg-silver-100/60">
                  <td className="px-4 py-3 font-medium text-forest-900">{cow.tag_number}</td>
                  <td className="px-4 py-3 text-silver-600">{cow.name ?? "—"}</td>
                  <td className="px-4 py-3 text-silver-600">{cow.breed ?? "—"}</td>
                  <td className="px-4 py-3 text-silver-600">{formatDate(cow.dob)}</td>
                  <td className="px-4 py-3 text-silver-600">{cow.lactation_no ?? "—"}</td>
                  <td className="px-4 py-3"><StatusBadge status={cow.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-silver-600">
                    No cows match this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
