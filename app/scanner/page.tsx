"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  ScanLine,
  Loader2,
  Sparkles,
  RefreshCw,
  Plus,
  ArrowRight,
  CameraOff,
} from "lucide-react";
import { products, productsById } from "@/data/products";
import { productImageUrl } from "@/lib/images";
import { usePokeStore } from "@/lib/store";
import { useToast } from "@/components/toast";
import { formatEuro } from "@/lib/utils";
import { SmartImage } from "@/components/smart-image";
import { DealBadgePill } from "@/components/deal-badge";
import { Button } from "@/components/ui/button";
import { getOffersForProduct, getDealViewForOffer } from "@/lib/data";
import { energyMeta } from "@/lib/energy";

type Phase = "idle" | "camera" | "analyzing" | "result" | "denied";

export default function ScannerPage() {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [resultId, setResultId] = React.useState<string | null>(null);
  const [confidence, setConfidence] = React.useState(0);

  const addToPortfolio = usePokeStore((s) => s.addToPortfolio);
  const location = usePokeStore((s) => s.location);
  const radiusKm = usePokeStore((s) => s.radiusKm);
  const { push } = useToast();

  const stopCamera = React.useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  React.useEffect(() => () => stopCamera(), [stopCamera]);

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setPhase("camera");
    } catch {
      setPhase("denied");
    }
  }

  function analyze() {
    setPhase("analyzing");
    // Demo-Erkennung: nach kurzer "Analyse" ein Produkt aus der Beispiel-DB.
    window.setTimeout(() => {
      const pick = products[Math.floor(Math.random() * products.length)];
      setResultId(pick.product_id);
      setConfidence(88 + Math.floor(Math.random() * 11));
      setPhase("result");
      stopCamera();
    }, 1700);
  }

  function reset() {
    setResultId(null);
    startCamera();
  }

  const product = resultId ? productsById.get(resultId) : undefined;
  const bestView = React.useMemo(() => {
    if (!product) return undefined;
    const views = getOffersForProduct(product.product_id)
      .map((o) => getDealViewForOffer(o, location, radiusKm))
      .filter((v): v is NonNullable<typeof v> => Boolean(v))
      .sort((a, b) => b.rankScore - a.rankScore);
    return views[0];
  }, [product, location, radiusKm]);

  return (
    <div className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-5 shadow-card">
        <div className="pointer-events-none absolute -right-10 -top-12 h-44 w-44 rounded-full bg-secondary/20 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-2.5 py-0.5 text-xs font-bold text-secondary">
            <ScanLine className="h-3.5 w-3.5" /> Karten-Scanner
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold">Karte scannen & sofort erkennen</h1>
          <p className="mt-1 max-w-lg text-sm text-muted-foreground">
            Halte eine Pokémon-Karte vor die Kamera – PokeDrop erkennt sie und zeigt dir Preis,
            Deal-Bewertung und Angebote in deiner Nähe.
          </p>
        </div>
      </div>

      {/* Kamera-Viewport */}
      <div className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-black shadow-glow">
        <video
          ref={videoRef}
          playsInline
          muted
          className="h-full w-full object-cover"
          style={{ display: phase === "camera" || phase === "analyzing" ? "block" : "none" }}
        />

        {/* Idle */}
        {phase === "idle" && (
          <CenterOverlay>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-glow-blue">
              <Camera className="h-8 w-8" />
            </div>
            <p className="mt-4 max-w-[16rem] text-sm text-white/80">
              Kamera aktivieren und Karte im Rahmen platzieren.
            </p>
            <Button onClick={startCamera} className="mt-4">
              <Camera className="h-4 w-4" /> Kamera starten
            </Button>
            <button
              onClick={analyze}
              className="mt-2 text-xs text-white/60 underline-offset-2 hover:underline"
            >
              Ohne Kamera testen (Demo)
            </button>
          </CenterOverlay>
        )}

        {/* Denied */}
        {phase === "denied" && (
          <CenterOverlay>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 text-white/80">
              <CameraOff className="h-8 w-8" />
            </div>
            <p className="mt-4 max-w-[16rem] text-sm text-white/80">
              Kein Kamerazugriff. Du kannst die Erkennung als Demo testen.
            </p>
            <Button onClick={analyze} className="mt-4" variant="secondary">
              <Sparkles className="h-4 w-4" /> Demo-Scan
            </Button>
          </CenterOverlay>
        )}

        {/* Scan-Rahmen + Laser */}
        {(phase === "camera" || phase === "analyzing") && (
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-6 rounded-2xl border-2 border-white/70" />
            {/* Ecken */}
            {["left-4 top-4", "right-4 top-4", "left-4 bottom-4", "right-4 bottom-4"].map((pos) => (
              <span key={pos} className={`absolute ${pos} h-6 w-6 rounded border-primary`} />
            ))}
            <motion.div
              className="absolute inset-x-8 h-0.5 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_12px_2px_rgba(58,160,255,0.7)]"
              initial={{ top: "12%" }}
              animate={{ top: ["12%", "84%", "12%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        )}

        {/* Analyzing-Overlay */}
        {phase === "analyzing" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-3 text-sm font-medium text-white">Karte wird erkannt…</p>
          </div>
        )}

        {/* Result */}
        <AnimatePresence>
          {phase === "result" && product && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col bg-gradient-to-b from-black/40 to-black/85 p-4"
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                  <Sparkles className="h-3 w-3" /> erkannt · {confidence}%
                </span>
                {bestView && <DealBadgePill badge={bestView.evaluation.badge} size="sm" />}
              </div>
              <div className="flex flex-1 items-center gap-3">
                <SmartImage
                  src={productImageUrl(product)}
                  alt={product.product_name}
                  energyType={product.energyType}
                  className="h-40 w-32 shrink-0 rounded-xl"
                />
                <div className="min-w-0">
                  <p className="text-xs" style={{ color: energyMeta(product.energyType).color }}>
                    {product.set_name}
                  </p>
                  <p className="font-display text-lg font-bold leading-tight text-white">
                    {product.product_name}
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Marktwert {formatEuro(product.market_reference_price || product.reference_uvp)}
                  </p>
                  {bestView && (
                    <p className="text-sm font-semibold text-emerald-300">
                      Bester Deal: {formatEuro(bestView.offer.price)}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <Button asChild variant="secondary" className="w-full">
                  <Link href={`/product/${product.product_id}`}>
                    Details <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    addToPortfolio(product.product_id);
                    push({ title: "Zur Sammlung hinzugefügt", description: product.product_name, kind: "success" });
                  }}
                >
                  <Plus className="h-4 w-4" /> Sammlung
                </Button>
              </div>
              <Button variant="ghost" className="mt-2 w-full text-white/80" onClick={reset}>
                <RefreshCw className="h-4 w-4" /> Nächste Karte scannen
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Scan-Auslöser */}
      {phase === "camera" && (
        <div className="flex justify-center">
          <button
            onClick={analyze}
            aria-label="Scannen"
            className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-primary bg-white/10 backdrop-blur transition hover:scale-105 active:scale-95"
          >
            <span className="h-11 w-11 rounded-full bg-primary" />
          </button>
        </div>
      )}

      <p className="mx-auto max-w-md text-center text-[11px] text-muted-foreground">
        Hinweis: Die Bilderkennung ist in dieser Version eine Demo und ordnet der Karte ein Produkt
        aus der Beispiel-Datenbank zu. Die Kamera läuft lokal auf deinem Gerät – es wird nichts
        hochgeladen.
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
