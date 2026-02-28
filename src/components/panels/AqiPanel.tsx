"use client";

import type { AqiReading } from "@/types/aqi";
import { getAqiCategory } from "@/lib/utils";

interface AqiPanelProps {
  readings: AqiReading[];
  loading: boolean;
  error?: string;
}

export default function AqiPanel({ readings, loading, error }: AqiPanelProps) {
  if (loading) {
    return (
      <div className="mc-panel mc-glow p-4 animate-pulse">
        <div className="mc-corners" />
        <div className="h-3 bg-slate-700/50 rounded w-20 mb-4" />
        <div className="h-12 bg-slate-700/50 rounded w-24 mb-2" />
        <div className="h-3 bg-slate-700/50 rounded w-32" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mc-panel mc-glow p-4">
        <div className="mc-corners" />
        <div className="font-mono text-[9px] font-semibold tracking-[0.2em] uppercase text-slate-500 mb-2">
          AIR QUALITY
        </div>
        <p className="font-mono text-xs text-red-400">{error}</p>
      </div>
    );
  }

  const primary = readings[0];
  if (!primary) return null;

  const cat = getAqiCategory(primary.aqi);

  return (
    <div className="mc-panel mc-glow p-4 space-y-3">
      <div className="mc-corners" />

      {/* Section label */}
      <div className="font-mono text-[9px] font-semibold tracking-[0.2em] uppercase text-slate-500">
        AIR QUALITY INDEX
      </div>

      {/* Primary readout */}
      <div className="flex items-center gap-3">
        <div
          className="font-mono text-5xl font-black tabular-nums leading-none"
          style={{ color: cat.color, textShadow: `0 0 25px ${cat.color}35` }}
        >
          {primary.aqi}
        </div>
        <div>
          <div
            className="font-mono text-xs font-bold uppercase tracking-wider"
            style={{ color: cat.color }}
          >
            {cat.label}
          </div>
          <div className="font-mono text-[10px] text-slate-500 mt-0.5">{primary.station}</div>
        </div>
      </div>

      {/* Pollutant bars */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {primary.pollutants.pm25 != null && (
          <PollutantBar label="PM2.5" value={primary.pollutants.pm25} max={500} unit="ug/m3" />
        )}
        {primary.pollutants.pm10 != null && (
          <PollutantBar label="PM10" value={primary.pollutants.pm10} max={600} unit="ug/m3" />
        )}
        {primary.pollutants.no2 != null && (
          <PollutantBar label="NO2" value={primary.pollutants.no2} max={200} unit="ppb" />
        )}
        {primary.pollutants.so2 != null && (
          <PollutantBar label="SO2" value={primary.pollutants.so2} max={200} unit="ppb" />
        )}
      </div>

      {/* Nearby stations */}
      {readings.length > 1 && (
        <div className="border-t border-cyan-500/10 pt-2.5">
          <div className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500 mb-1.5">
            NEARBY STATIONS
          </div>
          <div className="space-y-1">
            {readings.slice(1).map((r, i) => {
              const c = getAqiCategory(r.aqi);
              return (
                <div key={i} className="flex items-center justify-between text-[11px]">
                  <span className="font-mono text-slate-400 truncate mr-2">{r.station}</span>
                  <span
                    className="font-mono font-bold tabular-nums shrink-0"
                    style={{ color: c.color }}
                  >
                    {r.aqi}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function PollutantBar({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
}) {
  const pct = Math.min((value / max) * 100, 100);
  const barColor = pct > 70 ? "#ef4444" : pct > 40 ? "#f97316" : "#06b6d4";

  return (
    <div>
      <div className="flex justify-between text-[10px] mb-0.5">
        <span className="font-mono text-slate-500">{label}</span>
        <span className="font-mono text-slate-300 tabular-nums">
          {value} {unit}
        </span>
      </div>
      <div className="h-1 bg-slate-800/60 rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </div>
    </div>
  );
}
