import type { EnergyType } from "@/types";

/**
 * Energie-Typ-Farbwelt als Akzentsystem (Design-Vorgabe Abschnitt 4).
 * Farben orientieren sich an den offiziellen Pokémon-TCG-Energietypen.
 */
export const ENERGY: Record<
  EnergyType,
  { label: string; color: string; soft: string; glow: string; emoji: string }
> = {
  fire: { label: "Feuer", color: "#ff6b35", soft: "rgba(255,107,53,0.14)", glow: "rgba(255,107,53,0.5)", emoji: "🔥" },
  water: { label: "Wasser", color: "#3aa0ff", soft: "rgba(58,160,255,0.14)", glow: "rgba(58,160,255,0.5)", emoji: "💧" },
  grass: { label: "Pflanze", color: "#4bd47a", soft: "rgba(75,212,122,0.14)", glow: "rgba(75,212,122,0.5)", emoji: "🌿" },
  lightning: { label: "Elektro", color: "#ffcb05", soft: "rgba(255,203,5,0.16)", glow: "rgba(255,203,5,0.5)", emoji: "⚡" },
  psychic: { label: "Psycho", color: "#b06bff", soft: "rgba(176,107,255,0.14)", glow: "rgba(176,107,255,0.5)", emoji: "🔮" },
  fighting: { label: "Kampf", color: "#e0603a", soft: "rgba(224,96,58,0.14)", glow: "rgba(224,96,58,0.5)", emoji: "🥊" },
  darkness: { label: "Finsternis", color: "#7c6f9c", soft: "rgba(124,111,156,0.16)", glow: "rgba(124,111,156,0.5)", emoji: "🌑" },
  metal: { label: "Metall", color: "#8aa1b8", soft: "rgba(138,161,184,0.16)", glow: "rgba(138,161,184,0.5)", emoji: "⚙️" },
  dragon: { label: "Drache", color: "#d9a441", soft: "rgba(217,164,65,0.16)", glow: "rgba(217,164,65,0.5)", emoji: "🐉" },
  fairy: { label: "Fee", color: "#ff7ac6", soft: "rgba(255,122,198,0.14)", glow: "rgba(255,122,198,0.5)", emoji: "🧚" },
  colorless: { label: "Farblos", color: "#c9c9d6", soft: "rgba(201,201,214,0.14)", glow: "rgba(201,201,214,0.4)", emoji: "✨" },
};

export function energyMeta(type: EnergyType | undefined) {
  return ENERGY[type ?? "colorless"];
}
