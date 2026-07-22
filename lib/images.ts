import type { Product } from "@/types";

/**
 * Asset-/Bild-Schicht (Abschnitt 5).
 * Primärquelle: PokéAPI Official Artwork (stabile, echte Pokémon-Renderbilder,
 * frei nutzbar für Fan-Projekte). Optional echte TCG-Kartenbilder.
 * Fällt immer sauber zurück (siehe components/smart-image.tsx) – nie graue Kästen.
 */

const POKEAPI_ARTWORK =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork";

export function pokemonArtworkUrl(dexId: number | undefined): string | undefined {
  if (!dexId) return undefined;
  return `${POKEAPI_ARTWORK}/${dexId}.png`;
}

/** Kleines Sprite (für Deko/Chips). */
export function pokemonSpriteUrl(dexId: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${dexId}.png`;
}

/** Bevorzugte Produktbild-URL: echtes TCG-Bild, sonst Pokémon-Artwork. */
export function productImageUrl(product: Product): string | undefined {
  return product.tcgImage ?? pokemonArtworkUrl(product.pokemonArtworkId);
}

/** Deterministischer DiceBear-Avatar (SVG data-frei über CDN, mit Fallback). */
export function avatarUrl(seed: number): string {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${seed}.png`;
}
