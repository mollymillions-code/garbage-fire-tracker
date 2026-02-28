# Claude Code Operating Notes

This repository uses `.ai-collab` as required shared memory for agent handoff.

## Mandatory Preflight (Before Any Work)

1. Read all of:
   - `.ai-collab/STATUS.md`
   - `.ai-collab/CHANGELOG.md`
   - `.ai-collab/ARCHITECTURE.md`
   - `.ai-collab/DECISIONS.md`
2. Summarize active work and relevant prior decisions in your plan.
3. Only then start edits, commands, or implementation.

If a request mentions "ai collapse" or "ai collab", treat it as `.ai-collab`.

## Mandatory Post-Work Sync

After meaningful implementation, debugging, review, or deployment work:

1. Update all four `.ai-collab` files.
2. Record concrete timestamps, files touched, and impacts.
3. Add durable decisions to `DECISIONS.md`.
4. Keep newest `CHANGELOG.md` entries at the top.

## Project Overview

Garbage Fire Tracker — real-time satellite fire detection dashboard for New Town, Kolkata.

- **Stack**: Next.js 16, React 19, TypeScript, Tailwind v4, Leaflet, SWR, Recharts
- **Data**: NASA FIRMS (4 satellite sources with dedup) + WAQI air quality
- **UI**: Mission control aesthetic — full-viewport map, floating glass panels, HUD brackets, cyan accents, JetBrains Mono
- **Dev server**: `npx next dev --turbopack -p 3457` (or any free port)
- **Env**: `.env.local` needs `FIRMS_MAP_KEY` and `WAQI_TOKEN`

## Key File Paths

- Layout: `src/components/Dashboard.tsx` (main orchestrator)
- Map: `src/components/map/MapInner.tsx` (Leaflet + overlays)
- API: `src/app/api/firms/route.ts`, `src/app/api/aqi/route.ts`
- Data: `src/lib/firms.ts` (multi-source fetch + dedup), `src/lib/waqi.ts`
- Hooks: `src/hooks/useFireData.ts` (adaptive refresh), `src/hooks/useAqiData.ts`
- Design: `src/app/globals.css` (mc-panel system), `src/lib/constants.ts`
- Types: `src/types/firms.ts`, `src/types/aqi.ts`

## Guardrails

- Do not invent history; log only evidence from repository state, diffs, logs, or executed commands.
- Do not skip `.ai-collab` updates when behavior, architecture, or operational expectations changed.
- Always preserve the multi-source FIRMS pipeline (4 sources + dedup) — do not regress to single-source.
- Maintain the mission control design system (mc-panel, mc-corners, mc-glow, mc-dot classes in globals.css).
