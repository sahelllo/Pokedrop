"use client";

import * as React from "react";
import { Bell, Check } from "lucide-react";
import type { Product } from "@/types";
import { usePokeStore, type AlertRule } from "@/lib/store";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn, formatEuro } from "@/lib/utils";

/** "Benachrichtige mich"-Regeln (Masterliste 19.10). */
export function NotifyDialog({ product }: { product: Product }) {
  const rule = usePokeStore((s) => s.alertRules.find((r) => r.product_id === product.product_id));
  const setAlertRule = usePokeStore((s) => s.setAlertRule);
  const removeAlertRule = usePokeStore((s) => s.removeAlertRule);
  const premium = usePokeStore((s) => s.premium);
  const { push } = useToast();

  const [open, setOpen] = React.useState(false);
  const [mode, setMode] = React.useState<AlertRule["mode"]>(rule?.mode ?? "uvp");
  const [wunschpreis, setWunschpreis] = React.useState<string>(
    rule?.wunschpreis?.toString() ?? Math.round(product.reference_uvp * 0.9).toString(),
  );
  const [scope, setScope] = React.useState<AlertRule["scope"]>(rule?.scope ?? "lokal");

  function save() {
    setAlertRule({
      product_id: product.product_id,
      mode,
      wunschpreis: mode === "wunschpreis" ? Number(wunschpreis) : undefined,
      scope,
    });
    setOpen(false);
    push({
      title: "Alert aktiv",
      description:
        mode === "uvp"
          ? "Du wirst benachrichtigt, sobald das Produkt zur UVP verfügbar ist."
          : mode === "wunschpreis"
            ? `Alert unter ${formatEuro(Number(wunschpreis))} · ${scope === "lokal" ? "lokal" : "deutschlandweit"}`
            : "Alert bei jedem Restock.",
      kind: "success",
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={rule ? "subtle" : "default"} className="w-full sm:w-auto">
          <Bell className="h-4 w-4" />
          {rule ? "Alert aktiv – anpassen" : "Benachrichtige mich"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Benachrichtige mich</DialogTitle>
          <DialogDescription>{product.product_name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <RuleOption active={mode === "uvp"} onClick={() => setMode("uvp")} title="Bei UVP oder günstiger" desc={`Sobald ≤ ${formatEuro(product.reference_uvp)} verfügbar`} />
          <RuleOption active={mode === "wunschpreis"} onClick={() => setMode("wunschpreis")} title="Unter Wunschpreis" desc="Eigene Preisgrenze festlegen">
            {mode === "wunschpreis" && (
              <div className="mt-2 flex items-center gap-2">
                <Input
                  type="number"
                  value={wunschpreis}
                  onChange={(e) => setWunschpreis(e.target.value)}
                  className="h-9 w-28"
                />
                <span className="text-sm text-muted-foreground">€ oder weniger</span>
              </div>
            )}
          </RuleOption>
          <RuleOption active={mode === "restock"} onClick={() => setMode("restock")} title="Bei jedem Restock" desc="Sobald wieder verfügbar" />
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Reichweite</p>
          <div className="flex gap-2">
            {(["lokal", "deutschlandweit"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={cn(
                  "flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition",
                  scope === s ? "border-primary bg-primary/15 text-primary" : "border-border bg-surface/60 text-muted-foreground",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {!premium && (
          <p className="rounded-xl bg-poke-yellow/10 px-3 py-2 text-xs text-poke-yellow">
            ⚡ Mit Premium kommt der Alert sofort per Push – Free-Alerts sind bis zu 15 Min. verzögert.
          </p>
        )}

        <div className="flex justify-between gap-2">
          {rule ? (
            <Button
              variant="ghost"
              onClick={() => {
                removeAlertRule(product.product_id);
                setOpen(false);
                push({ title: "Alert entfernt", kind: "info" });
              }}
            >
              Entfernen
            </Button>
          ) : (
            <span />
          )}
          <Button onClick={save}>
            <Check className="h-4 w-4" /> Speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RuleOption({
  active,
  onClick,
  title,
  desc,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full rounded-xl border p-3 text-left transition",
        active ? "border-primary bg-primary/10" : "border-border bg-surface/60 hover:bg-surface-2",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border-2",
            active ? "border-primary bg-primary" : "border-muted-foreground",
          )}
        >
          {active && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <p className="ml-6 text-xs text-muted-foreground">{desc}</p>
      <div className="ml-6">{children}</div>
    </button>
  );
}
