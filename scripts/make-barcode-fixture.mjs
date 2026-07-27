/**
 * Erzeugt aus einer EAN-13-Nummer ein Video im Y4M-Format.
 *
 * Wozu? Damit die automatischen Tests den Scanner **wirklich** über die
 * Kamera prüfen können. Chromium lässt sich mit
 * `--use-file-for-fake-video-capture=datei.y4m` eine Videodatei als Kamera
 * unterschieben. Der Test hält dem Browser also einen echten Strichcode vor
 * die Linse – nur eben als Datei.
 *
 * Y4M ist das denkbar einfachste Videoformat: ein Textkopf, danach je Bild
 * die rohen Helligkeitswerte. Für Schwarz-Weiß reicht das völlig.
 */

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";

/* EAN-13-Kodierung nach GS1. 1 = schwarzer Strich, 0 = weiß. */
const L = ["0001101","0011001","0010011","0111101","0100011","0110001","0101111","0111011","0110111","0001011"];
const G = ["0100111","0110011","0011011","0100001","0011101","0111001","0000101","0010001","0001001","0010111"];
const R = ["1110010","1100110","1101100","1000010","1011100","1001110","1010000","1000100","1001000","1110100"];

/** Welche der ersten sechs Ziffern in L- bzw. G-Kodierung stehen. */
const PARITY = [
  "LLLLLL","LLGLGG","LLGGLG","LLGGGL","LGLLGG",
  "LGGLLG","LGGGLL","LGLGLG","LGLGGL","LGGLGL",
];

export function eanCheckDigit(body) {
  let sum = 0;
  for (let i = body.length - 1, w = 3; i >= 0; i--, w = w === 3 ? 1 : 3) {
    sum += Number(body[i]) * w;
  }
  return (10 - (sum % 10)) % 10;
}

/** Strichmuster einer EAN-13 als Zeichenkette aus 95 Nullen und Einsen. */
export function ean13Pattern(ean) {
  const digits = String(ean).replace(/\D/g, "");
  if (digits.length !== 13) throw new Error(`EAN-13 erwartet, bekam: ${ean}`);
  if (eanCheckDigit(digits.slice(0, 12)) !== Number(digits[12])) {
    throw new Error(`Prüfziffer stimmt nicht: ${ean}`);
  }

  const parity = PARITY[Number(digits[0])];
  let out = "101"; // Startzeichen
  for (let i = 0; i < 6; i++) {
    const d = Number(digits[i + 1]);
    out += parity[i] === "L" ? L[d] : G[d];
  }
  out += "01010"; // Trennzeichen in der Mitte
  for (let i = 0; i < 6; i++) out += R[Number(digits[i + 7])];
  out += "101"; // Endzeichen
  return out;
}

/**
 * Schreibt ein Y4M-Video, das den Strichcode zeigt.
 *
 * @param {string} ean      13-stellige Nummer
 * @param {string} outPath  Zieldatei
 * @param {object} [opt]
 */
export function writeBarcodeY4m(ean, outPath, opt = {}) {
  const width = opt.width ?? 640;
  const height = opt.height ?? 480;
  const frames = opt.frames ?? 4;

  const pattern = ean13Pattern(ean);
  // Modulbreite so wählen, dass der Code etwa 70 % der Bildbreite einnimmt.
  const moduleW = Math.max(2, Math.floor((width * 0.7) / pattern.length));
  const codeW = moduleW * pattern.length;
  const codeH = Math.floor(height * 0.45);
  const x0 = Math.floor((width - codeW) / 2);
  const y0 = Math.floor((height - codeH) / 2);

  // Helligkeitsebene: weißer Hintergrund, schwarze Striche.
  const yPlane = Buffer.alloc(width * height, 235); // 235 = Weiß in Videopegeln
  for (let x = 0; x < codeW; x++) {
    if (pattern[Math.floor(x / moduleW)] !== "1") continue;
    for (let y = y0; y < y0 + codeH; y++) {
      yPlane[y * width + (x0 + x)] = 16; // 16 = Schwarz in Videopegeln
    }
  }
  // Farbebenen: neutral grau = farblos.
  const chroma = Buffer.alloc((width / 2) * (height / 2), 128);

  const header = Buffer.from(`YUV4MPEG2 W${width} H${height} F25:1 Ip A1:1 C420mpeg2\n`, "ascii");
  const frameTag = Buffer.from("FRAME\n", "ascii");
  const parts = [header];
  for (let i = 0; i < frames; i++) parts.push(frameTag, yPlane, chroma, chroma);

  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, Buffer.concat(parts));
  return { width, height, frames, moduleW, codeW, codeH, path: outPath };
}

/* Direkter Aufruf: node scripts/make-barcode-fixture.mjs <ean> <datei> */
if (process.argv[1] && process.argv[1].endsWith("make-barcode-fixture.mjs")) {
  const [, , ean, out] = process.argv;
  if (!ean || !out) {
    console.error("Aufruf: node scripts/make-barcode-fixture.mjs <ean13> <ausgabe.y4m>");
    process.exit(1);
  }
  const info = writeBarcodeY4m(ean, out);
  console.log(`geschrieben: ${info.path} (${info.width}x${info.height}, ${info.frames} Bilder)`);
}
