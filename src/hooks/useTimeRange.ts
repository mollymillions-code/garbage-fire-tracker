"use client";

import { useState } from "react";
import type { TimeRange } from "@/types/firms";

export function useTimeRange(initial: TimeRange = "24h") {
  const [timeRange, setTimeRange] = useState<TimeRange>(initial);
  return { timeRange, setTimeRange };
}
