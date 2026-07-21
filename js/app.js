/* PokéDrop – App-Logik */

(function () {
  "use strict";

  const state = {
    position: null,        // { lat, lng, label }
    radiusKm: 10,
    activeChain: "all",
    onlyAvailable: true,
    onlyNew: false,
    markets: []            // Märkte mit berechneten Koordinaten + Distanz
  };

  // --- DOM ---
  const $ = (sel) => document.querySelector(sel);
  const resultsEl = $("#results");
  const emptyStateEl = $("#empty-state");
  const locationTextEl = $("#location-text");
  const locationDotEl = $("#location-dot");
  const radiusInput = $("#radius");
  const radiusValueEl = $("#radius-value");
  const chainFiltersEl = $("#chain-filters");
  const dialog = $("#drop-dialog");
  const dialogContent = $("#drop-dialog-content");

  // --- Geo-Helfer ---

  function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const toRad = (d) => (d * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(a));
  }

  /* Verschiebt eine Position um [Ost, Nord] in km – für die Demo-Märkte. */
  function offsetPosition(lat, lng, eastKm, northKm) {
    const dLat = northKm / 111.32;
    const dLng = eastKm / (111.32 * Math.cos((lat * Math.PI) / 180));
    return { lat: lat + dLat, lng: lng + dLng };
  }

  function buildMarkets() {
    const { lat, lng } = state.position;
    state.markets = DEMO_MARKETS.map((m) => {
      const pos = offsetPosition(lat, lng, m.offsetKm[0], m.offsetKm[1]);
      return {
        ...m,
        lat: pos.lat,
        lng: pos.lng,
        distanceKm: haversineKm(lat, lng, pos.lat, pos.lng)
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }

  // --- Standort ---

  function setLocationStatus(mode, text) {
    locationDotEl.className = "dot " + mode;
    locationTextEl.textContent = text;
  }

  function locate() {
    if (!("geolocation" in navigator)) {
      startDemo("Gerät unterstützt kein GPS – Demo-Standort aktiv");
      return;
    }
    setLocationStatus("dot-wait", "Standort wird ermittelt …");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        state.position = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: "Dein Standort"
        };
        setLocationStatus("dot-on", "Standort aktiv");
        refresh();
      },
      () => {
        startDemo("Standort abgelehnt – Demo-Standort aktiv");
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  }

  function startDemo(statusText) {
    state.position = { ...FALLBACK_POSITION };
    setLocationStatus("dot-on", statusText || "Demo-Standort aktiv");
    refresh();
  }

  // --- Rendering ---

  function formatPrice(p) {
    return p.toFixed(2).replace(".", ",") + " €";
  }

  function formatDateRange(from, to) {
    const fmt = (iso) => {
      const d = new Date(iso + "T00:00:00");
      return d.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" });
    };
    return from === to ? "nur am " + fmt(from) : fmt(from) + " – " + fmt(to);
  }

  function chipHtml(key, label, active) {
    return (
      '<button class="chip' + (active ? " active" : "") + '" data-chain="' +
      key + '">' + label + "</button>"
    );
  }

  function renderChainFilters() {
    const chainsInRange = new Set(
      state.markets
        .filter((m) => m.distanceKm <= state.radiusKm)
        .map((m) => m.chain)
    );
    let html = chipHtml("all", "Alle Märkte", state.activeChain === "all");
    for (const key of Object.keys(CHAINS)) {
      if (chainsInRange.has(key)) {
        html += chipHtml(key, CHAINS[key].name, state.activeChain === key);
      }
    }
    chainFiltersEl.innerHTML = html;
  }

  function filteredDrops(market) {
    return market.drops.filter((d) => {
      if (state.onlyAvailable && !d.available) return false;
      if (state.onlyNew && !d.isNew) return false;
      return true;
    });
  }

  function renderMarkets() {
    const visible = state.markets.filter((m) => {
      if (m.distanceKm > state.radiusKm) return false;
      if (state.activeChain !== "all" && m.chain !== state.activeChain) return false;
      return filteredDrops(m).length > 0;
    });

    if (!state.position) return;

    if (visible.length === 0) {
      resultsEl.innerHTML =
        '<div class="empty-state"><div class="empty-icon">😢</div>' +
        "<p>Keine Pokémon-Drops im Umkreis von " + state.radiusKm + " km gefunden.</p>" +
        '<p class="hint">Vergrößere den Umkreis oder ändere die Filter.</p></div>';
      return;
    }

    let html = "";
    for (const m of visible) {
      const chain = CHAINS[m.chain];
      const drops = filteredDrops(m);
      html +=
        '<article class="market-card">' +
        '<div class="market-header">' +
        '<div class="market-logo" style="background:' + chain.color +
        (chain.textColor ? ";color:" + chain.textColor : "") + '">' +
        chain.name + "</div>" +
        '<div class="market-info"><h2>' + m.branch + "</h2>" +
        '<div class="address">' + m.address + "</div></div>" +
        '<div class="market-distance">' + m.distanceKm.toFixed(1).replace(".", ",") +
        " km</div></div>";

      for (const d of drops) {
        html +=
          '<div class="drop" data-market="' + m.id + '" data-drop="' + d.id + '">' +
          '<div class="drop-emoji">' + d.emoji + "</div>" +
          '<div class="drop-body"><div class="drop-title">' + d.title +
          (d.isNew ? ' <span class="badge badge-new">Neu</span>' : "") +
          (!d.available ? ' <span class="badge badge-out">Ausverkauft</span>' : "") +
          "</div>" +
          '<div class="drop-meta">' + formatDateRange(d.validFrom, d.validTo) + "</div></div>" +
          '<div class="drop-price">' + formatPrice(d.price) + "</div></div>";
      }

      html += "</article>";
    }
    resultsEl.innerHTML = html;
  }

  function refresh() {
    if (!state.position) return;
    buildMarkets();
    renderChainFilters();
    renderMarkets();
    $("#last-update").textContent =
      "Stand: " + new Date().toLocaleString("de-DE", {
        day: "2-digit", month: "2-digit", year: "numeric",
        hour: "2-digit", minute: "2-digit"
      }) + " Uhr";
  }

  function showDropDialog(marketId, dropId) {
    const market = state.markets.find((m) => m.id === marketId);
    if (!market) return;
    const drop = market.drops.find((d) => d.id === dropId);
    if (!drop) return;
    const chain = CHAINS[market.chain];

    dialogContent.innerHTML =
      "<h3>" + drop.emoji + " " + drop.title + "</h3>" +
      "<p><strong>" + formatPrice(drop.price) + "</strong></p>" +
      "<p>🏪 " + chain.name + " – " + market.branch + ", " + market.address + "</p>" +
      "<p>📍 Entfernung: " + market.distanceKm.toFixed(1).replace(".", ",") + " km</p>" +
      "<p>🗓️ Aktionszeitraum: " + formatDateRange(drop.validFrom, drop.validTo) + "</p>" +
      "<p>" + (drop.available ? "✅ Verfügbar" : "❌ Aktuell ausverkauft") + "</p>" +
      (drop.note ? '<p class="hint">ℹ️ ' + drop.note + "</p>" : "");
    dialog.showModal();
  }

  // --- Events ---

  $("#btn-locate").addEventListener("click", locate);
  $("#btn-demo").addEventListener("click", () => startDemo());
  $("#btn-refresh").addEventListener("click", () => {
    if (state.position) refresh();
    else locate();
  });

  radiusInput.addEventListener("input", () => {
    state.radiusKm = Number(radiusInput.value);
    radiusValueEl.textContent = state.radiusKm + " km";
    if (state.position) {
      renderChainFilters();
      renderMarkets();
    }
  });

  chainFiltersEl.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    state.activeChain = chip.dataset.chain;
    renderChainFilters();
    renderMarkets();
  });

  $("#filter-available").addEventListener("change", (e) => {
    state.onlyAvailable = e.target.checked;
    renderMarkets();
  });

  $("#filter-new").addEventListener("change", (e) => {
    state.onlyNew = e.target.checked;
    renderMarkets();
  });

  resultsEl.addEventListener("click", (e) => {
    const dropEl = e.target.closest(".drop");
    if (dropEl) showDropDialog(dropEl.dataset.market, dropEl.dataset.drop);
  });

  $("#btn-close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });

  // --- Service Worker (PWA / offline) ---
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {
        /* Offline-Modus ist optional – Fehler hier nicht kritisch. */
      });
    });
  }
})();
