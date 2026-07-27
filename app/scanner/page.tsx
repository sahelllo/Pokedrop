"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Camera,
  CameraOff,
  Check,
  Keyboard,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Undo2,
  Wallet,
} from "lucide-react";
import type { Product } from "@/types";
import { productImageUrl } from "@/lib/images";
import { usePokeStore } from "@/lib/store";
import { useMounted } from "@/lib/use-mounted";
import { useDatasetVersion, getDataset } from "@/lib/dataset";
import { useToast } from "@/components/toast";
import { cn, formatEuro } from "@/lib/utils";
import { SmartImage } from "@/components/smart-image";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { getOffersForProduct, getDealViewForOffer } from "@/lib/data";
import { distanceLabel } from "@/components/signature/distance-ring";
import { RarityPill } from "@/components/rarity-pill";
import { RARITY_META, rarityOf } from "@/lib/rarity";
import {
  findProductByBarcode,
  formatBarcode,
  isValidBarcode,
  normalizeBarcode,
} from "@/lib/barcode";
import { useBarcodeScanner, type ScannerError } from "@/lib/use-barcode-scanner";

type Phase = "idle" | "scanning" | "result" | "unknown" | "error";

const ERROR_TEXT: Record<ScannerError, { title: string; hint: string }> = {
  "kein-zugriff": {
    title: "Kamera nicht freigegeben",
    hint: "Erlaube den Kamerazugriff in den Browser-Einstellungen – oder tippe den Strichcode unten von Hand ein.",
  },
  "keine-kamera": {
    title: "Keine Kamera gefunden",
    hint: "Auf diesem Gerät gibt es keine nutzbare Kamera. Den Code kannst du unten eintippen.",
  },
  "nicht-unterstuetzt": {
    title: "Browser kann keine Strichcodes lesen",
    hint: "Probiere Chrome auf dem Handy – oder tippe den Code unten ein.",
  },
};

export default function ScannerPage() {
  const mounted = useMounted();
  const dataVersion = useDatasetVersion();
  const { push } = useToast();

  const barcodeMappings = usePokeStore((s) => s.barcodeMappings);
  const addBarcodeMapping = usePokeStore((s) => s.addBarcodeMapping);
  const addToPortfolio = usePokeStore((s) => s.addToPortfolio);
  const removeFromPortfolio = usePokeStore((s) => s.removeFromPortfolio);
  const setPortfolioQty = usePokeStore((s) => s.setPortfolioQty);
  const portfolio = usePokeStore((s) => s.portfolio);
  const location = usePokeStore((s) => s.location);
  const radiusKm = usePokeStore((s) => s.radiusKm);

  const [phase, setPhase] = React.useState<Phase>("idle");
  const [hit, setHit] = React.useState<{ product: Product; code: string } | null>(null);
  const [unknownCode, setUnknownCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<ScannerError | null>(null);
  const [autoAdd, setAutoAdd] = React.useState(true);
  const [added, setAdded] = React.useState(false);
  const [manualCode, setManualCode] = React.useState("");

  // Refs, damit der Erkennungs-Callback nicht bei jedem Rendern neu entsteht.
  const autoAddRef = React.useRef(autoAdd);
  autoAddRef.current = autoAdd;
  const mappingsRef = React.useRef(barcodeMappings);
  mappingsRef.current = barcodeMappings;

  const handleCode = React.useCallback(
    (code: string) => {
      const found = findProductByBarcode(code, mappingsRef.current);
      if (!found) {
        setUnknownCode(code);
        setPhase("unknown");
        return;
      }
      setHit({ product: found.product, code });
      setAdded(false);
      setPhase("result");
      if (autoAddRef.current) {
        addToPortfolio(found.product.product_id, { source: "scan", barcode: code });
        setAdded(true);
      }
    },
    [addToPortfolio],
  );

  const scannerRef = React.useRef<{ stop: () => void } | null>(null);
  const scanner = useBarcodeScanner({
    onDetect: (code) => {
      scannerRef.current?.stop();
      handleCode(code);
    },
    onError: (e) => {
      setError(e);
      setPhase("error");
    },
  });
  scannerRef.current = scanner;

  async function startScan() {
    setError(null);
    setHit(null);
    setUnknownCode(null);
    setPhase("scanning");
    await scanner.start();
  }

  function stopScan() {
    scanner.stop();
    setPhase("idle");
  }

  function submitManual() {
    const code = normalizeBarcode(manualCode);
    if (!code || !isValidBarcode(code)) {
      push({
        title: "Code nicht lesbar",
        description: "Ein Strichcode hat 8, 12 oder 13 Ziffern. Prüfe die Zahl unter den Strichen.",
        kind: "info",
      });
      return;
    }
    setManualCode("");
    handleCode(code);
  }

  /** Unbekannten Code einem Produkt zuordnen – der Scanner lernt dazu. */
  function assign(product: Product) {
    if (!unknownCode) return;
    addBarcodeMapping(unknownCode, product.product_id);
    setHit({ product, code: unknownCode });
    setUnknownCode(null);
    setAdded(false);
    setPhase("result");
    if (autoAdd) {
      addToPortfolio(product.product_id, { source: "scan", barcode: unknownCode });
      setAdded(true);
    }
    push({
      title: "Code gespeichert",
      description: "Beim nächsten Mal wird dieses Produkt sofort erkannt.",
      kind: "success",
    });
  }

  function undoAdd() {
    if (!hit) return;
    const entry = portfolio.find((p) => p.product_id === hit.product.product_id);
    if (!entry) return;
    if (entry.qty <= 1) removeFromPortfolio(hit.product.product_id);
    else setPortfolioQty(hit.product.product_id, entry.qty - 1);
    setAdded(false);
  }

  function pickManually(p: Product) {
    setHit({ product: p, code: p.ean ?? "" });
    setAdded(false);
    setPhase("result");
    if (autoAdd) {
      addToPortfolio(p.product_id, { source: "manuell", barcode: p.ean });
      setAdded(true);
    }
  }

  /* Bester Preis in der Nähe – erscheint automatisch mit dem Treffer. */
  /* eslint-disable react-hooks/exhaustive-deps */
  const bestView = React.useMemo(() => {
    if (!hit) return undefined;
    return getOffersForProduct(hit.product.product_id)
      .map((o) => getDealViewForOffer(o, location, radiusKm))
      .filter((v): v is NonNullable<typeof v> => Boolean(v))
      .sort((a, b) => a.offer.price - b.offer.price)[0];
  }, [hit, location, radiusKm, dataVersion]);

  const collection = React.useMemo(() => {
    if (!mounted) return { count: 0, value: 0 };
    const ds = getDataset();
    let count = 0;
    let value = 0;
    for (const item of portfolio) {
      const p = ds.productsById.get(item.product_id);
      if (!p) continue;
      count += item.qty;
      value += (p.market_reference_price || p.reference_uvp) * item.qty;
    }
    return { count, value };
  }, [portfolio, mounted, dataVersion]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <div className="space-y-4">
      <PageHeader
        accent="var(--radar-online)"
        status="Strichcode-Scanner"
        title="Produkt scannen"
        subtitle="Strichcode vor die Kamera halten – Preis und Seltenheit erscheinen sofort."
      />

      {/* Kamera */}
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-[var(--radius)] border border-border bg-black">
        <video
          ref={scanner.videoRef}
          playsInline
          muted
          className="h-full w-full object-cover"
          style={{ display: phase === "scanning" ? "block" : "none" }}
        />

        {phase === "idle" && (
          <CenterOverlay>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-primary/50 bg-primary/10 text-primary">
              <Camera className="h-8 w-8" />
            </div>
            <p className="mt-4 max-w-[17rem] text-sm text-white/80">
              Halte den <strong>Strichcode</strong> der Packung in den Rahmen. Erkannt wird
              automatisch – du musst nichts drücken.
            </p>
            <Button onClick={startScan} className="mt-4">
              <Camera className="h-4 w-4" /> Kamera starten
            </Button>
          </CenterOverlay>
        )}

        {phase === "error" && error && (
          <CenterOverlay>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 text-white/80">
              <CameraOff className="h-8 w-8" />
            </div>
            <p className="mt-4 font-semibold text-white">{ERROR_TEXT[error].title}</p>
            <p className="mt-1 max-w-[17rem] text-sm text-white/70">{ERROR_TEXT[error].hint}</p>
            <Button onClick={startScan} variant="outline" className="mt-4">
              <RefreshCw className="h-4 w-4" /> Nochmal versuchen
            </Button>
          </CenterOverlay>
        )}

        {phase === "scanning" && (
          <>
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute inset-x-5 top-1/2 h-40 -translate-y-1/2 rounded-2xl border-2 border-white/70" />
              <motion.div
                className="absolute inset-x-7 h-0.5 rounded-full bg-primary shadow-[0_0_14px_3px_var(--radar-near)]"
                initial={{ top: "36%" }}
                animate={{ top: ["36%", "64%", "36%"] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              />
              <p className="absolute inset-x-0 bottom-16 text-center font-mono text-[11px] uppercase tracking-widest text-white/70">
                Suche Strichcode…
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-3 flex justify-center">
              <Button variant="outline" size="sm" onClick={stopScan}>
                Abbrechen
              </Button>
            </div>
          </>
        )}

        <AnimatePresence>
          {phase === "unknown" && unknownCode && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              data-testid="scan-unknown"
              className="absolute inset-0 flex flex-col bg-black/90 p-4"
            >
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-[var(--heat-1)]">
                Code unbekannt
              </p>
              <p className="mt-1 font-mono text-lg font-bold text-white">
                {formatBarcode(unknownCode)}
              </p>
              <p className="mt-1 text-xs leading-snug text-white/70">
                Dieser Strichcode steht noch nicht im Katalog. Sag einmal, was es ist – danach wird
                er sofort erkannt.
              </p>
              <ProductPicker onPick={assign} className="mt-3 min-h-0 flex-1" />
              <Button variant="ghost" className="mt-2 w-full shrink-0 text-white/80" onClick={startScan}>
                <RefreshCw className="h-4 w-4" /> Anderen Code scannen
              </Button>
            </motion.div>
          )}

          {phase === "result" && hit && (
            <motion.div
              key={hit.product.product_id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              data-testid="scan-result"
              className="absolute inset-0 flex flex-col overflow-y-auto bg-gradient-to-b from-black/60 to-black/92 p-4"
            >
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded bg-primary/20 px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-wide text-primary">
                  <Check className="h-3 w-3" /> erkannt
                </span>
                <RarityPill product={hit.product} />
              </div>

              <div className="mt-3 flex items-start gap-3">
                <SmartImage
                  src={productImageUrl(hit.product)}
                  alt={hit.product.product_name}
                  energyType={hit.product.energyType}
                  className="h-44 w-32 shrink-0 rounded-xl"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[11px] text-white/60">{hit.product.set_name}</p>
                  <p className="font-display text-base font-bold leading-tight text-white">
                    {hit.product.product_name}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-white/60">
                    {rarityOf(hit.product).reason}
                  </p>

                  <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-white/50">
                    Marktwert
                  </p>
                  <p className="font-mono text-2xl font-bold leading-none text-white">
                    {formatEuro(hit.product.market_reference_price || hit.product.reference_uvp)}
                  </p>
                  <p className="mt-1 font-mono text-[11px] text-white/60">
                    UVP {formatEuro(hit.product.reference_uvp)}
                  </p>

                  {bestView ? (
                    <p className="mt-2 font-mono text-[11px] leading-snug text-primary">
                      Günstigstes Angebot {formatEuro(bestView.offer.price)}
                      <span className="block text-white/60">
                        {distanceLabel(
                          bestView.distanceKm,
                          bestView.offer.validity_type === "ONLINE",
                        )}
                        {" · "}
                        {bestView.offer.retailer_brand}
                      </span>
                    </p>
                  ) : (
                    <p className="mt-2 text-[11px] text-white/50">Kein Angebot im Umkreis.</p>
                  )}
                </div>
              </div>

              {added ? (
                <div className="mt-auto flex shrink-0 items-center justify-between gap-2 rounded-[var(--radius)] border border-primary/40 bg-primary/10 px-3 py-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <Check className="h-4 w-4" /> In deiner Sammlung
                  </span>
                  <button
                    onClick={undoAdd}
                    className="inline-flex items-center gap-1 text-xs text-white/70 transition hover:text-white"
                  >
                    <Undo2 className="h-3.5 w-3.5" /> Rückgängig
                  </button>
                </div>
              ) : (
                <Button
                  className="mt-auto w-full shrink-0"
                  onClick={() => {
                    addToPortfolio(hit.product.product_id, { source: "scan", barcode: hit.code });
                    setAdded(true);
                  }}
                >
                  <Plus className="h-4 w-4" /> Zur Sammlung
                </Button>
              )}

              <div className="mt-2 grid shrink-0 grid-cols-2 gap-2">
                <Button asChild variant="outline" className="w-full">
                  <Link href={`/product/${hit.product.product_id}`}>
                    Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="subtle" className="w-full" onClick={startScan}>
                  <RefreshCw className="h-4 w-4" /> Nächster
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Automatik-Schalter */}
      <div className="mx-auto flex max-w-sm items-center justify-between gap-3 rounded-[var(--radius)] border border-border bg-card p-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold">Automatisch zur Sammlung</p>
          <p className="text-xs leading-snug text-muted-foreground">
            Jeder Scan wandert direkt hinein – einzeln rückgängig zu machen.
          </p>
        </div>
        <Switch
          checked={autoAdd}
          onCheckedChange={setAutoAdd}
          aria-label="Gescannte Produkte automatisch zur Sammlung hinzufügen"
        />
      </div>

      {/* Ohne Kamera */}
      <div className="mx-auto max-w-sm space-y-2.5 rounded-[var(--radius)] border border-border bg-card p-3">
        <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <Keyboard className="h-3.5 w-3.5" /> Ohne Kamera
        </p>
        <div className="flex gap-2">
          <Input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitManual();
            }}
            inputMode="numeric"
            placeholder="Zahl unter dem Strichcode"
            aria-label="Strichcode eintippen"
          />
          <Button onClick={submitManual} className="shrink-0">
            Suchen
          </Button>
        </div>
        <details>
          <summary className="cursor-pointer list-none text-xs text-muted-foreground transition hover:text-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" /> Oder direkt nach dem Produkt suchen
            </span>
          </summary>
          <ProductPicker className="mt-2 max-h-64" variant="light" onPick={pickManually} />
        </details>
      </div>

      {/* Sammlungs-Stand */}
      <Link
        href="/portfolio"
        className="mx-auto flex max-w-sm items-center gap-3 rounded-[var(--radius)] border border-border bg-card p-3 transition hover:border-primary/40"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Layers className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Deine Sammlung</span>
          <span className="block font-mono text-[11px] text-muted-foreground">
            {mounted ? `${collection.count} Stück` : "…"}
          </span>
        </span>
        <span className="shrink-0 text-right">
          <span className="block font-mono text-lg font-bold tabular-nums text-primary">
            {mounted ? formatEuro(collection.value) : "—"}
          </span>
          <span className="block font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Gesamtwert
          </span>
        </span>
        <Wallet className="h-4 w-4 shrink-0 text-muted-foreground" />
      </Link>

      <p className="mx-auto max-w-md text-center text-[11px] leading-relaxed text-muted-foreground">
        Die Kamera läuft nur auf deinem Gerät – es wird kein Bild hochgeladen. Gelesen werden
        Strichcodes versiegelter Produkte (EAN/UPC). Steht ein Code noch nicht im Katalog, ordnest
        du ihn einmal zu und er wird danach sofort erkannt.
      </p>
    </div>
  );
}

function CenterOverlay({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
      {children}
    </div>
  );
}

/** Produktliste mit Suchfeld – für Zuordnung und manuelles Hinzufügen. */
function ProductPicker({
  onPick,
  className,
  variant = "dark",
}: {
  onPick: (p: Product) => void;
  className?: string;
  variant?: "dark" | "light";
}) {
  const [q, setQ] = React.useState("");
  const dataVersion = useDatasetVersion();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const all = React.useMemo(() => getDataset().products, [dataVersion]);
  const list = React.useMemo(() => {
    const needle = q.trim().toLowerCase();
    const base = needle
      ? all.filter(
          (p) =>
            p.product_name.toLowerCase().includes(needle) ||
            p.set_name.toLowerCase().includes(needle),
        )
      : all;
    return base.slice(0, 40);
  }, [all, q]);

  const dark = variant === "dark";

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Produkt suchen…"
        aria-label="Produkt suchen"
        className={cn(
          "shrink-0",
          dark && "border-white/20 bg-white/10 text-white placeholder:text-white/40",
        )}
      />
      <div className="mt-2 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
        {list.map((p) => (
          <button
            key={p.product_id}
            onClick={() => onPick(p)}
            className={cn(
              "flex w-full items-center gap-2 rounded-xl p-2 text-left transition",
              dark ? "hover:bg-white/10" : "hover:bg-surface-2",
            )}
          >
            <SmartImage
              src={productImageUrl(p)}
              alt=""
              energyType={p.energyType}
              className="h-10 w-8 shrink-0 rounded"
            />
            <span className="min-w-0 flex-1">
              <span className={cn("block truncate text-xs font-medium", dark && "text-white")}>
                {p.product_name}
              </span>
              <span
                className={cn(
                  "block truncate font-mono text-[10px]",
                  dark ? "text-white/50" : "text-muted-foreground",
                )}
              >
                {formatEuro(p.market_reference_price || p.reference_uvp)} ·{" "}
                {RARITY_META[rarityOf(p).tier].label}
              </span>
            </span>
            <Plus className="h-4 w-4 shrink-0 text-primary" />
          </button>
        ))}
        {list.length === 0 && (
          <p
            className={cn(
              "px-2 py-6 text-center text-xs",
              dark ? "text-white/60" : "text-muted-foreground",
            )}
          >
            Nichts gefunden.
          </p>
        )}
      </div>
    </div>
  );
}
