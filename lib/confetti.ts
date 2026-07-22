"use client";

import confetti from "canvas-confetti";

/** Konfetti-/Sparkle-Effekt bei 🔥 TOP DEALS (Design-Vorgabe Abschnitt 4). */
export function fireTopDealConfetti(origin?: { x: number; y: number }) {
  const defaults = {
    spread: 70,
    startVelocity: 32,
    ticks: 120,
    gravity: 0.9,
    colors: ["#ff4d6d", "#ffcb05", "#2a75bb", "#31d158", "#ffffff"],
    disableForReducedMotion: true,
  };
  confetti({
    ...defaults,
    particleCount: 60,
    origin: origin ?? { x: 0.5, y: 0.4 },
    scalar: 0.9,
  });
  confetti({
    ...defaults,
    particleCount: 24,
    origin: origin ?? { x: 0.5, y: 0.4 },
    scalar: 1.3,
    startVelocity: 24,
  });
}
