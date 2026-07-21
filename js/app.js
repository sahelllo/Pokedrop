/* PokéDrop – App-Logik
 *
 * Update-Ebenen:
 *  1. Jede Sekunde: Uhr + Countdowns (setInterval 1000 ms).
 *  2. Jede Minute: data/drops.json wird neu geladen; Änderungen erscheinen
 *     sofort bei allen Nutzern, ohne Reload.
 */

(function () {
  "use strict";

  let data = DROP_DATA;
  const FEED_URL = "data/drops.json";
  const FEED_INTERVAL_MS = 60000;

  const $ = (sel) => document.querySelector(sel);

  // ---- Set-Artworks (eigene, stilisierte Illustrationen – keine offiziellen Grafiken) ----

  const ART = {
    dunkelnacht:
      '<svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Stilisierte Nachthimmel-Illustration">' +
      '<defs><linearGradient id="g-dn" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#1a1038"/><stop offset="0.6" stop-color="#0d0a24"/><stop offset="1" stop-color="#05040f"/></linearGradient>' +
      '<radialGradient id="m-dn" cx="0.5" cy="0.5" r="0.5">' +
      '<stop offset="0.7" stop-color="#efe9ff"/><stop offset="1" stop-color="#b9a7f5"/></radialGradient></defs>' +
      '<rect width="640" height="240" fill="url(#g-dn)"/>' +
      '<circle cx="500" cy="86" r="52" fill="url(#m-dn)"/><circle cx="482" cy="74" r="46" fill="#0d0a24"/>' +
      '<circle cx="120" cy="60" r="2.5" fill="#cfc3ff"/><circle cx="210" cy="140" r="2" fill="#8f7fe0"/>' +
      '<circle cx="320" cy="50" r="2.5" fill="#cfc3ff"/><circle cx="90" cy="180" r="2" fill="#8f7fe0"/>' +
      '<circle cx="400" cy="180" r="2.5" fill="#cfc3ff"/><circle cx="580" cy="190" r="2" fill="#8f7fe0"/>' +
      '<circle cx="260" cy="100" r="1.6" fill="#6f5fc0"/><circle cx="560" cy="40" r="1.6" fill="#6f5fc0"/>' +
      '<path d="M0 240 L110 168 L200 208 L330 150 L470 205 L640 160 L640 240 Z" fill="#0a0819"/></svg>',
    partner:
      '<svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Stilisierte Illustration mit drei Farbkugeln">' +
      '<defs><linearGradient id="g-pt" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#12304a"/><stop offset="1" stop-color="#0b1a2c"/></linearGradient></defs>' +
      '<rect width="640" height="240" fill="url(#g-pt)"/>' +
      '<circle cx="200" cy="120" r="58" fill="#4caf6d" opacity="0.9"/>' +
      '<circle cx="320" cy="120" r="58" fill="#e2543f" opacity="0.9"/>' +
      '<circle cx="440" cy="120" r="58" fill="#3f7fd6" opacity="0.9"/>' +
      '<circle cx="182" cy="102" r="16" fill="#ffffff" opacity="0.35"/>' +
      '<circle cx="302" cy="102" r="16" fill="#ffffff" opacity="0.35"/>' +
      '<circle cx="422" cy="102" r="16" fill="#ffffff" opacity="0.35"/></svg>',
    tins:
      '<svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Stilisierte Metall-Illustration">' +
      '<defs><linearGradient id="g-tn" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#3a4358"/><stop offset="0.5" stop-color="#232a3c"/><stop offset="1" stop-color="#161b29"/></linearGradient>' +
      '<linearGradient id="s-tn" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#9fb2cf"/><stop offset="0.5" stop-color="#e6eefb"/><stop offset="1" stop-color="#8296b5"/></linearGradient></defs>' +
      '<rect width="640" height="240" fill="url(#g-tn)"/>' +
      '<path d="M320 40 L390 80 L390 160 L320 200 L250 160 L250 80 Z" fill="none" stroke="url(#s-tn)" stroke-width="10"/>' +
      '<path d="M480 90 L520 113 L520 159 L480 182 L440 159 L440 113 Z" fill="none" stroke="#5c6b88" stroke-width="6"/>' +
      '<path d="M160 90 L200 113 L200 159 L160 182 L120 159 L120 113 Z" fill="none" stroke="#5c6b88" stroke-width="6"/></svg>',
    jubilee:
      '<svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Stilisierte Jubiläums-Illustration mit der Zahl 30">' +
      '<defs><linearGradient id="g-jb" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#2a1e08"/><stop offset="1" stop-color="#120d04"/></linearGradient>' +
      '<linearGradient id="t-jb" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#ffe9a3"/><stop offset="0.5" stop-color="#f5c445"/><stop offset="1" stop-color="#b98a1d"/></linearGradient></defs>' +
      '<rect width="640" height="240" fill="url(#g-jb)"/>' +
      '<text x="320" y="164" text-anchor="middle" font-family="Arial, sans-serif" font-size="130" font-weight="800" fill="url(#t-jb)" letter-spacing="6">30</text>' +
      '<circle cx="150" cy="70" r="3" fill="#f5c445"/><circle cx="480" cy="52" r="3" fill="#ffe9a3"/>' +
      '<circle cx="540" cy="150" r="3" fill="#f5c445"/><circle cx="100" cy="170" r="3" fill="#b98a1d"/>' +
      '<circle cx="220" cy="40" r="2" fill="#ffe9a3"/><circle cx="420" cy="200" r="2" fill="#f5c445"/></svg>'
  };

  // ---- Formatierung ----

  const dateFmt = new Intl.DateTimeFormat("de-DE", {
    weekday: "short", day: "2-digit", month: "2-digit", year: "numeric"
  });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
    );
  }

  function shopsHtml(shops, cta) {
    return shops.map((s) =>
      '<a class="shop-row" href="' + esc(s.url) + '" target="_blank" rel="noopener">' +
      '<span class="shop-name">' + esc(s.name) + "</span>" +
      '<span class="shop-type">' + esc(s.type) + "</span>" +
      '<span class="shop-cta">' + cta + " →</span></a>"
    ).join("");
  }

  function infoHtml(info) {
    if (!info || !info.length) return "";
    return '<details class="more"><summary>Mehr Infos &amp; Quellen</summary><div class="more-body">' +
      info.map((l) =>
        '<a class="info-link" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " →</a>"
      ).join("") + "</div></details>";
  }

  // ---- Rendering ----

  function released(set) {
    return new Date(set.date).getTime() <= Date.now();
  }

  function artHtml(set) {
    return '<div class="art">' + (ART[set.art] || "") + "</div>";
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
      artHtml(current) +
      '<div class="hero-body">' +
      '<span class="hero-status">● Neu · ' + since + "</span>" +
      '<p class="drop-series">' + esc(current.series) + "</p>" +
      "<h1>" + esc(current.name) + "</h1>" +
      '<p class="hero-tagline">' + esc(current.tagline) + "</p>" +
      '<div class="products">' + current.products.map((p) =>
        '<span class="product-chip">' + esc(p.name) + " · <strong>" + esc(p.price) + "</strong></span>"
      ).join("") + "</div>" +
      '<p class="buy-label">Hier kaufen:</p>' +
      '<div class="stack-sm">' + shopsHtml(current.shops, "Zum Shop") + "</div>" +
      infoHtml(current.info) +
      "</div></div></div>";
  }

  function renderUpcoming() {
    const upcoming = data.sets.filter((s) => !released(s)).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
    $("#upcoming").innerHTML = upcoming.map((set) =>
      '<article class="drop-card">' +
      artHtml(set) +
      '<div class="drop-body">' +
      '<div class="drop-head"><div>' +
      '<p class="drop-series">' + esc(set.series) + "</p>" +
      "<h3>" + esc(set.name) + "</h3></div>" +
      '<span class="drop-date">' + dateFmt.format(new Date(set.date)) + "</span></div>" +
      '<div class="countdown" data-date="' + esc(set.date) + '" role="timer" aria-label="Countdown bis Release">' +
      cdCell("--", "Tage") + cdCell("--", "Std") + cdCell("--", "Min") + cdCell("--", "Sek") +
      "</div>" +
      '<details class="more"><summary>Details &amp; vorbestellen</summary><div class="more-body">' +
      '<p class="drop-tagline">' + esc(set.tagline) + "</p>" +
      '<ul class="facts">' + set.facts.map((f) => "<li>" + esc(f) + "</li>").join("") + "</ul>" +
      '<div class="stack-sm">' + shopsHtml(set.shops, "Verfügbarkeit prüfen") + "</div>" +
      (set.info || []).map((l) =>
        '<a class="info-link" href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + " →</a>"
      ).join("") +
      "</div></details>" +
      "</div></article>"
    ).join("");
  }

  function cdCell(num, label) {
    return '<div class="cd-cell"><span class="cd-num">' + num +
      '</span><span class="cd-label">' + label + "</span></div>";
  }

  function renderRetailers() {
    $("#retailers").innerHTML = shopsHtml(data.retailers, "Zum Shop")
      .replace(/class="shop-row"/g, 'class="shop-row shop-row-lg"');
    // Notizen ergänzen
    const rows = document.querySelectorAll("#retailers .shop-row");
    data.retailers.forEach((r, i) => {
      const note = document.createElement("span");
      note.className = "shop-note";
      note.textContent = r.note;
      rows[i].insertBefore(note, rows[i].querySelector(".shop-cta"));
    });
  }

  function renderFlyers() {
    $("#flyers").innerHTML = data.flyers.map((f) =>
      '<a class="shop-row shop-row-lg" href="' + esc(f.url) + '" target="_blank" rel="noopener">' +
      '<span class="shop-name">' + esc(f.name) + "</span>" +
      '<span class="shop-note">' + esc(f.note) + "</span>" +
      '<span class="shop-cta">Angebote suchen →</span></a>'
    ).join("");
  }

  function renderAll() {
    renderHero();
    renderUpcoming();
    renderRetailers();
    renderFlyers();
    tick();
  }

  // ---- Tabs ----

  document.querySelectorAll(".tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((b) => b.classList.toggle("active", b === btn));
      document.querySelectorAll(".tab-panel").forEach((p) =>
        p.classList.toggle("active", p.id === "panel-" + btn.dataset.tab)
      );
      window.scrollTo({ top: 0 });
    });
  });

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
      if (diff <= 0) { needsRerender = true; return; }
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

  // ---- Minuten-Feed ----

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
