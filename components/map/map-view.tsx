"use client";

import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  color?: string;
  emoji?: string;
}

function pinIcon(color = "#3aa0ff", emoji = "📍") {
  return L.divIcon({
    className: "pokedrop-pin",
    html: `<div style="
      transform: translate(-50%,-100%);
      display:flex;align-items:center;justify-content:center;
      width:30px;height:30px;border-radius:50% 50% 50% 0;
      background:${color};rotate:45deg;
      box-shadow:0 4px 10px rgba(0,0,0,.4);border:2px solid rgba(255,255,255,.85);">
      <span style="rotate:-45deg;font-size:14px;line-height:1">${emoji}</span>
    </div>`,
    iconSize: [30, 30],
    iconAnchor: [0, 0],
  });
}

function userIcon() {
  return L.divIcon({
    className: "pokedrop-user",
    html: `<div style="transform:translate(-50%,-50%);width:18px;height:18px;border-radius:50%;
      background:#31d158;box-shadow:0 0 0 6px rgba(49,209,88,.25);border:2px solid #fff"></div>`,
    iconSize: [18, 18],
    iconAnchor: [0, 0],
  });
}

/** Passt die Kartenmitte/-zoom an Nutzer + Radius an. */
function Recenter({ center, radiusKm }: { center: [number, number]; radiusKm: number }) {
  const map = useMap();
  React.useEffect(() => {
    const zoom = radiusKm > 350 ? 6 : radiusKm > 150 ? 7 : radiusKm > 60 ? 8 : radiusKm > 25 ? 9 : 10;
    map.setView(center, zoom, { animate: true });
  }, [center, radiusKm, map]);
  return null;
}

export default function MapView({
  center,
  radiusKm,
  markers,
}: {
  center: [number, number];
  radiusKm: number;
  markers: MapMarker[];
}) {
  return (
    <MapContainer
      center={center}
      zoom={8}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Recenter center={center} radiusKm={radiusKm} />
      <Circle
        center={center}
        radius={radiusKm * 1000}
        pathOptions={{ color: "#3aa0ff", fillColor: "#3aa0ff", fillOpacity: 0.06, weight: 1 }}
      />
      <Marker position={center} icon={userIcon()}>
        <Popup>Dein Standort</Popup>
      </Marker>
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={pinIcon(m.color, m.emoji)}>
          <Popup>
            <div className="min-w-[140px]">
              <p className="font-semibold">{m.title}</p>
              {m.subtitle && <p className="text-xs opacity-70">{m.subtitle}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
