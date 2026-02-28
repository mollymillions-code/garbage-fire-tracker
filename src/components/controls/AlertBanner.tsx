"use client";

interface AlertBannerProps {
  count: number;
}

export default function AlertBanner({ count }: AlertBannerProps) {
  return (
    <div className="h-7 bg-red-950/40 border-b border-red-500/25 flex items-center justify-center gap-2 px-4 shrink-0">
      <span className="mc-dot mc-dot--err" />
      <span className="font-mono text-[11px] font-semibold text-red-400 tracking-wider animate-pulse">
        ALERT: {count} HIGH CONFIDENCE FIRE DETECTION{count > 1 ? "S" : ""} ACTIVE
      </span>
    </div>
  );
}
