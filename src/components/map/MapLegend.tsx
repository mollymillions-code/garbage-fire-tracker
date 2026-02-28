"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import { CONFIDENCE_COLORS } from "@/lib/constants";

export default function MapLegend() {
  const map = useMap();

  useEffect(() => {
    const legend = new L.Control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "");
      div.style.cssText = `
        background: rgba(2, 6, 23, 0.85);
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid rgba(6, 182, 212, 0.2);
        color: #e2e8f0;
        font-family: var(--font-mono), ui-monospace, monospace;
        font-size: 10px;
        line-height: 1.8;
      `;
      div.innerHTML = `
        <div style="font-size:9px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#64748b;margin-bottom:3px;">CONFIDENCE</div>
        <div style="display:flex;align-items:center;gap:5px;">
          <span style="width:8px;height:8px;background:${CONFIDENCE_COLORS.high};border-radius:50%;display:inline-block;box-shadow:0 0 4px ${CONFIDENCE_COLORS.high};"></span>
          <span style="color:#94a3b8;">High</span>
        </div>
        <div style="display:flex;align-items:center;gap:5px;">
          <span style="width:7px;height:7px;background:${CONFIDENCE_COLORS.nominal};border-radius:50%;display:inline-block;box-shadow:0 0 4px ${CONFIDENCE_COLORS.nominal};"></span>
          <span style="color:#94a3b8;">Nominal</span>
        </div>
        <div style="display:flex;align-items:center;gap:5px;">
          <span style="width:6px;height:6px;background:${CONFIDENCE_COLORS.low};border-radius:50%;display:inline-block;box-shadow:0 0 4px ${CONFIDENCE_COLORS.low};"></span>
          <span style="color:#94a3b8;">Low</span>
        </div>
      `;
      return div;
    };

    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}
