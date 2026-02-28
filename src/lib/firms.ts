import { parse } from "csv-parse/sync";
import type { FireHotspot } from "@/types/firms";

const FIRMS_BASE = "https://firms.modaps.eosdis.nasa.gov/api/area/csv";

function mapConfidence(raw: string): "low" | "nominal" | "high" {
  const val = raw.toLowerCase().trim();
  if (val === "h" || val === "high") return "high";
  if (val === "n" || val === "nominal") return "nominal";
  return "low";
}

export async function fetchFirmsData(
  mapKey: string,
  source: string,
  bbox: string,
  days: number
): Promise<FireHotspot[]> {
  const maxDaysPerRequest = 10;
  const allHotspots: FireHotspot[] = [];

  if (days <= maxDaysPerRequest) {
    const url = `${FIRMS_BASE}/${mapKey}/${source}/${bbox}/${days}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`FIRMS API error: ${res.status}`);
    const csv = await res.text();
    allHotspots.push(...parseFirmsCsv(csv, source));
  } else {
    let remaining = days;
    let offsetDays = 0;
    while (remaining > 0) {
      const chunk = Math.min(remaining, maxDaysPerRequest);
      const date = new Date();
      date.setDate(date.getDate() - offsetDays);
      const dateStr = date.toISOString().split("T")[0];
      const url = `${FIRMS_BASE}/${mapKey}/${source}/${bbox}/${chunk}/${dateStr}`;
      const res = await fetch(url);
      if (res.ok) {
        const csv = await res.text();
        allHotspots.push(...parseFirmsCsv(csv, source));
      }
      remaining -= chunk;
      offsetDays += chunk;
    }
  }

  return allHotspots;
}

function parseFirmsCsv(csv: string, source: string): FireHotspot[] {
  if (!csv.trim()) return [];
  const records: Record<string, unknown>[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
    cast: true,
  });
  return records.map((r) => ({
    latitude: Number(r.latitude),
    longitude: Number(r.longitude),
    bright_ti4: Number(r.bright_ti4),
    scan: Number(r.scan),
    track: Number(r.track),
    acq_date: String(r.acq_date),
    acq_time: String(r.acq_time),
    satellite: String(r.satellite),
    instrument: String(r.instrument || "VIIRS"),
    confidence: mapConfidence(String(r.confidence)),
    version: String(r.version),
    bright_ti5: Number(r.bright_ti5),
    frp: Number(r.frp),
    daynight: String(r.daynight) as "D" | "N",
    source,
    sources: [source],
  }));
}

function confidenceScore(confidence: FireHotspot["confidence"]): number {
  if (confidence === "high") return 3;
  if (confidence === "nominal") return 2;
  return 1;
}

function acquisitionIso(acqDate: string, acqTime: string): string | undefined {
  const time = String(acqTime).padStart(4, "0");
  const hh = time.slice(0, 2);
  const mm = time.slice(2, 4);
  const utc = new Date(`${acqDate}T${hh}:${mm}:00Z`);
  return Number.isNaN(utc.getTime()) ? undefined : utc.toISOString();
}

function pickPreferredDetection(a: FireHotspot, b: FireHotspot): FireHotspot {
  if (confidenceScore(b.confidence) > confidenceScore(a.confidence)) return b;
  if (confidenceScore(b.confidence) < confidenceScore(a.confidence)) return a;
  if (b.frp > a.frp) return b;
  if (b.frp < a.frp) return a;
  if (b.bright_ti4 > a.bright_ti4) return b;
  return a;
}

function hotspotKey(h: FireHotspot): string {
  const lat = h.latitude.toFixed(4);
  const lng = h.longitude.toFixed(4);
  const time = h.acq_time.padStart(4, "0");
  return `${h.acq_date}|${time}|${lat}|${lng}`;
}

export function dedupeHotspots(hotspots: FireHotspot[]): FireHotspot[] {
  const byKey = new Map<string, FireHotspot>();

  for (const hotspot of hotspots) {
    const key = hotspotKey(hotspot);
    const existing = byKey.get(key);
    if (!existing) {
      byKey.set(key, hotspot);
      continue;
    }

    const preferred = pickPreferredDetection(existing, hotspot);
    const mergedSources = Array.from(
      new Set([
        ...(existing.sources ?? [existing.source]),
        ...(hotspot.sources ?? [hotspot.source]),
      ])
    );
    byKey.set(key, { ...preferred, sources: mergedSources });
  }

  return Array.from(byKey.values()).sort((a, b) => {
    const aIso = acquisitionIso(a.acq_date, a.acq_time);
    const bIso = acquisitionIso(b.acq_date, b.acq_time);
    if (aIso && bIso) {
      return bIso.localeCompare(aIso);
    }
    return b.frp - a.frp;
  });
}

export function getLatestAcquiredAt(hotspots: FireHotspot[]): string | undefined {
  let latest: string | undefined;
  for (const hotspot of hotspots) {
    const iso = acquisitionIso(hotspot.acq_date, hotspot.acq_time);
    if (!iso) continue;
    if (!latest || iso > latest) latest = iso;
  }
  return latest;
}
