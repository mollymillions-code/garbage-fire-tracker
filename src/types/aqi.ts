export interface AqiReading {
  aqi: number;
  station: string;
  time: string;
  coordinates: [number, number];
  pollutants: {
    pm25?: number;
    pm10?: number;
    no2?: number;
    co?: number;
    so2?: number;
    o3?: number;
  };
  dominantPollutant: string;
}

export type AqiCategory =
  | "Good"
  | "Moderate"
  | "Unhealthy for Sensitive Groups"
  | "Unhealthy"
  | "Very Unhealthy"
  | "Hazardous";

export interface AqiApiResponse {
  readings: AqiReading[];
  fetchedAt: string;
}
