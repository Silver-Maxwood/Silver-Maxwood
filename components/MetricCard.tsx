import { type LucideIcon } from "lucide-react";
import clsx from "clsx";

export function MetricCard({
  label,
  value,
  icon: Icon,
  tone = "default",
  hint,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone?: "default" | "positive" | "warning" | "danger";
  hint?: string;
}) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-silver-600">{label}</span>
        <span
          className={clsx(
            "flex items-center justify-center h-8 w-8 rounded-full",
            tone === "default" && "bg-pasture-100 text-pasture-600",
            tone === "positive" && "bg-pasture-100 text-pasture-600",
            tone === "warning" && "bg-alert-amber-bg text-alert-amber",
            tone === "danger" && "bg-alert-red-bg text-alert-red"
          )}
        >
          <Icon size={16} />
        </span>
      </div>
      <p className="font-display text-2xl lg:text-3xl text-forest-900">{value}</p>
      {hint && <p className="text-xs text-silver-600">{hint}</p>}
    </div>
  );
}
