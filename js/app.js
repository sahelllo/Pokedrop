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

  // ---- Set-Artworks: eigene Produkt-Illustrationen (Box, Pack, Tin) ----
  // Keine offiziellen Grafiken – nur Formen und Farbwelt des jeweiligen Sets.

  function productBox(uid, cfg) {
    // Display-Box mit Boosterpack davor, leichte 3D-Perspektive.
    return (
      '<defs>' +
      '<linearGradient id="bf-' + uid + '" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="' + cfg.boxTop + '"/><stop offset="1" stop-color="' + cfg.boxBottom + '"/></linearGradient>' +
      '<linearGradient id="pk-' + uid + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + cfg.packTop + '"/><stop offset="1" stop-color="' + cfg.packBottom + '"/></linearGradient>' +
      "</defs>" +
      '<ellipse cx="320" cy="208" rx="160" ry="14" fill="' + cfg.accent + '" opacity="0.16"/>' +
      // Box: Seite, Deckel, Front
      '<polygon points="400,66 436,52 436,182 400,196" fill="' + cfg.boxBottom + '" stroke="' + cfg.accent + '" stroke-opacity="0.35" stroke-width="1.5"/>' +
      '<polygon points="270,66 306,52 436,52 400,66" fill="' + cfg.boxTop + '" stroke="' + cfg.accent + '" stroke-opacity="0.35" stroke-width="1.5"/>' +
      '<rect x="270" y="66" width="130" height="130" fill="url(#bf-' + uid + ')" stroke="' + cfg.accent + '" stroke-opacity="0.5" stroke-width="1.5"/>' +
      cfg.motif +
      '<text x="335" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="12.5" font-weight="800" letter-spacing="1.5" fill="' + cfg.labelColor + '">' + cfg.label + "</text>" +
      // Boosterpack, leicht gedreht
      '<g transform="rotate(-7 234 148)">' +
      '<rect x="196" y="92" width="76" height="112" rx="6" fill="url(#pk-' + uid + ')" stroke="' + cfg.accent + '" stroke-opacity="0.55" stroke-width="1.5"/>' +
      '<rect x="196" y="92" width="76" height="14" rx="6" fill="' + cfg.accent + '" opacity="0.35"/>' +
      '<rect x="196" y="190" width="76" height="14" rx="6" fill="' + cfg.accent + '" opacity="0.35"/>' +
      '<circle cx="234" cy="148" r="20" fill="' + cfg.accent + '" opacity="0.5"/>' +
      '<circle cx="228" cy="141" r="6" fill="#ffffff" opacity="0.4"/>' +
      "</g>"
    );
  }

  function productTin(uid, cfg) {
    // Runde Metall-Tin mit Deckel.
    return (
      '<defs>' +
      '<linearGradient id="tb-' + uid + '" x1="0" y1="0" x2="1" y2="0">' +
      '<stop offset="0" stop-color="#77879f"/><stop offset="0.45" stop-color="#d9e3f2"/><stop offset="1" stop-color="#5d6c85"/></linearGradient>' +
      "</defs>" +
      '<ellipse cx="320" cy="208" rx="150" ry="14" fill="' + cfg.accent + '" opacity="0.16"/>' +
      '<rect x="252" y="76" width="136" height="122" fill="url(#tb-' + uid + ')"/>' +
      '<ellipse cx="320" cy="198" rx="68" ry="15" fill="#4b596f"/>' +
      '<ellipse cx="320" cy="76" rx="68" ry="16" fill="#e8eefb" stroke="#9fb0c9" stroke-width="2"/>' +
      '<ellipse cx="320" cy="76" rx="54" ry="11" fill="#c3cfe2"/>' +
      '<rect x="252" y="118" width="136" height="42" fill="' + cfg.accent + '" opacity="0.75"/>' +
      '<text x="320" y="145" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="800" letter-spacing="1.5" fill="#101522">' + cfg.label + "</text>"
    );
  }

  function makeArt(cfg) {
    const shape = cfg.tin ? productTin(cfg.uid, cfg) : productBox(cfg.uid, cfg);
    return (
      '<svg viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice" role="img" aria-label="' + cfg.alt + '">' +
      '<defs><linearGradient id="sc-' + cfg.uid + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="' + cfg.sceneTop + '"/><stop offset="1" stop-color="' + cfg.sceneBottom + '"/></linearGradient></defs>' +
      '<rect width="640" height="240" fill="url(#sc-' + cfg.uid + ')"/>' +
      cfg.scene + shape + "</svg>"
    );
  }

  const ART = {
    dunkelnacht: makeArt({
      uid: "dn",
      alt: "Stilisierte Produkt-Illustration: Booster-Box und Pack im Dunkelnacht-Look",
      sceneTop: "#1a1038", sceneBottom: "#05040f",
      scene:
        '<circle cx="540" cy="60" r="34" fill="#efe9ff"/><circle cx="528" cy="52" r="30" fill="#140d2e"/>' +
        '<circle cx="90" cy="50" r="2.5" fill="#cfc3ff"/><circle cx="150" cy="120" r="2" fill="#8f7fe0"/>' +
        '<circle cx="480" cy="170" r="2" fill="#8f7fe0"/><circle cx="590" cy="150" r="2.5" fill="#cfc3ff"/>' +
        '<circle cx="120" cy="200" r="2" fill="#6f5fc0"/>',
      boxTop: "#2c1a56", boxBottom: "#150c33", accent: "#b9a7f5", labelColor: "#e6ddff",
      label: "DUNKELNACHT",
      motif: '<circle cx="335" cy="118" r="26" fill="#efe9ff" opacity="0.9"/><circle cx="326" cy="111" r="22" fill="#1d1240"/>',
      packTop: "#3b2570", packBottom: "#1a0f3d"
    }),
    partner: makeArt({
      uid: "pt",
      alt: "Stilisierte Produkt-Illustration: Kollektions-Box mit drei Farbkugeln",
      sceneTop: "#12304a", sceneBottom: "#0b1a2c",
      scene:
        '<circle cx="100" cy="70" r="30" fill="#4caf6d" opacity="0.25"/>' +
        '<circle cx="560" cy="180" r="34" fill="#3f7fd6" opacity="0.25"/>' +
        '<circle cx="520" cy="60" r="24" fill="#e2543f" opacity="0.25"/>',
      boxTop: "#155a41", boxBottom: "#0a2e21", accent: "#7fd6a8", labelColor: "#dcf5e8",
      label: "FIRST PARTNER",
      motif:
        '<circle cx="305" cy="115" r="13" fill="#4caf6d"/><circle cx="335" cy="115" r="13" fill="#e2543f"/>' +
        '<circle cx="365" cy="115" r="13" fill="#3f7fd6"/>',
      packTop: "#1d6b4e", packBottom: "#0d3a29"
    }),
    tins: makeArt({
      uid: "tn",
      alt: "Stilisierte Produkt-Illustration: Metall-Tin-Dose",
      sceneTop: "#2c3346", sceneBottom: "#141928",
      scene:
        '<path d="M60 80 L92 98 L92 134 L60 152 L28 134 L28 98 Z" fill="none" stroke="#4c5a74" stroke-width="5"/>' +
        '<path d="M580 110 L608 126 L608 158 L580 174 L552 158 L552 126 Z" fill="none" stroke="#4c5a74" stroke-width="5"/>',
      accent: "#ffd60a",
      label: "MEGA FORCES",
      tin: true
    }),
    jubilee: makeArt({
      uid: "jb",
      alt: "Stilisierte Produkt-Illustration: goldene Jubiläums-Box 30 Jahre",
      sceneTop: "#2a1e08", sceneBottom: "#120d04",
      scene:
        '<circle cx="120" cy="60" r="3" fill="#f5c445"/><circle cx="520" cy="46" r="3" fill="#ffe9a3"/>' +
        '<circle cx="560" cy="170" r="3" fill="#f5c445"/><circle cx="80" cy="170" r="3" fill="#b98a1d"/>' +
        '<circle cx="180" cy="36" r="2" fill="#ffe9a3"/><circle cx="460" cy="205" r="2" fill="#f5c445"/>',
      boxTop: "#3d2c0d", boxBottom: "#1c1405", accent: "#f5c445", labelColor: "#ffe9a3",
      label: "30 JAHRE",
      motif: '<text x="335" y="132" text-anchor="middle" font-family="Arial, sans-serif" font-size="52" font-weight="800" fill="#f5c445">30</text>',
      packTop: "#4d380f", packBottom: "#241a06"
    })
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

  // ---- Hintergrund-Animation: schwebende Funken und Karten ----

  function initBackground() {
    const canvas = $("#bg");
    if (!canvas || !canvas.getContext) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    const FOIL = ["#6ecbff", "#a98bff", "#ff8fc4", "#ffd60a"];
    let w = 0, h = 0, dpr = 1, particles = [], raf = 0, last = 0;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      spawn();
    }

    function rnd(a, b) { return a + Math.random() * (b - a); }

    function spawn() {
      const count = Math.min(64, Math.round((w * h) / 22000));
      particles = [];
      for (let i = 0; i < count; i++) {
        const card = Math.random() < 0.28; // gut ein Viertel sind Karten, der Rest Funken
        particles.push({
          card: card,
          x: rnd(0, w),
          y: rnd(0, h),
          vy: card ? rnd(-14, -7) : rnd(-26, -10),
          vx: rnd(-4, 4),
          size: card ? rnd(10, 18) : rnd(1, 2.6),
          rot: rnd(0, Math.PI * 2),
          spin: rnd(-0.4, 0.4),
          color: card ? FOIL[i % FOIL.length] : (Math.random() < 0.5 ? "#ffd60a" : "#cfd6f2"),
          alpha: card ? rnd(0.08, 0.2) : rnd(0.25, 0.7),
          phase: rnd(0, Math.PI * 2)   // fürs Funkeln
        });
      }
    }

    function step(t) {
      const dt = Math.min((t - last) / 1000, 0.05);
      last = t;
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y += p.vy * dt;
        p.x += p.vx * dt;
        p.rot += p.spin * dt;
        p.phase += dt * 2;
        if (p.y < -30) { p.y = h + 30; p.x = rnd(0, w); }
        if (p.x < -30) p.x = w + 30;
        if (p.x > w + 30) p.x = -30;

        ctx.save();
        ctx.globalAlpha = p.alpha * (p.card ? 1 : 0.7 + 0.3 * Math.sin(p.phase));
        if (p.card) {
          // kleine schwebende Sammelkarte
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          const cw = p.size, ch = p.size * 1.4;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(-cw / 2, -ch / 2, cw, ch, 2.5);
          else ctx.rect(-cw / 2, -ch / 2, cw, ch);
          ctx.fill();
        } else {
          // Energie-Funke
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      raf = requestAnimationFrame(step);
    }

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { last = performance.now(); raf = requestAnimationFrame(step); }
    });

    window.addEventListener("resize", resize);
    resize();
    raf = requestAnimationFrame(step);
  }

  initBackground();
})();
