"use client";

import type { TimeRange } from "@/types/firms";

interface BottomBarProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  showHeatmap: boolean;
  onHeatmapToggle: (show: boolean) => void;
  fireLoading: boolean;
}

const TIME_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "24h", label: "24H" },
  { value: "48h", label: "48H" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
];

export default function BottomBar({
  timeRange,
  onTimeRangeChange,
  showHeatmap,
  onHeatmapToggle,
  fireLoading,
}: BottomBarProps) {
  return (
    <div className="h-11 bg-[#020617] border-t border-cyan-500/15 px-4 flex items-center gap-4 shrink-0">
      {/* Time range section */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500 mr-1.5">
          TIME
        </span>
        {TIME_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onTimeRangeChange(value)}
            className={`px-2.5 py-1 rounded font-mono text-xs transition-all ${
              timeRange === value
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                : "text-slate-500 border border-transparent hover:text-slate-300 hover:border-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Divider */}
      <div className="h-5 w-px bg-cyan-500/15" />

      {/* Layer toggle section */}
      <div className="flex items-center gap-1.5">
        <span className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500 mr-1.5">
          LAYER
        </span>
        <button
          onClick={() => onHeatmapToggle(false)}
          className={`px-2.5 py-1 rounded font-mono text-xs transition-all ${
            !showHeatmap
              ? "bg-orange-500/15 text-orange-400 border border-orange-500/30"
              : "text-slate-500 border border-transparent hover:text-slate-300 hover:border-slate-700"
          }`}
        >
          MARKERS
        </button>
        <button
          onClick={() => onHeatmapToggle(true)}
          className={`px-2.5 py-1 rounded font-mono text-xs transition-all ${
            showHeatmap
              ? "bg-red-500/15 text-red-400 border border-red-500/30"
              : "text-slate-500 border border-transparent hover:text-slate-300 hover:border-slate-700"
          }`}
        >
          HEATMAP
        </button>
      </div>

      {/* Loading indicator */}
      {fireLoading && (
        <>
          <div className="h-5 w-px bg-cyan-500/15" />
          <div className="flex items-center gap-1.5">
            <span className="mc-dot mc-dot--warn" />
            <span className="font-mono text-[10px] text-amber-400 animate-pulse">LOADING</span>
          </div>
        </>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Data credits */}
      <span className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-600">
        DATA: NASA FIRMS &middot; WAQI
      </span>
    </div>
  );
}
