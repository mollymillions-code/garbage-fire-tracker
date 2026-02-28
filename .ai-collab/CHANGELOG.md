# Changelog

## 2026-03-01 00:35 IST — Mission Control UI Redesign (Claude Code)

Task:
- Complete visual overhaul to immersive "mission control" command center.
- Fix critical map usability: no place labels on satellite/dark layers.

Files created:
- `src/components/controls/StatusBar.tsx` — Top status bar (FIRMS/WAQI health, detection count, sync time)
- `src/components/controls/BottomBar.tsx` — Bottom bar (time range, layer toggle, data credits)
- `src/components/controls/AlertBanner.tsx` — Pulsing alert for high-confidence fires
- `src/components/map/CoordinateDisplay.tsx` — LAT/LNG display on hover

Files rewritten:
- `src/components/Dashboard.tsx` — Full-viewport layout with floating glass panels
- `src/components/map/MapInner.tsx` — CARTO label overlay, ScaleControl, dark default
- `src/components/panels/AqiPanel.tsx` — Glass-morphism + HUD brackets + monospace
- `src/components/panels/StatsPanel.tsx` — Glass panel + recharts timeline + source dots
- `src/components/map/MapLegend.tsx` — Glass + cyan theme
- `src/components/map/FireMarkers.tsx` — Grid popup with monospace data
- `src/app/globals.css` — Full mc-panel design system

Files modified:
- `src/lib/constants.ts` — Added LABEL_OVERLAY
- `src/app/layout.tsx` — Added JetBrains Mono font
- `src/lib/utils.ts` — Added computeDailyCounts()

Files deleted:
- `src/components/controls/TimeRangeSelector.tsx` (absorbed into BottomBar)
- `src/components/controls/LayerToggle.tsx` (absorbed into BottomBar)

Impact:
- Place names now visible on map via CARTO label overlay.
- Full-screen map with floating glass panels, HUD corner brackets, cyan accents.
- Status bar shows system health at a glance.

## 2026-03-01 00:29 IST — Collaboration Governance Sync (Codex)

Files changed: `.ai-collab/*`, `CLAUDE.md`
Impact: Agent preflight requirements established.

## 2026-03-01 00:22 IST — FIRMS Multi-Source + Adaptive Cadence (Codex)

Files changed: `src/lib/constants.ts`, `src/lib/firms.ts`, `src/app/api/firms/route.ts`, `src/hooks/useFireData.ts`, `src/types/firms.ts`, `src/components/panels/StatsPanel.tsx`, `src/components/map/FireMarkers.tsx`, `src/components/Dashboard.tsx`
Impact: 4 satellite sources, dedup, adaptive 2-5min refresh, per-source freshness UI.

## 2026-03-01 00:08 IST — Map Visibility Fix (Codex)

Files changed: `src/components/map/MapInner.tsx`
Impact: Auto-focus on detections, sparse heatmap visibility fix.
