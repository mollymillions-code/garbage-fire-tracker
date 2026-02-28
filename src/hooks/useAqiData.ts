"use client";

import useSWR from "swr";
import type { AqiApiResponse } from "@/types/aqi";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function useAqiData() {
  const { data, error, isLoading } = useSWR<AqiApiResponse>(
    `/api/aqi?lat=22.5958&lng=88.4838`,
    fetcher,
    {
      refreshInterval: 10 * 60 * 1000,
      revalidateOnFocus: false,
    }
  );
  return { aqiData: data, aqiError: error, aqiLoading: isLoading };
}
