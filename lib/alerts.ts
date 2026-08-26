import { getBreedingRecords, getHealthRecords, getCows } from "@/lib/queries";
import { daysUntil } from "@/lib/utils/format";

export type Alert = {
  id: string;
  type: "breeding" | "withdrawal" | "feed";
  severity: "info" | "warning" | "danger";
  message: string;
};

const LOW_FEED_THRESHOLD_KG = 150; // simple demo threshold; wire to a real stock table if you add one

export async function getAlerts(): Promise<Alert[]> {
  const [breeding, health, cows] = await Promise.all([
    getBreedingRecords(),
    getHealthRecords(),
    getCows(),
  ]);

  const cowLabel = (cowId: string) => {
    const cow = cows.find((c) => c.id === cowId);
    return cow ? cow.name || cow.tag_number : "Cow";
  };

  const alerts: Alert[] = [];

  for (const b of breeding) {
    if (b.pd_result === "PENDING" && b.ai_date) {
      const since = daysUntil(b.ai_date);
      if (since !== null && since <= -45) {
        alerts.push({
          id: `pd-${b.id}`,
          type: "breeding",
          severity: "info",
          message: `${cowLabel(b.cow_id)} is due for a pregnancy diagnosis (PD)`,
        });
      }
    }
    if (b.expected_calving_date && !b.actual_calving_date) {
      const until = daysUntil(b.expected_calving_date);
      if (until !== null && until <= 14 && until >= -3) {
        alerts.push({
          id: `calving-${b.id}`,
          type: "breeding",
          severity: until <= 3 ? "danger" : "warning",
          message: `${cowLabel(b.cow_id)} is approaching calving (${until <= 0 ? "overdue" : `${until}d`})`,
        });
      }
    }
  }

  for (const h of health) {
    if (h.withdrawal_end_date) {
      const until = daysUntil(h.withdrawal_end_date);
      if (until !== null && until >= 0) {
        alerts.push({
          id: `withdrawal-${h.id}`,
          type: "withdrawal",
          severity: "danger",
          message: `${cowLabel(h.cow_id)}'s milk is under withdrawal — do not collect (${until}d left)`,
        });
      }
    }
  }

  return alerts;
}
