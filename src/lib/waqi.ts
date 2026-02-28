import type { AqiReading } from "@/types/aqi";

const WAQI_BASE = "https://api.waqi.info";

function parseStationData(d: Record<string, unknown>, lat: number, lng: number): AqiReading {
  const iaqi = (d.iaqi || {}) as Record<string, { v?: number }>;
  const city = d.city as { name?: string; geo?: number[] } | undefined;
  const time = d.time as { iso?: string } | undefined;

  return {
    aqi: Number(d.aqi),
    station: city?.name || "Unknown",
    time: time?.iso || new Date().toISOString(),
    coordinates: [city?.geo?.[0] || lat, city?.geo?.[1] || lng],
    pollutants: {
      pm25: iaqi.pm25?.v,
      pm10: iaqi.pm10?.v,
      no2: iaqi.no2?.v,
      co: iaqi.co?.v,
      so2: iaqi.so2?.v,
      o3: iaqi.o3?.v,
    },
    dominantPollutant: String(d.dominentpol || "pm25"),
  };
}

export async function fetchAqiData(
  token: string,
  lat: number,
  lng: number
): Promise<AqiReading[]> {
  // Try city-based endpoint first (more reliable), then fall back to geo
  let primaryData: Record<string, unknown> | null = null;

  for (const endpoint of [
    `${WAQI_BASE}/feed/kolkata/?token=${token}`,
    `${WAQI_BASE}/feed/geo:${lat};${lng}/?token=${token}`,
  ]) {
    const res = await fetch(endpoint);
    if (!res.ok) continue;
    const json = await res.json();
    if (json.status === "ok" && json.data) {
      primaryData = json.data;
      break;
    }
  }

  if (!primaryData) throw new Error("Could not fetch AQI data from any endpoint");

  const readings: AqiReading[] = [parseStationData(primaryData, lat, lng)];

  // Also try to get nearby stations
  try {
    const searchUrl = `${WAQI_BASE}/search/?keyword=kolkata&token=${token}`;
    const searchRes = await fetch(searchUrl);
    const searchJson = await searchRes.json();
    if (searchJson.status === "ok" && searchJson.data) {
      for (const station of searchJson.data.slice(0, 4)) {
        if (station.aqi && station.aqi !== "-") {
          readings.push({
            aqi: Number(station.aqi),
            station: station.station?.name || "Unknown",
            time: station.time?.stime || new Date().toISOString(),
            coordinates: [station.station?.geo?.[0] || 0, station.station?.geo?.[1] || 0],
            pollutants: {},
            dominantPollutant: "pm25",
          });
        }
      }
    }
  } catch {
    // Search is optional
  }

  return readings;
}
