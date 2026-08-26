import clsx from "clsx";

const TONE_MAP: Record<string, string> = {
  MILKING: "bg-pasture-100 text-pasture-600",
  DRY: "bg-silver-200 text-silver-600",
  PREGNANT: "bg-gold-100 text-gold-500",
  CALF: "bg-blue-50 text-blue-600",
  SICK: "bg-alert-red-bg text-alert-red",
  SOLD: "bg-silver-200 text-silver-600",
  DEAD: "bg-silver-200 text-silver-600",
  ACCEPTED: "bg-pasture-100 text-pasture-600",
  REJECTED: "bg-alert-red-bg text-alert-red",
  PAID: "bg-pasture-100 text-pasture-600",
  PENDING: "bg-alert-amber-bg text-alert-amber",
  POSITIVE: "bg-pasture-100 text-pasture-600",
  NEGATIVE: "bg-alert-red-bg text-alert-red",
  PASS: "bg-pasture-100 text-pasture-600",
  FAIL: "bg-alert-red-bg text-alert-red",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        TONE_MAP[status] ?? "bg-silver-200 text-silver-600"
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
