export const NEW_TOWN_CENTER: [number, number] = [22.5958, 88.4838];
export const DEFAULT_ZOOM = 13;

// New Town / Rajarhat area with small buffer (~8km x 7km)
export const FIRMS_BBOX = "88.42,22.56,88.53,22.64";

export const FIRMS_SOURCES = [
  "VIIRS_SNPP_NRT",
  "VIIRS_NOAA20_NRT",
  "VIIRS_NOAA21_NRT",
  "MODIS_NRT",
] as const;

export type FirmsSource = (typeof FIRMS_SOURCES)[number];

export const FIRMS_SOURCE_LABELS: Record<FirmsSource, string> = {
  VIIRS_SNPP_NRT: "VIIRS SNPP",
  VIIRS_NOAA20_NRT: "VIIRS NOAA-20",
  VIIRS_NOAA21_NRT: "VIIRS NOAA-21",
  MODIS_NRT: "MODIS",
};

export const LABEL_OVERLAY = {
  url: "https://basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
  attribution: "&copy; CartoDB",
} as const;

export const TILE_LAYERS = {
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Tiles &copy; Esri",
    name: "Satellite",
  },
  osm: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenStreetMap contributors",
    name: "Street Map",
  },
  dark: {
    url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    attribution: "&copy; CartoDB",
    name: "Dark",
  },
} as const;

export const CONFIDENCE_COLORS = {
  high: "#ef4444",
  nominal: "#f97316",
  low: "#eab308",
} as const;

export const AQI_CATEGORIES = [
  { min: 0, max: 50, label: "Good" as const, color: "#22c55e", textColor: "#000" },
  { min: 51, max: 100, label: "Moderate" as const, color: "#eab308", textColor: "#000" },
  { min: 101, max: 150, label: "Unhealthy for Sensitive Groups" as const, color: "#f97316", textColor: "#000" },
  { min: 151, max: 200, label: "Unhealthy" as const, color: "#ef4444", textColor: "#fff" },
  { min: 201, max: 300, label: "Very Unhealthy" as const, color: "#a855f7", textColor: "#fff" },
  { min: 301, max: 500, label: "Hazardous" as const, color: "#7f1d1d", textColor: "#fff" },
];
