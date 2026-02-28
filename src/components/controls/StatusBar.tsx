"use client";

import type { FireSourceSummary } from "@/types/firms";

interface StatusBarProps {
  fireLoading: boolean;
  fireError: boolean;
  aqiLoading: boolean;
  aqiError: boolean;
  hotspotCount: number;
  fetchedAt?: string;
  onRefresh: () => void;
  sourceBreakdown?: FireSourceSummary[];
}

function StatusDot({ status }: { status: "live" | "warn" | "err" }) {
  const cls = status === "live" ? "mc-dot--live" : status === "warn" ? "mc-dot--warn" : "mc-dot--err";
  return <span className={`mc-dot ${cls}`} />;
}

function Divider() {
  return <div className="h-6 w-px bg-cyan-500/15 shrink-0" />;
}

export default function StatusBar({
  fireLoading,
  fireError,
  aqiLoading,
  aqiError,
  hotspotCount,
  fetchedAt,
  onRefresh,
  sourceBreakdown,
}: StatusBarProps) {
  const firmsStatus = fireError ? "err" : fireLoading ? "warn" : "live";
  const waqiStatus = aqiError ? "err" : aqiLoading ? "warn" : "live";
  const statusLabel = (s: "live" | "warn" | "err") =>
    s === "live" ? "ONLINE" : s === "warn" ? "SYNC" : "ERROR";

  const activeSources = sourceBreakdown?.filter((s) => !s.error).length ?? 0;
  const totalSources = sourceBreakdown?.length ?? 4;

  const syncTime = fetchedAt
    ? new Date(fetchedAt).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "--:--:--";

  return (
    <header className="h-12 bg-[#020617] border-b border-cyan-500/15 px-4 flex items-center gap-5 shrink-0 overflow-x-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-base">🔥</span>
        <span className="font-mono font-bold text-sm text-cyan-400 tracking-wider">
          GFT COMMAND
        </span>
      </div>

      <Divider />

      {/* Detections */}
      <div className="shrink-0">
        <div className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500">
          DETECTIONS
        </div>
        <div className="font-mono text-sm font-bold text-cyan-400 tabular-nums">
          {hotspotCount}
        </div>
      </div>

      <Divider />

      {/* FIRMS status */}
      <div className="shrink-0">
        <div className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500">
          FIRMS
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot status={firmsStatus} />
          <span className="font-mono text-xs text-slate-300">{statusLabel(firmsStatus)}</span>
        </div>
      </div>

      {/* WAQI status */}
      <div className="shrink-0">
        <div className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500">
          WAQI
        </div>
        <div className="flex items-center gap-1.5">
          <StatusDot status={waqiStatus} />
          <span className="font-mono text-xs text-slate-300">{statusLabel(waqiStatus)}</span>
        </div>
      </div>

      <Divider />

      {/* Sources */}
      <div className="shrink-0">
        <div className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500">
          SOURCES
        </div>
        <div className="font-mono text-xs text-cyan-400 tabular-nums">
          {activeSources}/{totalSources}
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1 min-w-4" />

      {/* Last sync */}
      <div className="shrink-0 text-right">
        <div className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500">
          LAST SYNC
        </div>
        <div className="font-mono text-xs text-cyan-400 tabular-nums">{syncTime} IST</div>
      </div>

      <Divider />

      {/* Zone */}
      <div className="shrink-0 text-right">
        <div className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500">
          ZONE
        </div>
        <div className="font-mono text-xs text-slate-300">NEW TOWN, KOL</div>
      </div>

      <Divider />

      {/* Refresh */}
      <button
        onClick={onRefresh}
        className="shrink-0 px-2.5 py-1.5 rounded font-mono text-xs text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/10 hover:border-cyan-500/40 transition-all"
        title="Refresh all data"
      >
        ↻ SYNC
      </button>
    </header>
  );
}
