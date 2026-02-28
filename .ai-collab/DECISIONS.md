# Decisions

## 2026-03-01 — Mission Control Immersive Layout (Claude Code)

Context: User wanted "mission control" aesthetic with better map usability.
Decision: Full-viewport map with floating glass panels. StatusBar + BottomBar replace old header/sidebar.
Why: Maximizes map real estate. Glass-morphism panels are toggle-able.

## 2026-03-01 — CARTO Label Overlay for Map (Claude Code)

Context: Satellite and dark base layers had no place names; users couldn't identify locations.
Decision: Add `light_only_labels` CARTO tile as permanent overlay (zIndex 650, overlayPane).
Why: Industry-standard pattern for labeled satellite/dark maps.

## 2026-03-01 — JetBrains Mono + Cyan Design System (Claude Code)

Context: Mission control UIs use monospace for data and cyan as system accent.
Decision: JetBrains Mono for data, cyan #06b6d4 as accent, CSS mc-panel system.
Why: Tabular-nums alignment, visual distinction from fire colors.

## 2026-03-01 — Free-Only Data Providers (Codex)

Decision: NASA FIRMS NRT (free map key) + WAQI free tier.
Why: No billing gate, fastest onboarding.

## 2026-03-01 — Multi-Source FIRMS Aggregation (Codex)

Decision: 4 sources (VIIRS_SNPP, VIIRS_NOAA20, VIIRS_NOAA21, MODIS). Dedup by date+time+coords.
Why: Increases detection probability.

## 2026-03-01 — Adaptive Refresh Cadence (Codex)

Decision: 24h=2min, 48h=3min, 7d=4min, 30d=5min.
Why: Freshness where it matters most.

## Pending

- Add OpenAQ as AQ fallback for WAQI outages.
- Mobile responsive layout (panels as bottom sheet on small screens).
