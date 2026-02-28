import { format, parseISO } from "date-fns";
import { AQI_CATEGORIES, CONFIDENCE_COLORS } from "./constants";
import type { AqiCategory } from "@/types/aqi";
import type { FireHotspot } from "@/types/firms";

export function getAqiCategory(aqi: number): {
  label: AqiCategory;
  color: string;
  textColor: string;
} {
  const cat = AQI_CATEGORIES.find((c) => aqi >= c.min && aqi <= c.max);
  return cat
    ? { label: cat.label as AqiCategory, color: cat.color, textColor: cat.textColor }
    : { label: "Hazardous", color: "#7f1d1d", textColor: "#fff" };
}

export function getConfidenceColor(confidence: "low" | "nominal" | "high"): string {
  return CONFIDENCE_COLORS[confidence];
}

export function formatFireTime(acqDate: string, acqTime: string): string {
  const hours = acqTime.padStart(4, "0").slice(0, 2);
  const mins = acqTime.padStart(4, "0").slice(2, 4);

  // Convert UTC to IST (+5:30)
  const utcDate = new Date(`${acqDate}T${hours}:${mins}:00Z`);
  return utcDate.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function timeRangeToDays(range: string): number {
  switch (range) {
    case "24h": return 1;
    case "48h": return 2;
    case "7d": return 7;
    case "30d": return 30;
    default: return 1;
  }
}

export function computeDailyCounts(hotspots: FireHotspot[]): { date: string; count: number }[] {
  const counts: Record<string, number> = {};
  for (const h of hotspots) {
    counts[h.acq_date] = (counts[h.acq_date] || 0) + 1;
  }
  return Object.entries(counts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({
      date: format(parseISO(date), "MMM d"),
      count,
    }));
}
