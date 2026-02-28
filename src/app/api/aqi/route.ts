import { NextRequest, NextResponse } from "next/server";
import { fetchAqiData } from "@/lib/waqi";
import { getCache, setCache } from "@/lib/cache";
import type { AqiApiResponse } from "@/types/aqi";

const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = Number(searchParams.get("lat")) || 22.5958;
  const lng = Number(searchParams.get("lng")) || 88.4838;

  const token = process.env.WAQI_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "WAQI_TOKEN not configured. Get one at https://aqicn.org/data-platform/token/" },
      { status: 500 }
    );
  }

  const cacheKey = `aqi:${lat}:${lng}`;
  const cached = getCache<AqiApiResponse>(cacheKey);
  if (cached) {
    return NextResponse.json(cached);
  }

  try {
    const readings = await fetchAqiData(token, lat, lng);
    const response: AqiApiResponse = {
      readings,
      fetchedAt: new Date().toISOString(),
    };
    setCache(cacheKey, response, CACHE_TTL);
    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch AQI data";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
