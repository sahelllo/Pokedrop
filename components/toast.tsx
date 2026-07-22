"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle2, Sparkles, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastKind = "info" | "success" | "alert" | "premium";

export interface ToastData {
  id: string;
  title: string;
  description?: string;
  kind?: ToastKind;
  imageUrl?: string;
}

interface ToastContextValue {
  push: (t: Omit<ToastData, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

const KIND_ICON: Record<ToastKind, React.ReactNode> = {
  info: <Bell className="h-5 w-5 text-primary" />,
  success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
  alert: <Zap className="h-5 w-5 text-poke-yellow" />,
  premium: <Sparkles className="h-5 w-5 text-poke-yellow" />,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([]);

  const push = React.useCallback((t: Omit<ToastData, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, kind: "info", ...t }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((x) => x.id !== id));
    }, 5200);
  }, []);

  const remove = (id: string) => setToasts((prev) => prev.filter((x) => x.id !== id));

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-3 z-[100] flex flex-col items-center gap-2 px-3 sm:bottom-3 sm:right-3 sm:top-auto sm:items-end">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border border-border bg-card/95 p-3.5 shadow-glow backdrop-blur",
                t.kind === "premium" && "border-poke-yellow/40",
                t.kind === "alert" && "border-poke-yellow/30",
              )}
            >
              {t.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.imageUrl}
                  alt=""
                  className="h-10 w-10 shrink-0 rounded-lg object-contain"
                />
              ) : (
                <div className="mt-0.5 shrink-0">{KIND_ICON[t.kind ?? "info"]}</div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold leading-tight">{t.title}</p>
                {t.description && (
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>
                )}
              </div>
              <button
                onClick={() => remove(t.id)}
                className="rounded-full p-1 text-muted-foreground transition hover:bg-surface-2"
                aria-label="Schließen"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
