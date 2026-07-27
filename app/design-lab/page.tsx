"use client";

/**
 * Design-Labor: derselbe Live-Feed in drei Gestaltungswelten,
 * jeweils in Handy-Breite (390 px). Dient dem Vergleich vor der Entscheidung.
 * Diese Seite wird nach der Entscheidung wieder entfernt.
 */

import * as React from "react";
import { Flame, MapPin, Clock, ShieldCheck, TrendingDown } from "lucide-react";

interface Deal {
  produkt: string;
  set: string;
  haendler: string;
  ort: string;
  km: number;
  preis: number;
  uvp: number;
  tage: number;
  verifiziert: boolean;
  dex: number;
}

const DEALS: Deal[] = [
  { produkt: "Dunkelnacht – 36er Display", set: "Mega-Entwicklung", haendler: "Kaufland", ort: "Oberhausen", km: 3.4, preis: 149, uvp: 179.99, tage: 6, verifiziert: true, dex: 94 },
  { produkt: "Reisegefährten – Top-Trainer-Box", set: "Reisegefährten", haendler: "Scheck-in", ort: "Ludwigsburg", km: 331, preis: 42.99, uvp: 54.99, tage: 4, verifiziert: true, dex: 658 },
  { produkt: "Zeitlose Rivalen – 3er-Blister", set: "Zeitlose Rivalen", haendler: "Rossmann", ort: "Essen", km: 11, preis: 11.99, uvp: 14.99, tage: 7, verifiziert: true, dex: 25 },
  { produkt: "Pokémon 151 – Ultra-Premium", set: "Karmesin & Purpur", haendler: "Müller", ort: "Köln", km: 59, preis: 164.99, uvp: 229, tage: 9, verifiziert: false, dex: 151 },
];

const art = (dex: number) =>
  `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${dex}.png`;

const euro = (n: number) => n.toFixed(2).replace(".", ",") + " €";
const rabatt = (d: Deal) => Math.round(((d.uvp - d.preis) / d.uvp) * 100);

export default function DesignLab() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "#0a0a0f", padding: 24, overflow: "auto" }}>
      <div style={{ display: "flex", gap: 28, alignItems: "flex-start", justifyContent: "center", flexWrap: "nowrap" }}>
        <Frame title="A · RADAR"><VariantRadar /></Frame>
        <Frame title="B · TERMINAL"><VariantTerminal /></Frame>
        <Frame title="C · VAULT"><VariantVault /></Frame>
      </div>
    </div>
  );
}

function Frame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ color: "#8b8b9e", font: "700 12px ui-monospace, monospace", letterSpacing: 2, marginBottom: 10, textAlign: "center" }}>
        {title}
      </p>
      <div
        style={{
          width: 390,
          height: 780,
          overflow: "hidden",
          borderRadius: 28,
          border: "1px solid #23233a",
          boxShadow: "0 24px 60px -30px rgba(0,0,0,.9)",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ==================================================================== */
/*  A · RADAR – Ortungsgerät                                            */
/* ==================================================================== */
function VariantRadar() {
  return (
    <div style={{ height: "100%", background: "#04070d", color: "#dcf5e6", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
      {/* Radarkopf */}
      <div style={{ position: "relative", height: 148, borderBottom: "1px solid #0d2a1c", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 120%, rgba(0,255,140,.16), transparent 62%)" }} />
        {[46, 88, 130].map((r) => (
          <div key={r} style={{ position: "absolute", left: "50%", bottom: -14, width: r * 2, height: r * 2, marginLeft: -r, border: "1px solid rgba(0,255,140,.16)", borderRadius: "50%" }} />
        ))}
        <div style={{ position: "absolute", left: "50%", bottom: -14, width: 2, height: 132, background: "linear-gradient(to top, rgba(0,255,140,.75), transparent)", transformOrigin: "bottom center", transform: "rotate(38deg)" }} />
        {/* Pings */}
        {[[122, 52], [268, 88], [196, 34], [300, 116]].map(([x, y], i) => (
          <span key={i} style={{ position: "absolute", left: x, top: y, width: 7, height: 7, borderRadius: "50%", background: "#00ff8c", boxShadow: "0 0 12px 3px rgba(0,255,140,.55)" }} />
        ))}
        <div style={{ position: "absolute", left: 16, top: 14 }}>
          <p style={{ margin: 0, font: "700 11px ui-monospace, monospace", letterSpacing: 3, color: "#00ff8c" }}>◉ RADAR AKTIV</p>
          <p style={{ margin: "4px 0 0", font: "800 26px system-ui", letterSpacing: -1 }}>4 Treffer</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#5c9c7d" }}>Oberhausen · 500 km</p>
        </div>
      </div>

      {/* Trefferliste */}
      <div style={{ padding: 12, display: "grid", gap: 10 }}>
        {DEALS.map((d, i) => {
          const füllung = Math.max(0, 1 - d.km / 500);
          return (
            <div key={i} style={{ position: "relative", display: "flex", gap: 11, padding: 11, borderRadius: 14, background: "linear-gradient(90deg, rgba(0,255,140,.05), transparent)", border: "1px solid #10301f" }}>
              {/* Distanz-Ring */}
              <div style={{ position: "relative", width: 52, height: 52, flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: `conic-gradient(#00ff8c ${füllung * 360}deg, #10301f 0)` }} />
                <div style={{ position: "absolute", inset: 3, borderRadius: "50%", background: "#04070d", display: "grid", placeItems: "center" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={art(d.dex)} alt="" style={{ width: 34, height: 34, objectFit: "contain" }} />
                </div>
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <p style={{ margin: 0, font: "700 13px system-ui", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.produkt}</p>
                <p style={{ margin: "2px 0 0", font: "600 11px ui-monospace, monospace", color: "#00ff8c", letterSpacing: 1 }}>
                  {d.km < 10 ? `${d.km.toFixed(1)} KM` : `${Math.round(d.km)} KM`} · {d.haendler.toUpperCase()}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 7, marginTop: 5 }}>
                  <span style={{ font: "800 18px ui-monospace, monospace" }}>{euro(d.preis)}</span>
                  <span style={{ fontSize: 11, color: "#4e7d66", textDecoration: "line-through" }}>{euro(d.uvp)}</span>
                  <span style={{ marginLeft: "auto", font: "700 11px ui-monospace, monospace", color: "#04070d", background: "#00ff8c", padding: "2px 6px", borderRadius: 4 }}>−{rabatt(d)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==================================================================== */
/*  B · TERMINAL – Handelsterminal                                      */
/* ==================================================================== */
function VariantTerminal() {
  const hitze = (p: number) => (p >= 25 ? "#ff2d55" : p >= 15 ? "#ff8a3d" : p >= 5 ? "#ffd60a" : "#4aa3ff");
  return (
    <div style={{ height: "100%", background: "#000", color: "#e8e8ef", fontFamily: "ui-monospace, SFMono-Regular, monospace", overflow: "hidden" }}>
      {/* Ticker */}
      <div style={{ borderBottom: "1px solid #1a1a22", padding: "7px 12px", fontSize: 10, letterSpacing: 1.2, color: "#6f6f85", display: "flex", gap: 18, whiteSpace: "nowrap", overflow: "hidden" }}>
        <span style={{ color: "#ff2d55" }}>▲ DUNKELNACHT −17%</span>
        <span style={{ color: "#4aa3ff" }}>▼ 151 UPC +2%</span>
        <span style={{ color: "#ffd60a" }}>◆ 81 AKTIV</span>
      </div>
      <div style={{ padding: "14px 12px 10px" }}>
        <p style={{ margin: 0, fontSize: 10, letterSpacing: 3, color: "#6f6f85" }}>DEAL TERMINAL / OBERHAUSEN / 500KM</p>
        <p style={{ margin: "6px 0 0", font: "800 30px ui-monospace, monospace", letterSpacing: -1.5 }}>
          81<span style={{ fontSize: 14, color: "#6f6f85", marginLeft: 8 }}>ANGEBOTE</span>
        </p>
      </div>
      {/* Spaltenkopf */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 62px 52px", gap: 8, padding: "6px 12px", borderTop: "1px solid #1a1a22", borderBottom: "1px solid #1a1a22", fontSize: 9, letterSpacing: 1.5, color: "#55556a" }}>
        <span>PRODUKT / HÄNDLER</span><span style={{ textAlign: "right" }}>PREIS</span><span style={{ textAlign: "right" }}>Δ UVP</span>
      </div>
      {/* Zeilen */}
      {DEALS.map((d, i) => {
        const p = rabatt(d);
        return (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 62px 52px", gap: 8, padding: "11px 12px", borderBottom: "1px solid #121218", alignItems: "center" }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "system-ui" }}>{d.produkt}</p>
              <p style={{ margin: "3px 0 0", fontSize: 10, color: "#6f6f85", letterSpacing: .5 }}>
                {d.haendler.toUpperCase()} · {d.ort.toUpperCase()} · {d.km < 10 ? d.km.toFixed(1) : Math.round(d.km)}KM
              </p>
              {/* Hitze-Balken */}
              <div style={{ marginTop: 6, height: 3, background: "#16161d", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${Math.min(100, p * 3.4)}%`, height: "100%", background: hitze(p) }} />
              </div>
            </div>
            <span style={{ textAlign: "right", fontSize: 14, fontWeight: 700 }}>{d.preis.toFixed(2).replace(".", ",")}</span>
            <span style={{ textAlign: "right", fontSize: 12, fontWeight: 700, color: hitze(p) }}>−{p}%</span>
          </div>
        );
      })}
    </div>
  );
}

/* ==================================================================== */
/*  C · VAULT – Sammelkarten-Tresor                                     */
/* ==================================================================== */
function VariantVault() {
  const stufe = (p: number) => (p >= 25 ? { t: "LEGENDÄR", c: "#ffb800" } : p >= 15 ? { t: "SELTEN", c: "#c77dff" } : { t: "SOLIDE", c: "#6ec9ff" });
  return (
    <div style={{ height: "100%", background: "linear-gradient(170deg,#141220,#1c1830 55%,#120f1c)", color: "#f0ecff", fontFamily: "system-ui, sans-serif", overflow: "hidden" }}>
      <div style={{ padding: "18px 16px 12px" }}>
        <p style={{ margin: 0, fontSize: 10, letterSpacing: 4, color: "#ffb800", fontWeight: 700 }}>◆ DER TRESOR</p>
        <p style={{ margin: "6px 0 0", font: "800 27px system-ui", letterSpacing: -1 }}>4 Funde</p>
        <p style={{ margin: "3px 0 0", fontSize: 12, color: "#9a92bd" }}>in deinem Umkreis</p>
      </div>
      <div style={{ padding: "0 16px", display: "grid", gap: 13 }}>
        {DEALS.slice(0, 3).map((d, i) => {
          const s = stufe(rabatt(d));
          return (
            <div key={i} style={{ position: "relative", borderRadius: 18, padding: 2, background: `linear-gradient(135deg, ${s.c}, transparent 45%, ${s.c}55)`, transform: i === 0 ? "perspective(900px) rotateX(2deg) rotateY(-3deg)" : undefined }}>
              <div style={{ borderRadius: 16, background: "linear-gradient(150deg,#221d38,#191430)", padding: 13, position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, transparent 30%, rgba(255,255,255,.10) 48%, transparent 62%)" }} />
                <div style={{ position: "relative", display: "flex", gap: 12 }}>
                  <div style={{ width: 68, height: 92, borderRadius: 9, background: "radial-gradient(circle at 50% 30%, rgba(255,255,255,.12), transparent 70%), #2c2547", display: "grid", placeItems: "center", border: `1px solid ${s.c}44`, flexShrink: 0 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={art(d.dex)} alt="" style={{ width: 52, height: 52, objectFit: "contain" }} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: 1.8, color: s.c }}>{s.t}</span>
                    <p style={{ margin: "4px 0 0", font: "700 14px system-ui", lineHeight: 1.25 }}>{d.produkt}</p>
                    <p style={{ margin: "3px 0 0", fontSize: 11, color: "#9a92bd" }}>{d.haendler} · {d.ort} · {d.km < 10 ? d.km.toFixed(1) : Math.round(d.km)} km</p>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 8 }}>
                      <span style={{ font: "800 21px system-ui", letterSpacing: -.5 }}>{euro(d.preis)}</span>
                      <span style={{ fontSize: 11, color: "#7d7599", textDecoration: "line-through" }}>{euro(d.uvp)}</span>
                    </div>
                    <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 5, background: `${s.c}22`, border: `1px solid ${s.c}55`, color: s.c, borderRadius: 99, padding: "3px 9px", fontSize: 10, fontWeight: 700 }}>
                      <TrendingDown size={11} /> {rabatt(d)}% unter UVP
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
