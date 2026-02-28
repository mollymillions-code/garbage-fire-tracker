"use client";

import useSWR from "swr";
import type { FirmsApiResponse, TimeRange } from "@/types/firms";
import { timeRangeToDays } from "@/lib/utils";
import { FIRMS_SOURCES } from "@/lib/constants";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

function getAdaptiveRefreshInterval(days: number): number {
  if (days <= 1) return 2 * 60 * 1000;
  if (days <= 2) return 3 * 60 * 1000;
  if (days <= 7) return 4 * 60 * 1000;
  return 5 * 60 * 1000;
}

export function useFireData(timeRange: TimeRange) {
  const days = timeRangeToDays(timeRange);
  const sources = FIRMS_SOURCES.join(",");
  const { data, error, isLoading, mutate } = useSWR<FirmsApiResponse>(
    `/api/firms?days=${days}&sources=${sources}`,
    fetcher,
    {
      refreshInterval: (latestData) => latestData?.cacheTtlMs ?? getAdaptiveRefreshInterval(days),
      revalidateOnFocus: false,
      dedupingInterval: 60 * 1000,
    }
  );
  return { fireData: data, fireError: error, fireLoading: isLoading, refreshFire: mutate };
}
