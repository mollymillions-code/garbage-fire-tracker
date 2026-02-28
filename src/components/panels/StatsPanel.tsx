"use client";

import { FIRMS_SOURCE_LABELS } from "@/lib/constants";
import { computeDailyCounts } from "@/lib/utils";
import type { FireHotspot, FireSourceSummary } from "@/types/firms";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";

interface StatsPanelProps {
  hotspots: FireHotspot[];
  loading: boolean;
  fetchedAt?: string;
  sourceBreakdown?: FireSourceSummary[];
}

function formatAge(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms) || ms < 0) return "now";
  const minutes = Math.floor(ms / (60 * 1000));
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

function sourceLabel(source: string): string {
  const labels = FIRMS_SOURCE_LABELS as Record<string, string>;
  return labels[source] ?? source;
}

export default function StatsPanel({
  hotspots,
  loading,
  fetchedAt,
  sourceBreakdown,
}: StatsPanelProps) {
  if (loading) {
    return (
      <div className="mc-panel mc-glow p-4 animate-pulse">
        <div className="mc-corners" />
        <div className="h-3 bg-slate-700/50 rounded w-24 mb-4" />
        <div className="h-10 bg-slate-700/50 rounded mb-2" />
        <div className="h-6 bg-slate-700/50 rounded" />
      </div>
    );
  }

  const total = hotspots.length;
  const highConf = hotspots.filter((h) => h.confidence === "high").length;
  const nominalConf = hotspots.filter((h) => h.confidence === "nominal").length;
  const lowConf = hotspots.filter((h) => h.confidence === "low").length;
  const dayCount = hotspots.filter((h) => h.daynight === "D").length;
  const nightCount = hotspots.filter((h) => h.daynight === "N").length;
  const avgFrp = total > 0 ? hotspots.reduce((s, h) => s + h.frp, 0) / total : 0;
  const dailyCounts = computeDailyCounts(hotspots);

  return (
    <div className="mc-panel mc-glow p-4 space-y-3">
      <div className="mc-corners" />

      <div className="font-mono text-[9px] font-semibold tracking-[0.2em] uppercase text-slate-500">
        FIRE STATISTICS
      </div>

      <div className="text-center py-1">
        <div
          className="font-mono text-5xl font-black tabular-nums leading-none text-cyan-400"
          style={{ textShadow: "0 0 25px rgba(6, 182, 212, 0.3)" }}
        >
          {total}
        </div>
        <div className="font-mono text-[10px] text-slate-500 mt-1 uppercase tracking-wider">
          {total === 0 ? "No detections" : total === 1 ? "Detection" : "Detections"}
        </div>
      </div>

      {total > 0 && (
        <>
          <div className="space-y-1.5">
            <ConfidenceRow label="HIGH" count={highConf} total={total} color="#ef4444" />
            <ConfidenceRow label="NOMINAL" count={nominalConf} total={total} color="#f97316" />
            <ConfidenceRow label="LOW" count={lowConf} total={total} color="#eab308" />
          </div>

          <div className="border-t border-cyan-500/10 pt-2.5 grid grid-cols-2 gap-y-1.5 gap-x-4">
            <StatRow label="DAY / NIGHT" value={`${dayCount} / ${nightCount}`} />
            <StatRow label="AVG FRP" value={`${avgFrp.toFixed(1)} MW`} />
          </div>

          {dailyCounts.length > 1 && (
            <div className="border-t border-cyan-500/10 pt-2.5">
              <div className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500 mb-1.5">
                TIMELINE
              </div>
              <div className="h-14">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyCounts}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 8, fill: "#475569", fontFamily: "var(--font-mono)" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(2,6,23,0.95)",
                        border: "1px solid rgba(6,182,212,0.2)",
                        borderRadius: 4,
                        fontSize: 11,
                        fontFamily: "var(--font-mono)",
                      }}
                      labelStyle={{ color: "#06b6d4" }}
                      itemStyle={{ color: "#e2e8f0" }}
                    />
                    <Bar dataKey="count" fill="#06b6d4" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </>
      )}

      {sourceBreakdown && sourceBreakdown.length > 0 && (
        <div className="border-t border-cyan-500/10 pt-2.5 space-y-1">
          <div className="font-mono text-[9px] font-semibold tracking-[0.15em] uppercase text-slate-500 mb-1">
            SATELLITE SOURCES
          </div>
          {sourceBreakdown.map((src) => {
            const age = src.latestAcquiredAt ? formatAge(src.latestAcquiredAt) : "--";
            const dotCls = src.error
              ? "mc-dot--err"
              : src.latestAcquiredAt
                ? "mc-dot--live"
                : "mc-dot--off";
            return (
              <div key={src.source} className="flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 font-mono text-slate-400">
                  <span className={`mc-dot ${dotCls}`} />
                  {sourceLabel(src.source)}
                </span>
                <span className="font-mono text-slate-500 tabular-nums">
                  {src.count} &middot; {src.error ? "ERR" : age}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {fetchedAt && (
        <div className="font-mono text-[9px] text-slate-600 pt-1 border-t border-cyan-500/10 tabular-nums">
          SYNC:{" "}
          {new Date(fetchedAt).toLocaleTimeString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}{" "}
          IST
        </div>
      )}
    </div>
  );
}

function ConfidenceRow({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
      <span className="font-mono text-slate-400 w-16 shrink-0">{label}</span>
      <div className="flex-1 h-1 bg-slate-800/60 rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-all duration-500"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-slate-300 tabular-nums w-5 text-right">{count}</span>
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] text-slate-500 uppercase tracking-wider">{label}</div>
      <div className="font-mono text-xs text-slate-300 tabular-nums">{value}</div>
    </div>
  );
}
