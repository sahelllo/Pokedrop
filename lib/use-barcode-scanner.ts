"use client";

import * as React from "react";
import { BARCODE_FORMATS, isValidBarcode, normalizeBarcode } from "./barcode";

/**
 * Strichcode-Erkennung über die Handykamera.
 *
 * Zwei Wege, je nach Browser:
 * 1. **Eingebaute Erkennung** (`BarcodeDetector`) – gibt es in Chrome auf
 *    Android. Schnell und stromsparend, weil sie im Browser selbst steckt.
 * 2. **Notlösung ZXing** – eine Bibliothek, die dasselbe in JavaScript macht.
 *    Sie wird erst geladen, wenn Weg 1 fehlt (z. B. auf dem iPhone), damit
 *    die Seite für alle anderen klein bleibt.
 *
 * Sicherheitsnetz gegen Lesefehler: Ein Code gilt erst als erkannt, wenn er
 * **zweimal hintereinander gleich** gelesen wurde und seine Prüfziffer stimmt.
 * Ein einzelnes verwackeltes Bild löst damit nichts aus.
 *
 * Das Video bleibt auf dem Gerät. Es wird nichts hochgeladen.
 */

export type ScannerEngine = "eingebaut" | "zxing";

export type ScannerError =
  | "kein-zugriff" // Nutzer hat die Kamera abgelehnt
  | "keine-kamera" // Gerät hat keine
  | "nicht-unterstuetzt"; // weder BarcodeDetector noch ZXing nutzbar

interface Options {
  /** wird genau einmal je erkanntem Code aufgerufen */
  onDetect: (code: string) => void;
  onError?: (err: ScannerError) => void;
}

interface NativeDetector {
  detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>;
}

export function useBarcodeScanner({ onDetect, onError }: Options) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const streamRef = React.useRef<MediaStream | null>(null);
  const stopFnRef = React.useRef<(() => void) | null>(null);
  const lastSeenRef = React.useRef<string | null>(null);
  const doneRef = React.useRef(false);

  const [running, setRunning] = React.useState(false);
  const [engine, setEngine] = React.useState<ScannerEngine | null>(null);

  // In Callbacks immer die aktuelle Funktion benutzen, ohne den Scanner
  // bei jedem Rendern neu zu starten.
  const onDetectRef = React.useRef(onDetect);
  const onErrorRef = React.useRef(onError);
  React.useEffect(() => {
    onDetectRef.current = onDetect;
    onErrorRef.current = onError;
  });

  const stop = React.useCallback(() => {
    stopFnRef.current?.();
    stopFnRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    lastSeenRef.current = null;
    setRunning(false);
    setEngine(null);
  }, []);

  /** Ein Lesetreffer – erst beim zweiten gleichen Ergebnis melden. */
  const handleRaw = React.useCallback(
    (raw: string) => {
      if (doneRef.current) return;
      const code = normalizeBarcode(raw);
      if (!code || !isValidBarcode(code)) return;
      if (lastSeenRef.current !== code) {
        lastSeenRef.current = code;
        return;
      }
      doneRef.current = true;
      onDetectRef.current(code);
    },
    [],
  );

  const start = React.useCallback(async () => {
    doneRef.current = false;
    lastSeenRef.current = null;

    let stream: MediaStream;
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        onErrorRef.current?.("keine-kamera");
        return;
      }
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 } },
        audio: false,
      });
    } catch {
      onErrorRef.current?.("kein-zugriff");
      return;
    }

    streamRef.current = stream;
    const video = videoRef.current;
    if (!video) {
      stream.getTracks().forEach((t) => t.stop());
      return;
    }
    video.srcObject = stream;
    await video.play().catch(() => {});
    setRunning(true);

    // Weg 1: eingebaute Erkennung
    const Ctor = (window as unknown as {
      BarcodeDetector?: new (o: { formats: string[] }) => NativeDetector;
    }).BarcodeDetector;

    if (Ctor) {
      setEngine("eingebaut");
      const detector = new Ctor({ formats: [...BARCODE_FORMATS] });
      let stopped = false;
      const tick = async () => {
        if (stopped || doneRef.current || !videoRef.current) return;
        try {
          const hits = await detector.detect(videoRef.current);
          for (const h of hits) handleRaw(h.rawValue);
        } catch {
          // Einzelne Frames dürfen fehlschlagen – weiter versuchen.
        }
        if (!stopped && !doneRef.current) window.setTimeout(tick, 200);
      };
      void tick();
      stopFnRef.current = () => {
        stopped = true;
      };
      return;
    }

    // Weg 2: ZXing – erst jetzt nachladen
    try {
      const [{ BrowserMultiFormatReader }, { BarcodeFormat, DecodeHintType }] = await Promise.all([
        import("@zxing/browser"),
        import("@zxing/library"),
      ]);
      const hints = new Map();
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
      ]);
      const reader = new BrowserMultiFormatReader(hints, { delayBetweenScanAttempts: 200 });
      setEngine("zxing");
      const controls = await reader.decodeFromVideoElement(video, (result) => {
        if (result) handleRaw(result.getText());
      });
      stopFnRef.current = () => controls.stop();
    } catch {
      onErrorRef.current?.("nicht-unterstuetzt");
      stop();
    }
  }, [handleRaw, stop]);

  // Kamera nie versehentlich weiterlaufen lassen.
  React.useEffect(() => stop, [stop]);

  return { videoRef, start, stop, running, engine };
}
