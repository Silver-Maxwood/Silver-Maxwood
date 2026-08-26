/**
 * Formats a number as Kenyan Shilling, e.g. formatKSh(154320.5) -> "KSh 154,320.50"
 */
export function formatKSh(amount: number | null | undefined): string {
  const value = amount ?? 0;
  return `KSh ${value.toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Compact KSh for tight card spaces, e.g. "KSh 12.4K" */
export function formatKShCompact(amount: number | null | undefined): string {
  const value = amount ?? 0;
  if (Math.abs(value) >= 1_000_000) return `KSh ${(value / 1_000_000).toFixed(1)}M`;
  if (Math.abs(value) >= 1_000) return `KSh ${(value / 1_000).toFixed(1)}K`;
  return formatKSh(value);
}

export function formatLitres(litres: number | null | undefined): string {
  return `${(litres ?? 0).toLocaleString("en-KE", { maximumFractionDigits: 1 })} L`;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  if (typeof date === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(date);
    if (match) {
      const [, y, m, d] = match;
      return `${d}/${m}/${y}`;
    }
  }
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "—";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

export function daysUntil(date: string | Date | null | undefined): number | null {
  if (!date) return null;
  const target = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function todayDDMMYYYY(): string {
  const d = new Date();
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}
