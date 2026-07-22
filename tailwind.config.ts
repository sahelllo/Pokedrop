import type { Config } from "tailwindcss";

/**
 * PokeDrop Design-System.
 * Dark-Mode als Standard, Light-Mode optional (class-basiert).
 * Farbwelt: dunkles Neutral + kräftige Pokémon-Akzente (Rot/Blau/Gelb)
 * plus Energie-Typ-Farben als Akzent-System (siehe lib/energy.ts).
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        "surface-2": "hsl(var(--surface-2))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Pokémon-Markenfarben
        poke: {
          red: "#ee1c25",
          blue: "#2a75bb",
          yellow: "#ffcb05",
          gold: "#d4af37",
        },
        // Deal-Badge-Farben (aus der Masterliste, Abschnitt 14)
        deal: {
          top: "#ff4d6d",
          uvp: "#31d158",
          good: "#3fb950",
          market: "#f0b429",
          over: "#f2555a",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-grotesk)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px hsl(var(--border)), 0 8px 40px -12px hsl(var(--primary) / 0.45)",
        "glow-red": "0 0 30px -6px rgba(255,77,109,0.55)",
        "glow-blue": "0 0 30px -6px rgba(42,117,187,0.55)",
        "glow-yellow": "0 0 30px -6px rgba(255,203,5,0.5)",
        card: "0 1px 2px rgba(0,0,0,0.3), 0 8px 24px -16px rgba(0,0,0,0.7)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-live": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.55", transform: "scale(0.92)" },
        },
        "ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px -8px hsl(var(--primary) / 0.6)" },
          "50%": { boxShadow: "0 0 34px -4px hsl(var(--primary) / 0.9)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        "pulse-live": "pulse-live 1.4s ease-in-out infinite",
        ticker: "ticker 40s linear infinite",
        float: "float 5s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2.4s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
