"use client";

import dynamic from "next/dynamic";
import type { FireHotspot } from "@/types/firms";

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse rounded-xl bg-gray-800 flex items-center justify-center">
      <span className="text-gray-400 text-sm">Loading map...</span>
    </div>
  ),
});

interface MapViewProps {
  hotspots: FireHotspot[];
  showHeatmap: boolean;
}

export default function MapView({ hotspots, showHeatmap }: MapViewProps) {
  return <MapInner hotspots={hotspots} showHeatmap={showHeatmap} />;
}
