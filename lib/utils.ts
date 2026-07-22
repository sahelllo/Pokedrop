import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** shadcn-style className-Merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEuro(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

/** "vor 2 Min." / "vor 3 Std." / "vor 2 Tagen" */
export function relativeTime(minutesAgo: number): string {
  if (minutesAgo < 1) return "gerade eben";
  if (minutesAgo < 60) return `vor ${Math.round(minutesAgo)} Min.`;
  const hours = minutesAgo / 60;
  if (hours < 24) return `vor ${Math.round(hours)} Std.`;
  const days = hours / 24;
  return `vor ${Math.round(days)} ${Math.round(days) === 1 ? "Tag" : "Tagen"}`;
}

export function formatDateDE(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
  });
}

/** Klammert eine Zahl in ein Intervall. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
