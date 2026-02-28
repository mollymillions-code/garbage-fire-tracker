"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";
import type { FireHotspot } from "@/types/firms";

interface HeatmapLayerProps {
  hotspots: FireHotspot[];
}

export default function HeatmapLayer({ hotspots }: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    if (hotspots.length === 0) return;

    const points = hotspots.map(
      (h) => [h.latitude, h.longitude, h.frp || 1] as [number, number, number]
    );

    // Adaptive radius: sparse data needs a much larger radius to be visible
    const radius = hotspots.length <= 3 ? 50 : hotspots.length <= 10 ? 35 : 25;
    const blur = hotspots.length <= 3 ? 30 : hotspots.length <= 10 ? 20 : 15;

    const heat = L.heatLayer(points, {
      radius,
      blur,
      maxZoom: 17,
      minOpacity: 0.4,
      max: Math.max(...hotspots.map((h) => h.frp || 1), 1),
      gradient: {
        0.2: "#fef08a",
        0.4: "#fbbf24",
        0.6: "#f97316",
        0.8: "#ef4444",
        1.0: "#7f1d1d",
      },
    });

    heat.addTo(map);
    return () => {
      map.removeLayer(heat);
    };
  }, [hotspots, map]);

  return null;
}
