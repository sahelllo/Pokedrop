/* PokéDrop – App-Logik
 *
 * Zwei Update-Ebenen:
 *  1. Jede Sekunde: Uhr und alle Countdowns ticken (setInterval 1000 ms).
 *  2. Jede Minute: data/drops.json wird neu vom Server geladen. Ändert
 *     sich dort etwas (neuer Drop, neue Infos), wird die Seite sofort neu
 *     gerendert – ohne Reload. So erreichen Daten-Updates im Repo alle
 *     Nutzer automatisch.
 */

(function () {
  "use strict";

  let data = DROP_DATA; // eingebauter Fallback aus js/data.js
  const FEED_URL = "data/drops.json";
  const FEED_INTERVAL_MS = 60000;

  const $ = (sel) => document.querySelector(sel);

  // ---- Formatierung ----

  const dateFmt = new Intl.DateTimeFormat("de-DE", {
    weekday: "short", day: "2-digit", month: "2-digit", year: "numeric"
  });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  }

  function linksHtml(links) {
    return links.map((l) =>
      '<a class="link-out" href="' + esc(l.url) + '" target="_blank" rel="noopener">' +
      "<span>" + esc(l.label) + '</span><span class="arrow" aria-hidden="true">→</span></a>'
    ).join("");
  }

  // ---- Rendering ----

  function released(set) {
    return new Date(set.date).getTime() <= Date.now();
  }

  function renderHero() {
    const current = data.sets.filter(released).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    )[0];
    if (!current) { $("#hero").innerHTML = ""; return; }

    const days = Math.floor((Date.now() - new Date(current.date)) / 86400000);
    const since = days === 0 ? "heute erschienen"
      : days === 1 ? "seit gestern erhältlich"
      : "seit " + days + " Tagen erhältlich";

    $("#hero").innerHTML =
      '<div class="hero-card"><div class="hero-card-inner">' +
      '<span class="hero-status">● Neu · ' + since + "</span>" +
      '<p class="hero-series">' + esc(current.series) + "</p>" +
      "<h1>" + esc(current.name) + "</h1>" +
      '<p class="hero-tagline">' + esc(current.tagline) + "</p>" +
      '<ul class="facts">' + current.facts.map((f) => "<li>" + esc(f) + "</li>").join("") + "</ul>" +
      '<div class="products">' + current.products.map((p) =>
        '<span class="product-chip">' + esc(p.name) + " · <strong>" + esc(p.price) + "</strong></span>"
      ).join("") + "</div>" +
      '<div class="links">' + linksHtml(current.links) + "</div>" +
      "</div></div>";
  }

  function renderUpcoming() {
    const upcoming = data.sets.filter((s) => !released(s)).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    $("#upcoming").innerHTML = upcoming.map((set) =>
      '<article class="drop-card">' +
      '<div class="drop-head"><div>' +
      '<p class="drop-series">' + esc(set.series) + "</p>" +
      "<h3>" + esc(set.name) + "</h3></div>" +
      '<span class="drop-date">' + dateFmt.format(new Date(set.date)) + "</span></div>" +
      '<p class="drop-tagline">' + esc(set.tagline) + "</p>" +
      '<div class="countdown" data-date="' + esc(set.date) + '" role="timer" aria-label="Countdown bis Release">' +
      cdCell("--", "Tage") + cdCell("--", "Std") + cdCell("--", "Min") + cdCell("--", "Sek") +
      "</div>" +
      '<div class="drop-links">' + linksHtml(set.links) + "</div>" +
      "</article>"
    ).join("");
  }

  function cdCell(num, label) {
    return '<div class="cd-cell"><span class="cd-num">' + num +
      '</span><span class="cd-label">' + label + "</span></div>";
  }

  function renderRetailers() {
    $("#retailers").innerHTML = data.retailers.map((r) =>
      '<a class="retailer" href="' + esc(r.url) + '" target="_blank" rel="noopener">' +
      "<strong>" + esc(r.name) + "</strong><span>" + esc(r.note) + "</span>" +
      '<span class="goto">Zum Shop →</span></a>'
    ).join("");
  }

  function renderFlyers() {
    $("#flyers").innerHTML = data.flyers.map((f) =>
      '<a class="link-out" href="' + esc(f.url) + '" target="_blank" rel="noopener">' +
      "<span><strong>" + esc(f.name) + "</strong> – " + esc(f.note) +
      '</span><span class="arrow" aria-hidden="true">→</span></a>'
    ).join("");
  }

  function renderAll() {
    renderHero();
    renderUpcoming();
    renderRetailers();
    renderFlyers();
    tick();
  }

  // ---- Sekunden-Ticker: Uhr + Countdowns ----

  const timeFmt = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit", minute: "2-digit", second: "2-digit"
  });

  function tick() {
    const now = new Date();
    const clock = $("#clock");
    clock.textContent = timeFmt.format(now) + " Uhr";
    clock.setAttribute("datetime", now.toISOString());

    let needsRerender = false;
    document.querySelectorAll(".countdown").forEach((el) => {
      let diff = new Date(el.dataset.date) - now;
      if (diff <= 0) { needsRerender = true; return; } // Release erreicht → Hero neu aufbauen
      const d = Math.floor(diff / 86400000); diff -= d * 86400000;
      const h = Math.floor(diff / 3600000); diff -= h * 3600000;
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff - m * 60000) / 1000);
      const nums = el.querySelectorAll(".cd-num");
      nums[0].textContent = d;
      nums[1].textContent = String(h).padStart(2, "0");
      nums[2].textContent = String(m).padStart(2, "0");
      nums[3].textContent = String(s).padStart(2, "0");
    });
    if (needsRerender) renderAll();
  }

  setInterval(tick, 1000);

  // ---- Minuten-Feed: Daten automatisch aktualisieren ----

  function setStatus(extra) {
    const stand = new Date(data.lastUpdated).toLocaleString("de-DE", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
    $("#update-status").innerHTML =
      "Datenstand: " + stand + " Uhr · prüft automatisch jede Minute auf Updates" +
      (extra ? ' · <span class="fresh">' + extra + "</span>" : "");
  }

  async function checkFeed() {
    try {
      const res = await fetch(FEED_URL + "?t=" + Date.now(), { cache: "no-store" });
      if (!res.ok) return;
      const fresh = await res.json();
      if (fresh.lastUpdated !== data.lastUpdated) {
        data = fresh;
        renderAll();
        setStatus("gerade aktualisiert");
      } else {
        setStatus();
      }
    } catch (_) {
      /* offline oder Feed nicht erreichbar – eingebaute Daten bleiben aktiv */
      setStatus();
    }
  }

  // ---- Start ----

  renderAll();
  setStatus();
  checkFeed();
  setInterval(checkFeed, FEED_INTERVAL_MS);

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
