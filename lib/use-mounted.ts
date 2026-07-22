"use client";

import { useEffect, useState } from "react";

/**
 * Verhindert Hydration-Mismatches bei Komponenten, die aus dem persistierten
 * Store (localStorage) lesen: erst nach dem Mount echten Inhalt rendern.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
