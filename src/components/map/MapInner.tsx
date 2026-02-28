"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, LayersControl, ScaleControl, useMap } from "react-leaflet";
import L from "leaflet";
import { NEW_TOWN_CENTER, DEFAULT_ZOOM, TILE_LAYERS, LABEL_OVERLAY } from "@/lib/constants";
import type { FireHotspot } from "@/types/firms";
import FireMarkers from "./FireMarkers";
import HeatmapLayer from "./HeatmapLayer";
import MapLegend from "./MapLegend";
import CoordinateDisplay from "./CoordinateDisplay";
import "leaflet/dist/leaflet.css";

interface MapInnerProps {
  hotspots: FireHotspot[];
  showHeatmap: boolean;
}

function AutoFocusHotspots({ hotspots }: { hotspots: FireHotspot[] }) {
  const map = useMap();

  useEffect(() => {
    if (hotspots.length === 0) return;

    const bounds = L.latLngBounds(
      hotspots.map((h) => [h.latitude, h.longitude] as [number, number])
    );
    if (!bounds.isValid()) return;

    if (hotspots.length === 1) {
      map.setView(bounds.getCenter(), 15, { animate: false });
      return;
    }

    map.fitBounds(bounds.pad(0.25), { maxZoom: 15, animate: false });
  }, [hotspots, map]);

  return null;
}

export default function MapInner({ hotspots, showHeatmap }: MapInnerProps) {
  return (
    <MapContainer
      center={NEW_TOWN_CENTER}
      zoom={DEFAULT_ZOOM}
      className="h-full w-full"
      zoomControl={true}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer name={TILE_LAYERS.satellite.name}>
          <TileLayer
            url={TILE_LAYERS.satellite.url}
            attribution={TILE_LAYERS.satellite.attribution}
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name={TILE_LAYERS.osm.name}>
          <TileLayer
            url={TILE_LAYERS.osm.url}
            attribution={TILE_LAYERS.osm.attribution}
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer checked name={TILE_LAYERS.dark.name}>
          <TileLayer
            url={TILE_LAYERS.dark.url}
            attribution={TILE_LAYERS.dark.attribution}
            maxZoom={19}
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* Label overlay — always visible on top of any base layer */}
      <TileLayer
        url={LABEL_OVERLAY.url}
        attribution={LABEL_OVERLAY.attribution}
        maxZoom={19}
        pane="overlayPane"
        zIndex={650}
        opacity={0.85}
      />

      <ScaleControl position="bottomleft" imperial={false} />
      <CoordinateDisplay />
      <AutoFocusHotspots hotspots={hotspots} />
      <FireMarkers hotspots={hotspots} />
      {showHeatmap && <HeatmapLayer hotspots={hotspots} />}
      <MapLegend />
    </MapContainer>
  );
}
