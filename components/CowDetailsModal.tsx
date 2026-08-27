"use client";

import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Cow, HealthRecord, BreedingRecord } from "@/types/database";
import { formatDate } from "@/lib/utils/format";
import { StatusBadge } from "@/components/StatusBadge";

import { AddGrowthForm } from "./AddGrowthForm";

interface Props {
  cows: Cow[];
  healthRecords: HealthRecord[];
  breedingRecords: BreedingRecord[];
  growthRecords?: any[]; // Allow optional for now
}

export function CowDetailsModal({ cows, healthRecords, breedingRecords, growthRecords = [] }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const cowId = searchParams.get("cowId");
  const activeCow = cowId ? cows.find((c) => c.id === cowId) : null;
  const cowHealth = cowId ? healthRecords.filter((h) => h.cow_id === cowId) : [];
  const cowBreeding = cowId ? breedingRecords.filter((b) => b.cow_id === cowId) : [];
  const cowGrowth = cowId ? growthRecords.filter((g) => g.cow_id === cowId) : [];
  const latestGrowth = cowGrowth.length > 0 ? cowGrowth[0] : null;

  useEffect(() => {
    if (activeCow && dialogRef.current) {
      dialogRef.current.showModal();
    } else if (dialogRef.current) {
      dialogRef.current.close();
    }
  }, [activeCow]);

  function close() {
    router.push("/cows", { scroll: false }); // Note: this navigates to /cows regardless of where they came from. For a real app, you might want router.back()
  }

  const getAge = (dob: string | null) => {
    if (!dob) return "—";
    const birthDate = new Date(dob);
    const today = new Date();
    let months = (today.getFullYear() - birthDate.getFullYear()) * 12;
    months -= birthDate.getMonth();
    months += today.getMonth();
    
    if (months < 1) {
      const days = Math.floor((today.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
      return `${Math.max(0, days)} days`;
    }
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (years > 0) return `${years}y ${remainingMonths}m`;
    return `${months} months`;
  };

  if (!activeCow) return null;

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      className="backdrop:bg-forest-950/60 backdrop:backdrop-blur-sm p-0 rounded-2xl shadow-xl w-full max-w-2xl bg-white m-auto top-1/2 -translate-y-1/2 outline-none"
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <div className="flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-silver-200">
          <div>
            <h2 className="font-display text-2xl text-forest-900">
              {activeCow.name ? `${activeCow.tag_number} — ${activeCow.name}` : activeCow.tag_number}
            </h2>
            <div className="flex gap-2 mt-2 items-center">
              <StatusBadge status={activeCow.status} />
              <span className="bg-silver-100 text-silver-600 px-2 py-0.5 rounded-full text-xs font-medium">
                {activeCow.breed ?? "Unknown breed"}
              </span>
              <span className="bg-pasture-100 text-pasture-700 px-2 py-0.5 rounded-full text-xs font-medium">
                {getAge(activeCow.dob)}
              </span>
            </div>
          </div>
          <button
            onClick={close}
            className="p-2 text-silver-400 hover:text-forest-900 hover:bg-silver-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <div className="card p-3 bg-silver-50">
              <p className="text-xs font-medium text-silver-500 uppercase tracking-wide">DOB</p>
              <p className="text-sm text-forest-900 mt-1 font-medium">{formatDate(activeCow.dob)}</p>
            </div>
            <div className="card p-3 bg-silver-50">
              <p className="text-xs font-medium text-silver-500 uppercase tracking-wide">Sex</p>
              <p className="text-sm text-forest-900 mt-1 font-medium">{activeCow.sex}</p>
            </div>
            <div className="card p-3 bg-silver-50">
              <p className="text-xs font-medium text-silver-500 uppercase tracking-wide">Source</p>
              <p className="text-sm text-forest-900 mt-1 font-medium">{activeCow.source ?? "—"}</p>
            </div>
            <div className="card p-3 bg-silver-50">
              <p className="text-xs font-medium text-silver-500 uppercase tracking-wide">Lactation</p>
              <p className="text-sm text-forest-900 mt-1 font-medium">{activeCow.lactation_no ?? "—"}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4 mt-8">
            <h3 className="font-display text-lg text-forest-900">Growth Progress</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="border border-silver-200 rounded-xl p-4 shadow-sm bg-white">
              <p className="text-sm text-silver-500 mb-1">Latest Weight</p>
              <p className="text-2xl font-display text-forest-900">
                {latestGrowth?.weight ? `${latestGrowth.weight} kg` : "—"}
              </p>
              {latestGrowth && <p className="text-xs text-silver-400 mt-1">Recorded {formatDate(latestGrowth.date)}</p>}
            </div>
            <div className="border border-silver-200 rounded-xl p-4 shadow-sm bg-white">
              <p className="text-sm text-silver-500 mb-1">Latest Height</p>
              <p className="text-2xl font-display text-forest-900">
                {latestGrowth?.height ? `${latestGrowth.height} cm` : "—"}
              </p>
              {latestGrowth && <p className="text-xs text-silver-400 mt-1">Recorded {formatDate(latestGrowth.date)}</p>}
            </div>
          </div>

          <AddGrowthForm cowId={activeCow.id} />

          <h3 className="font-display text-lg text-forest-900 mb-4">Health & Condition Logs</h3>
          
          {cowHealth.length === 0 ? (
            <p className="text-sm text-silver-500 italic">No health records found for this cow.</p>
          ) : (
            <div className="space-y-4">
              {cowHealth.map((log) => {
                const isWithholding = log.withdrawal_end_date && new Date(log.withdrawal_end_date) >= new Date();
                return (
                  <div key={log.id} className="border border-silver-200 rounded-xl p-4 shadow-sm relative">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-forest-900">{log.condition}</h4>
                      <span className="text-xs text-silver-500">{formatDate(log.date)}</span>
                    </div>
                    {log.medicine && (
                      <p className="text-sm text-silver-600 mb-1">
                        <span className="font-medium">Medicine:</span> {log.medicine} 
                        {log.dosage && ` (${log.dosage})`}
                      </p>
                    )}
                    {log.treatment && (
                      <p className="text-sm text-silver-600 mb-2">
                        <span className="font-medium">Notes:</span> {log.treatment}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mt-3 text-xs">
                      {log.vet && (
                        <span className="bg-pasture-50 text-pasture-700 px-2 py-1 rounded-md">
                          Vet: {log.vet}
                        </span>
                      )}
                      {log.withdrawal_end_date && (
                        <span className={isWithholding ? "bg-alert-red/10 text-alert-red px-2 py-1 rounded-md font-medium" : "bg-silver-100 text-silver-600 px-2 py-1 rounded-md"}>
                          Withdrawal ends: {formatDate(log.withdrawal_end_date)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <h3 className="font-display text-lg text-forest-900 mt-8 mb-4">Breeding History</h3>
          
          {cowBreeding.length === 0 ? (
            <p className="text-sm text-silver-500 italic">No breeding records found for this cow.</p>
          ) : (
            <div className="space-y-4">
              {cowBreeding.map((log) => (
                <div key={log.id} className="border border-silver-200 rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-forest-900">AI Service</h4>
                    <span className="text-xs text-silver-500">{log.ai_date ? formatDate(log.ai_date) : 'N/A'}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm text-silver-600 mb-3">
                    {log.semen_used && (
                      <div><span className="font-medium text-silver-500">Semen:</span> {log.semen_used}</div>
                    )}
                    {log.technician && (
                      <div><span className="font-medium text-silver-500">Tech:</span> {log.technician}</div>
                    )}
                    {log.expected_calving_date && (
                      <div className="col-span-2"><span className="font-medium text-silver-500">Expected Calving:</span> {formatDate(log.expected_calving_date)}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 pt-3 border-t border-silver-100">
                    <span className="text-xs font-medium text-silver-500 uppercase tracking-wide">PD Result</span>
                    {log.pd_result ? <StatusBadge status={log.pd_result} /> : <span className="text-sm">Pending</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
