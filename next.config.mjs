/**
 * Statischer Export für GitHub Pages.
 *
 * - `output: "export"` erzeugt beim Build einen komplett statischen `out/`-Ordner,
 *   den GitHub Pages direkt ausliefern kann (Pages baut Next.js NICHT selbst).
 * - Auf GitHub Pages läuft die App unter dem Unterpfad /Pokedrop/, daher wird
 *   `basePath` gesetzt, wenn die Umgebungsvariable GITHUB_PAGES=true ist
 *   (der Deploy-Workflow setzt sie). Lokal & auf Vercel bleibt sie an der Wurzel.
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoBase = "/Pokedrop";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGithubPages ? repoBase : undefined,
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "raw.githubusercontent.com" },
      { protocol: "https", hostname: "images.pokemontcg.io" },
      { protocol: "https", hostname: "assets.pokemon.com" },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
