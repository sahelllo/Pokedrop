/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Bilder kommen von öffentlichen CDNs (PokéAPI-Artwork, Pokémon-TCG-API).
  // `unoptimized` hält den Build ohne serverseitigen Image-Fetch lauffähig –
  // ideal für einen reinen Static/Vercel-Deploy. Fallbacks siehe components/smart-image.tsx.
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "images.pokemontcg.io" },
      { protocol: "https", hostname: "assets.pokemon.com" },
    ],
  },
  eslint: {
    // Der Produktions-Build soll auch dann durchlaufen, wenn Lint-Warnungen bestehen.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
