'use client';

import { useEffect, useRef } from 'react';

const PIN_SVG = `
  <div style="width:28px;height:36px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.3))">
    <svg viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 8.75 14 22 14 22s14-13.25 14-22C28 6.268 21.732 0 14 0z" fill="hsl(221,83%,53%)"/>
      <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>
  </div>
`;

interface TrackingMapProps {
  lat: number;
  lng: number;
  label?: string | null;
}

export function TrackingMap({ lat, lng, label }: TrackingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let mounted = true;

    (async () => {
      const { default: L } = await import('leaflet');

      if (!mounted || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 5,
        zoomControl: true,
        scrollWheelZoom: false,
        attributionControl: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const icon = L.divIcon({
        html: PIN_SVG,
        className: '',
        iconSize: [28, 36],
        iconAnchor: [14, 36],
        popupAnchor: [0, -38],
      });

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      if (label) {
        marker.bindPopup(
          `<span style="font-family:sans-serif;font-size:12px;font-weight:600;color:#1e293b">${label}</span>`,
          { closeButton: false }
        ).openPopup();
      }

      mapRef.current = map;
    })();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={containerRef} className="h-[300px] w-full" />;
}
