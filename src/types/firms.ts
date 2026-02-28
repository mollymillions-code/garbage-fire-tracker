export interface FireHotspot {
  latitude: number;
  longitude: number;
  bright_ti4: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
  satellite: string;
  instrument: string;
  confidence: "low" | "nominal" | "high";
  version: string;
  bright_ti5: number;
  frp: number;
  daynight: "D" | "N";
  source: string;
  sources?: string[];
}

export interface FireSourceSummary {
  source: string;
  count: number;
  fetchedAt: string;
  latestAcquiredAt?: string;
  error?: string;
}

export interface FirmsApiResponse {
  hotspots: FireHotspot[];
  fetchedAt: string;
  sources: string[];
  sourceBreakdown: FireSourceSummary[];
  totalCount: number;
  cacheTtlMs: number;
}

export type TimeRange = "24h" | "48h" | "7d" | "30d";
