"use client";

import { useEffect, useRef, useState } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function CoordinateDisplay() {
  const map = useMap();
  const controlRef = useRef<L.Control | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const control = new L.Control({ position: "bottomleft" });

    control.onAdd = () => {
      const div = L.DomUtil.create("div", "");
      div.style.cssText = `
        font-family: var(--font-mono), ui-monospace, monospace;
        font-size: 10px;
        color: #06b6d4;
        background: rgba(2, 6, 23, 0.8);
        backdrop-filter: blur(6px);
        padding: 3px 10px;
        border: 1px solid rgba(6, 182, 212, 0.2);
        border-radius: 3px;
        letter-spacing: 0.04em;
        pointer-events: none;
        white-space: nowrap;
      `;
      div.textContent = "LAT --.- | LNG --.-";
      divRef.current = div;
      return div;
    };

    control.addTo(map);
    controlRef.current = control;
    setReady(true);

    return () => {
      control.remove();
    };
  }, [map]);

  useEffect(() => {
    if (!ready) return;

    const onMove = (e: L.LeafletMouseEvent) => {
      if (divRef.current) {
        divRef.current.textContent = `LAT ${e.latlng.lat.toFixed(4)} | LNG ${e.latlng.lng.toFixed(4)}`;
      }
    };

    const onOut = () => {
      if (divRef.current) {
        divRef.current.textContent = "LAT --.- | LNG --.-";
      }
    };

    map.on("mousemove", onMove);
    map.on("mouseout", onOut);

    return () => {
      map.off("mousemove", onMove);
      map.off("mouseout", onOut);
    };
  }, [map, ready]);

  return null;
}
