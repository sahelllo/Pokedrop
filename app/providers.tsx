"use client";

import { useEffect } from "react";
import { usePokeStore } from "@/lib/store";
import { ToastProvider } from "@/components/toast";
import { OnboardingGate } from "@/components/onboarding";
import { DatasetLoader } from "@/components/dataset-loader";

/**
 * Client-Provider: Theme-Klasse anwenden, Toasts, Onboarding-Gate.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  const theme = usePokeStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  return (
    <ToastProvider>
      <DatasetLoader />
      {children}
      <OnboardingGate />
    </ToastProvider>
  );
}
