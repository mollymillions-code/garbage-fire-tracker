import { NextRequest, NextResponse } from "next/server";
import { dedupeHotspots, fetchFirmsData, getLatestAcquiredAt } from "@/lib/firms";
import { getCache, setCache } from "@/lib/cache";
import { FIRMS_BBOX, FIRMS_SOURCES } from "@/lib/constants";
import type { FirmsApiResponse } from "@/types/firms";

function getAdaptiveCacheTtlMs(days: number): number {
  if (days <= 1) return 2 * 60 * 1000;
  if (days <= 2) return 3 * 60 * 1000;
  if (days <= 7) return 4 * 60 * 1000;
  return 5 * 60 * 1000;
}

function parseSources(searchParams: URLSearchParams): string[] {
  const allowed = new Set(FIRMS_SOURCES);
  const source = searchParams.get("source");
  if (source && allowed.has(source as (typeof FIRMS_SOURCES)[number])) return [source];

  const rawSources = searchParams.get("sources");
  const requested = rawSources
    ? rawSources
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [...FIRMS_SOURCES];

  const valid = requested.filter((s) => allowed.has(s as (typeof FIRMS_SOURCES)[number]));
  return valid.length > 0 ? Array.from(new Set(valid)) : [...FIRMS_SOURCES];
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const days = Math.min(Math.max(Number(searchParams.get("days")) || 1, 1), 30);
  const sources = parseSources(searchParams);
  const cacheTtlMs = getAdaptiveCacheTtlMs(days);

  const mapKey = process.env.FIRMS_MAP_KEY;
  if (!mapKey) {
    return NextResponse.json(
      { error: "FIRMS_MAP_KEY not configured. Get one at https://firms.modaps.eosdis.nasa.gov/api/map_key/" },
      { status: 500 }
    );
  }

  const cacheKey = `firms:${sources.slice().sort().join(",")}:${days}`;
  const cached = getCache<FirmsApiResponse>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const perSource = await Promise.all(
      sources.map(async (source) => {
        try {
          const hotspots = await fetchFirmsData(mapKey, source, FIRMS_BBOX, days);
          return { source, hotspots };
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to fetch source";
          return { source, hotspots: [], error: message };
        }
      })
    );

    const successfulSources = perSource.filter((s) => !s.error);
    if (successfulSources.length === 0) {
      const details = perSource.map((s) => `${s.source}: ${s.error ?? "unknown error"}`).join(" | ");
      throw new Error(`All FIRMS sources failed (${details})`);
    }

    const hotspots = dedupeHotspots(perSource.flatMap((s) => s.hotspots));
    const fetchedAt = new Date().toISOString();
    const response: FirmsApiResponse = {
      hotspots,
      fetchedAt,
      sources,
      sourceBreakdown: perSource.map((s) => ({
        source: s.source,
        count: s.hotspots.length,
        fetchedAt,
        latestAcquiredAt: getLatestAcquiredAt(s.hotspots),
        error: s.error,
      })),
      totalCount: hotspots.length,
      cacheTtlMs,
    };
    setCache(cacheKey, response, cacheTtlMs);
    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch fire data";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
