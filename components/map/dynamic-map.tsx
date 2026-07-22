"use client";

import dynamic from "next/dynamic";
import type { MapMarker } from "./map-view";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Leaflet greift auf `window` zu → nur clientseitig laden (ssr:false).
 */
const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-2xl" />,
});

export function DynamicMap(props: {
  center: [number, number];
  radiusKm: number;
  markers: MapMarker[];
}) {
  return (
    <div className="h-[420px] w-full overflow-hidden rounded-2xl border border-border">
      <MapView {...props} />
    </div>
  );
}

export type { MapMarker };
