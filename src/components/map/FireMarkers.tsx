"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { FireHotspot } from "@/types/firms";
import { formatFireTime, getConfidenceColor } from "@/lib/utils";

function createFireIcon(confidence: "low" | "nominal" | "high") {
  const color = getConfidenceColor(confidence);
  const coreSize = confidence === "high" ? 20 : confidence === "nominal" ? 16 : 14;
  const ringSize = coreSize + 24;
  const totalSize = ringSize + 4;

  return L.divIcon({
    className: "",
    html: `<div style="
      position: relative;
      width: ${totalSize}px;
      height: ${totalSize}px;
    ">
      <div class="fire-ring" style="
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: ${ringSize}px;
        height: ${ringSize}px;
        border: 3px solid ${color};
        border-radius: 50%;
        opacity: 0.5;
      "></div>
      <div class="fire-core" style="
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: ${coreSize}px;
        height: ${coreSize}px;
        background: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 12px 4px ${color}, 0 0 24px 8px ${color}80;
      "></div>
    </div>`,
    iconSize: [totalSize, totalSize],
    iconAnchor: [totalSize / 2, totalSize / 2],
  });
}

interface FireMarkersProps {
  hotspots: FireHotspot[];
}

export default function FireMarkers({ hotspots }: FireMarkersProps) {
  return (
    <>
      {hotspots.map((h, i) => (
        <Marker
          key={`${h.latitude}-${h.longitude}-${h.acq_date}-${h.acq_time}-${i}`}
          position={[h.latitude, h.longitude]}
          icon={createFireIcon(h.confidence)}
        >
          <Popup>
            <div className="space-y-1.5 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="mc-dot mc-dot--err" />
                <span
                  className="font-mono font-bold text-[11px] tracking-wider uppercase"
                  style={{ color: getConfidenceColor(h.confidence) }}
                >
                  FIRE DETECTION
                </span>
              </div>
              <div className="grid grid-cols-[70px_1fr] gap-y-1 text-[11px]">
                <span className="font-mono text-slate-500 uppercase">TIME</span>
                <span className="font-mono text-slate-200">
                  {formatFireTime(h.acq_date, h.acq_time)}
                </span>

                <span className="font-mono text-slate-500 uppercase">CONF</span>
                <span
                  className="font-mono font-medium"
                  style={{ color: getConfidenceColor(h.confidence) }}
                >
                  {h.confidence.toUpperCase()}
                </span>

                <span className="font-mono text-slate-500 uppercase">TEMP</span>
                <span className="font-mono text-slate-200">{h.bright_ti4.toFixed(1)} K</span>

                <span className="font-mono text-slate-500 uppercase">FRP</span>
                <span className="font-mono text-cyan-400">{h.frp.toFixed(1)} MW</span>

                <span className="font-mono text-slate-500 uppercase">SAT</span>
                <span className="font-mono text-slate-200">{h.satellite}</span>

                <span className="font-mono text-slate-500 uppercase">PASS</span>
                <span className="font-mono text-slate-200">
                  {h.daynight === "D" ? "DAY" : "NIGHT"}
                </span>

                <span className="font-mono text-slate-500 uppercase">COORDS</span>
                <span className="font-mono text-cyan-400/70 text-[10px]">
                  {h.latitude.toFixed(4)}, {h.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
