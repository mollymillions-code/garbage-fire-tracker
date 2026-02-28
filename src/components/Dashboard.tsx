"use client";

import { useState } from "react";
import { useFireData } from "@/hooks/useFireData";
import { useAqiData } from "@/hooks/useAqiData";
import { useTimeRange } from "@/hooks/useTimeRange";
import MapView from "./map/MapView";
import AqiPanel from "./panels/AqiPanel";
import StatsPanel from "./panels/StatsPanel";
import StatusBar from "./controls/StatusBar";
import BottomBar from "./controls/BottomBar";
import AlertBanner from "./controls/AlertBanner";

export default function Dashboard() {
  const { timeRange, setTimeRange } = useTimeRange("24h");
  const { fireData, fireError, fireLoading, refreshFire } = useFireData(timeRange);
  const { aqiData, aqiError, aqiLoading } = useAqiData();
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [panelsVisible, setPanelsVisible] = useState(true);

  const hotspots = fireData?.hotspots ?? [];
  const highConfCount = hotspots.filter((h) => h.confidence === "high").length;
  const showAlert = highConfCount > 0;

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#020617] mc-scanlines flex flex-col">
      {/* Top Status Bar */}
      <StatusBar
        fireLoading={fireLoading}
        fireError={!!fireError}
        aqiLoading={aqiLoading}
        aqiError={!!aqiError}
        hotspotCount={hotspots.length}
        fetchedAt={fireData?.fetchedAt}
        onRefresh={() => refreshFire()}
        sourceBreakdown={fireData?.sourceBreakdown}
      />

      {/* Alert Banner */}
      {showAlert && <AlertBanner count={highConfCount} />}

      {/* Map — fills remaining space */}
      <div className="flex-1 relative min-h-0">
        <MapView hotspots={hotspots} showHeatmap={showHeatmap} />

        {/* Floating panels */}
        {panelsVisible && (
          <>
            {/* Left: AQI */}
            <div className="absolute top-3 left-3 w-[280px] z-[1000] max-h-[calc(100%-70px)] overflow-y-auto">
              <AqiPanel
                readings={aqiData?.readings ?? []}
                loading={aqiLoading}
                error={aqiError ? "Failed to load AQI data" : undefined}
              />
            </div>

            {/* Right: Stats */}
            <div className="absolute top-3 right-3 w-[280px] z-[1000] max-h-[calc(100%-70px)] overflow-y-auto">
              <StatsPanel
                hotspots={hotspots}
                loading={fireLoading}
                fetchedAt={fireData?.fetchedAt}
                sourceBreakdown={fireData?.sourceBreakdown}
              />
            </div>
          </>
        )}

        {/* Panel toggle */}
        <button
          onClick={() => setPanelsVisible(!panelsVisible)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-[1000]
                     px-3 py-1 rounded font-mono text-[10px] tracking-wider
                     bg-black/60 backdrop-blur-sm border border-cyan-500/20
                     text-cyan-400/70 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
        >
          {panelsVisible ? "[ HIDE PANELS ]" : "[ SHOW PANELS ]"}
        </button>
      </div>

      {/* Bottom Bar */}
      <BottomBar
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        showHeatmap={showHeatmap}
        onHeatmapToggle={setShowHeatmap}
        fireLoading={fireLoading}
      />
    </div>
  );
}
