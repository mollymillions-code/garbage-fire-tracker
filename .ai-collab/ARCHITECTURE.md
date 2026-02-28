# Architecture

Last verified: 2026-03-01 00:35 IST (+0530)

## Stack

- Framework: Next.js 16.1.6 (App Router, Turbopack)
- UI: React 19.2.3, Tailwind CSS v4
- Language: TypeScript v5
- Mapping: Leaflet 1.9.4, React Leaflet 5.0.0, leaflet.heat
- Charts: Recharts 3.7.0 (StatsPanel timeline)
- Data Fetching: SWR 2.4.1
- Parsing: csv-parse
- Fonts: Inter (sans), JetBrains Mono (monospace data)

## External Providers

- NASA FIRMS area CSV API (free map key): `FIRMS_MAP_KEY`
- WAQI API (free tier token): `WAQI_TOKEN`
- Env: `.env.local` (secrets), `.env.example` (template)

## Data Flow

Fire: `useFireData` -> `/api/firms` -> 4 FIRMS sources in parallel -> dedup -> response with sourceBreakdown + cacheTtlMs -> SWR adaptive refresh (2-5 min)

AQI: `useAqiData` -> `/api/aqi` -> WAQI city endpoint + nearby search -> 10min cache

## UI Layout (Mission Control)

```
[StatusBar] GFT COMMAND | DETECTIONS | FIRMS/WAQI status | SOURCES | SYNC TIME | ZONE | SYNC btn
[AlertBanner] (conditional: high-confidence fires)
[Map - full viewport]
  [AqiPanel floating left] glass-morphism, AQI + pollutants + stations
  [StatsPanel floating right] glass-morphism, stats + timeline + sources
  [HIDE PANELS toggle]
[BottomBar] TIME 24H/48H/7D/30D | LAYER MARKERS/HEATMAP | DATA credits
```

## Component Tree

```
Dashboard
├── StatusBar
├── AlertBanner (conditional)
├── MapView (dynamic, ssr:false)
│   └── MapInner
│       ├── LayersControl (Satellite/OSM/Dark[default])
│       ├── TileLayer (CARTO label overlay, always visible)
│       ├── ScaleControl
│       ├── CoordinateDisplay (LAT/LNG on hover)
│       ├── AutoFocusHotspots
│       ├── FireMarkers (pulsing ring+core icons)
│       ├── HeatmapLayer (adaptive radius, conditional)
│       └── MapLegend
├── AqiPanel (floating, glass)
├── StatsPanel (floating, glass, recharts)
└── BottomBar
```

## Design System (globals.css)

- `.mc-panel` — glass bg + border + HUD corner brackets
- `.mc-corners` — bottom corner brackets (child pseudo-elements)
- `.mc-glow` — cyan box-shadow
- `.mc-dot--live/warn/err/off` — pulsing status indicators
- `.mc-scanlines` — subtle fixed scanline overlay
- Accent: cyan #06b6d4, Fire: red/orange/yellow
- Map labels: CARTO light_only_labels overlay on all base layers
