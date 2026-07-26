-- ============================================================================
-- PokeDrop – KOMPLETT-SETUP für Supabase
--
-- Diese eine Datei richtet alles ein:
--   1. Tabellen, Constraints, Indizes
--   2. Deal-Bewertung, Radius-Suche, Sicherheitsregeln
--   3. Beispieldaten (Händler, Filialen, Produkte, Events)
--
-- Anwendung: kompletten Inhalt kopieren, in Supabase unter
-- "SQL Editor" einfügen und auf RUN klicken. Mehrfaches Ausführen
-- ist unschädlich.
-- ============================================================================

-- ############### TEIL 1 von 3: Tabellen ###############
-- ============================================================================
-- PokeDrop – Migration 0001: Grundschema
-- Postgres 15+ mit PostGIS. Idempotent & reproduzierbar.
-- Geld immer numeric(10,2) (nie float). Zeiten immer timestamptz (UTC).
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------------- Enums ----
DO $$ BEGIN
  CREATE TYPE retailer_status   AS ENUM ('A','B','C');
  CREATE TYPE retailer_kind     AS ENUM ('online','stationaer','beides');
  CREATE TYPE product_category  AS ENUM (
    'Booster','Booster Bundle','Display','ETB','Tin','Mini Tin',
    'Collection','Premium Collection','Bundle','Blister');
  CREATE TYPE product_language  AS ENUM ('Deutsch','Englisch','Japanisch');
  CREATE TYPE availability_kind AS ENUM ('aktuell','out_of_print','aeltere_kollektion','sonderprodukt');
  CREATE TYPE validity_kind     AS ENUM ('NATIONAL','REGIONAL','STORE_GROUP','LOCAL','ONLINE');
  CREATE TYPE verification_kind AS ENUM ('VERIFIED','REGIONAL_CONFIRMED','PROBABLE','COMMUNITY_UNVERIFIED');
  CREATE TYPE stock_signal_kind AS ENUM ('verfuegbar','wenig_bestand','ausverkauft');
  CREATE TYPE drop_kind         AS ENUM ('drop','restock','new_product');
  CREATE TYPE drop_status       AS ENUM ('angekuendigt','live','vorbei');
  CREATE TYPE rumor_status      AS ENUM ('RUMOR','MULTI_SOURCE_RUMOR','LIKELY','CONFIRMED');
  CREATE TYPE event_kind        AS ENUM (
    'Tauschbörse','Card Show','Sammelkartenmesse','Community-Treffen','Turnier','Sammlerbörse');
  CREATE TYPE event_verification AS ENUM ('bestaetigt','wahrscheinlich','unbestaetigt','abgesagt');
  CREATE TYPE alert_mode        AS ENUM ('uvp','wunschpreis','restock');
  CREATE TYPE alert_scope       AS ENUM ('lokal','deutschlandweit');
  CREATE TYPE subscription_tier AS ENUM ('free','premium');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- --------------------------------------------------------- Hilfsfunktion ---
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------- Profile -----
CREATE TABLE IF NOT EXISTS profiles (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id  uuid UNIQUE,
  display_name  text NOT NULL CHECK (length(trim(display_name)) > 0),
  avatar_url    text,
  role          text NOT NULL DEFAULT 'user' CHECK (role IN ('user','moderator','admin')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz
);

CREATE TABLE IF NOT EXISTS user_settings (
  profile_id    uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  home_location geography(Point,4326),
  home_label    text,
  radius_km     integer NOT NULL DEFAULT 100 CHECK (radius_km > 0 AND radius_km <= 2000),
  notify_push   boolean NOT NULL DEFAULT true,
  notify_email  boolean NOT NULL DEFAULT false,
  language      text NOT NULL DEFAULT 'de',
  theme         text NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark','light')),
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------- Händler & Filialen ------
CREATE TABLE IF NOT EXISTS retailers (
  id              uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_group  text NOT NULL,
  retailer_brand  text NOT NULL,
  display_name    text NOT NULL,
  status          retailer_status NOT NULL DEFAULT 'C',
  kind            retailer_kind   NOT NULL DEFAULT 'stationaer',
  crawler_tier    smallint NOT NULL DEFAULT 3 CHECK (crawler_tier BETWEEN 1 AND 3),
  regionality     text,
  website         text,
  logo_url        text,
  brand_color     text,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT retailers_brand_uniq UNIQUE (retailer_group, retailer_brand)
);

CREATE TABLE IF NOT EXISTS retailer_locations (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  retailer_id       uuid NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  external_store_id text,
  regional_company  text,
  store_name        text NOT NULL,
  street            text,
  postal_code       text,
  city              text NOT NULL,
  location          geography(Point,4326) NOT NULL,
  opening_hours     jsonb,
  is_active         boolean NOT NULL DEFAULT true,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT retailer_locations_ext_uniq UNIQUE (retailer_id, external_store_id)
);

-- ------------------------------------------------ Sets & Produkte ----------
CREATE TABLE IF NOT EXISTS product_sets (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  set_code     text UNIQUE,
  set_name     text NOT NULL,
  series       text,
  release_date date,
  language     product_language NOT NULL DEFAULT 'Deutsch',
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id                  uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                text UNIQUE NOT NULL,
  product_name        text NOT NULL,
  set_id              uuid REFERENCES product_sets(id) ON DELETE SET NULL,
  category            product_category NOT NULL,
  ean                 text UNIQUE,
  sku                 text,
  language            product_language NOT NULL DEFAULT 'Deutsch',
  release_date        date NOT NULL,
  -- Preisreferenzen (Masterliste 11)
  reference_uvp          numeric(10,2) NOT NULL CHECK (reference_uvp >= 0),
  uvp_source             text,
  market_reference_price numeric(10,2) NOT NULL CHECK (market_reference_price >= 0),
  good_deal_threshold    numeric(10,2) CHECK (good_deal_threshold  >= 0),
  great_deal_threshold   numeric(10,2) CHECK (great_deal_threshold >= 0),
  price_reference_updated_at timestamptz,
  availability_status availability_kind NOT NULL DEFAULT 'aktuell',
  pokemon_artwork_id  integer CHECK (pokemon_artwork_id > 0),
  image_url           text,
  energy_type         text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now(),
  -- Great-Deal muss immer günstiger (oder gleich) Good-Deal sein
  CONSTRAINT products_threshold_order CHECK (
    good_deal_threshold IS NULL OR great_deal_threshold IS NULL
    OR great_deal_threshold <= good_deal_threshold)
);

-- ----------------------------------------------------------- Angebote ------
CREATE TABLE IF NOT EXISTS offers (
  id                uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id        uuid NOT NULL REFERENCES products(id)  ON DELETE CASCADE,
  retailer_id       uuid NOT NULL REFERENCES retailers(id) ON DELETE CASCADE,
  price             numeric(10,2) NOT NULL CHECK (price >= 0),
  regular_price     numeric(10,2) CHECK (regular_price >= 0),
  currency          char(3) NOT NULL DEFAULT 'EUR',
  valid_from        date NOT NULL,
  valid_until       date NOT NULL,
  validity_type     validity_kind NOT NULL,
  source_type       text,
  source_url        text,
  verification_status verification_kind NOT NULL DEFAULT 'PROBABLE',
  stock_signal      stock_signal_kind,
  stock_signal_at   timestamptz,
  seen_at           timestamptz NOT NULL DEFAULT now(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT offers_valid_range CHECK (valid_until >= valid_from),
  -- ONLINE-Angebote brauchen keine Filiale; alle anderen schon (siehe Trigger)
  CONSTRAINT offers_online_has_no_store CHECK (true)
);

-- Teilnehmende Filialen (Masterliste 6: participating_store_ids)
CREATE TABLE IF NOT EXISTS offer_locations (
  offer_id    uuid NOT NULL REFERENCES offers(id)             ON DELETE CASCADE,
  location_id uuid NOT NULL REFERENCES retailer_locations(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, location_id)
);

-- ------------------------------------------------- Drops / Rumors / Events -
CREATE TABLE IF NOT EXISTS drops (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   uuid NOT NULL REFERENCES products(id)  ON DELETE CASCADE,
  retailer_id  uuid REFERENCES retailers(id)          ON DELETE SET NULL,
  location_id  uuid REFERENCES retailer_locations(id) ON DELETE SET NULL,
  kind         drop_kind   NOT NULL,
  status       drop_status NOT NULL DEFAULT 'live',
  is_pokemon_center boolean NOT NULL DEFAULT false,
  price        numeric(10,2) CHECK (price >= 0),
  availability stock_signal_kind NOT NULL DEFAULT 'verfuegbar',
  hot          boolean NOT NULL DEFAULT false,
  source_name  text,
  source_url   text,
  confidence   numeric(3,2) NOT NULL DEFAULT 1.0 CHECK (confidence BETWEEN 0 AND 1),
  drop_at      timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rumors (
  id           uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id   uuid REFERENCES products(id) ON DELETE SET NULL,
  title        text NOT NULL,
  body         text,
  status       rumor_status NOT NULL DEFAULT 'RUMOR',
  source_type  text,
  source_handle text,
  source_count integer NOT NULL DEFAULT 1 CHECK (source_count >= 1),
  confidence   numeric(3,2) NOT NULL DEFAULT 0.3 CHECK (confidence BETWEEN 0 AND 1),
  posted_at    timestamptz NOT NULL DEFAULT now(),
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name    text NOT NULL,
  event_type    event_kind NOT NULL,
  date_start    date NOT NULL,
  date_end      date,
  opening_hours text,
  venue_name    text NOT NULL,
  street        text,
  postal_code   text,
  city          text NOT NULL,
  location      geography(Point,4326) NOT NULL,
  organizer     text,
  official_source text,
  ticket_price  numeric(10,2) CHECK (ticket_price >= 0),
  ticket_url    text,
  pokemon_focus text NOT NULL DEFAULT 'starker_anteil',
  trading_available boolean NOT NULL DEFAULT true,
  verification_status event_verification NOT NULL DEFAULT 'unbestaetigt',
  last_checked  timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT events_date_range CHECK (date_end IS NULL OR date_end >= date_start)
);

-- ------------------------------------- Watchlist / Alerts / Portfolio ------
CREATE TABLE IF NOT EXISTS watchlist_items (
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, product_id)
);

CREATE TABLE IF NOT EXISTS portfolio_items (
  profile_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  qty        integer NOT NULL DEFAULT 1 CHECK (qty > 0),
  buy_price  numeric(10,2) CHECK (buy_price >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (profile_id, product_id)
);

CREATE TABLE IF NOT EXISTS alert_rules (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_id  uuid REFERENCES products(id)    ON DELETE CASCADE,
  set_id      uuid REFERENCES product_sets(id) ON DELETE CASCADE,
  mode        alert_mode  NOT NULL,
  scope       alert_scope NOT NULL DEFAULT 'lokal',
  target_price numeric(10,2) CHECK (target_price >= 0),
  radius_km   integer CHECK (radius_km > 0),
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  -- Wunschpreis-Regeln brauchen zwingend eine Preisgrenze
  CONSTRAINT alert_rules_price_required CHECK (mode <> 'wunschpreis' OR target_price IS NOT NULL),
  -- Regel muss sich auf Produkt ODER Set beziehen
  CONSTRAINT alert_rules_target_required CHECK (product_id IS NOT NULL OR set_id IS NOT NULL)
);

CREATE TABLE IF NOT EXISTS notifications (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id    uuid NOT NULL REFERENCES profiles(id)    ON DELETE CASCADE,
  alert_rule_id uuid REFERENCES alert_rules(id)          ON DELETE SET NULL,
  offer_id      uuid REFERENCES offers(id)               ON DELETE SET NULL,
  channel       text NOT NULL CHECK (channel IN ('push','email','inapp')),
  status        text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued','sent','failed','read')),
  payload       jsonb,
  sent_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id            uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id    uuid NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  tier          subscription_tier NOT NULL DEFAULT 'free',
  status        text NOT NULL DEFAULT 'active',
  stripe_customer_id     text UNIQUE,
  stripe_subscription_id text UNIQUE,
  current_period_end     timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sightings (
  id          uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id  uuid REFERENCES profiles(id)            ON DELETE SET NULL,
  product_id  uuid NOT NULL REFERENCES products(id)   ON DELETE CASCADE,
  location_id uuid REFERENCES retailer_locations(id)  ON DELETE SET NULL,
  location    geography(Point,4326),
  note        text,
  confidence  numeric(3,2) NOT NULL DEFAULT 0.5 CHECK (confidence BETWEEN 0 AND 1),
  confirmations integer NOT NULL DEFAULT 0 CHECK (confirmations >= 0),
  seen_at     timestamptz NOT NULL DEFAULT now(),
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS audit_log (
  id         bigserial PRIMARY KEY,
  profile_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action     text NOT NULL,
  entity     text NOT NULL,
  entity_id  text,
  meta       jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------- Indizes -----
CREATE INDEX IF NOT EXISTS idx_locations_geo      ON retailer_locations USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_events_geo         ON events            USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_sightings_geo      ON sightings         USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_locations_retailer ON retailer_locations (retailer_id);
CREATE INDEX IF NOT EXISTS idx_offers_product     ON offers (product_id);
CREATE INDEX IF NOT EXISTS idx_offers_retailer    ON offers (retailer_id);
CREATE INDEX IF NOT EXISTS idx_offers_validity    ON offers (valid_until, valid_from);
CREATE INDEX IF NOT EXISTS idx_offers_feed        ON offers (validity_type, valid_until) WHERE stock_signal <> 'ausverkauft';
CREATE INDEX IF NOT EXISTS idx_offer_locations_loc ON offer_locations (location_id);
CREATE INDEX IF NOT EXISTS idx_drops_time         ON drops (drop_at DESC);
CREATE INDEX IF NOT EXISTS idx_drops_product      ON drops (product_id);
CREATE INDEX IF NOT EXISTS idx_events_date        ON events (date_start);
CREATE INDEX IF NOT EXISTS idx_alert_rules_profile ON alert_rules (profile_id) WHERE is_active;
CREATE INDEX IF NOT EXISTS idx_notifications_profile ON notifications (profile_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_products_set       ON products (set_id);

-- ------------------------------------------------------------ Trigger ------
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles','user_settings','retailers','retailer_locations',
      'product_sets','products','offers','drops','rumors','events','portfolio_items',
      'alert_rules','subscriptions']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS trg_%1$s_updated ON %1$s;
       CREATE TRIGGER trg_%1$s_updated BEFORE UPDATE ON %1$s
       FOR EACH ROW EXECUTE FUNCTION set_updated_at();', t);
  END LOOP;
END $$;

-- ############### TEIL 2 von 3: Logik & Sicherheit ###############
-- ============================================================================
-- PokeDrop – Migration 0002: Deal-Bewertung als View, Radius-Funktion, RLS
-- Spiegelt lib/deals.ts und lib/geo.ts 1:1 in SQL wider.
-- ============================================================================

-- --------------------------------------------- Deal-Bewertung als View -----
-- Regel (Masterliste 12–14):
--   aktuell (≤12 Mon. & availability='aktuell') → UVP ist Referenz
--   sonst                                        → Markt + individuelle Schwellen
CREATE OR REPLACE VIEW deal_evaluations AS
WITH base AS (
  SELECT
    o.id AS offer_id,
    o.product_id,
    o.price,
    p.reference_uvp,
    p.market_reference_price,
    COALESCE(p.good_deal_threshold,  p.market_reference_price * 0.97) AS good_cut,
    COALESCE(NULLIF(p.great_deal_threshold, 0), p.market_reference_price * 0.85) AS great_cut,
    COALESCE(NULLIF(p.great_deal_threshold, 0), p.reference_uvp * 0.85) AS great_cut_current,
    (p.availability_status = 'aktuell'
      AND p.release_date > (now()::date - INTERVAL '12 months')) AS is_current
  FROM offers o
  JOIN products p ON p.id = o.product_id
)
SELECT
  offer_id,
  product_id,
  price,
  is_current,
  CASE WHEN is_current THEN 'UVP' ELSE 'Marktpreis' END AS reference_label,
  CASE WHEN is_current THEN reference_uvp ELSE market_reference_price END AS reference_price,
  (reference_uvp - price) AS savings_vs_uvp,
  CASE WHEN reference_uvp > 0
       THEN ROUND(((reference_uvp - price) / reference_uvp) * 100, 2)
       ELSE 0 END AS savings_pct,
  CASE
    WHEN is_current THEN
      CASE
        WHEN price <= great_cut_current           THEN 'TOP_DEAL'
        WHEN price <= reference_uvp + 0.01        THEN 'UVP_DEAL'
        WHEN price <= reference_uvp * 1.08        THEN 'MARKTPREIS'
        ELSE 'UEBER_MARKT'
      END
    ELSE
      CASE
        WHEN price <= reference_uvp + 0.01
             AND reference_uvp < market_reference_price THEN 'TOP_DEAL'
        WHEN price <= great_cut                   THEN 'TOP_DEAL'
        WHEN price <= good_cut                    THEN 'GUTER_DEAL'
        WHEN price <= market_reference_price*1.05 THEN 'MARKTPREIS'
        ELSE 'UEBER_MARKT'
      END
  END AS badge
FROM base;

-- ------------------------------------------------- Radius-Suche (PostGIS) --
-- Liefert gültige Angebote im Umkreis. Entfernung = kleinste Distanz zu einer
-- TATSÄCHLICH teilnehmenden Filiale (Masterliste 17.6/17.7).
-- ONLINE-Angebote werden immer mitgeliefert (distance_km IS NULL).
CREATE OR REPLACE FUNCTION offers_within_radius(
  user_lat  double precision,
  user_lng  double precision,
  radius_km integer
)
RETURNS TABLE (
  offer_id    uuid,
  product_id  uuid,
  price       numeric,
  badge       text,
  distance_km double precision,
  nearest_location_id uuid
) AS $$
  WITH me AS (
    SELECT ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography AS g
  ),
  physical AS (
    SELECT
      o.id AS offer_id,
      o.product_id,
      o.price,
      MIN(ST_Distance(rl.location, me.g)) / 1000.0 AS distance_km,
      (ARRAY_AGG(rl.id ORDER BY ST_Distance(rl.location, me.g)))[1] AS nearest_location_id
    FROM offers o
    JOIN offer_locations ol   ON ol.offer_id = o.id
    JOIN retailer_locations rl ON rl.id = ol.location_id AND rl.is_active
    CROSS JOIN me
    WHERE o.validity_type <> 'ONLINE'
      AND o.valid_until >= now()::date
      AND o.valid_from  <= now()::date
    GROUP BY o.id, o.product_id, o.price
  ),
  online AS (
    SELECT o.id, o.product_id, o.price, NULL::double precision, NULL::uuid
    FROM offers o
    WHERE o.validity_type = 'ONLINE'
      AND o.valid_until >= now()::date
      AND o.valid_from  <= now()::date
  ),
  combined AS (
    SELECT * FROM physical WHERE distance_km <= radius_km
    UNION ALL
    SELECT * FROM online
  )
  SELECT c.offer_id, c.product_id, c.price, de.badge, c.distance_km, c.nearest_location_id
  FROM combined c
  LEFT JOIN deal_evaluations de ON de.offer_id = c.offer_id;
$$ LANGUAGE sql STABLE;

-- Events im Umkreis
CREATE OR REPLACE FUNCTION events_within_radius(
  user_lat double precision, user_lng double precision, radius_km integer
)
RETURNS TABLE (event_id uuid, event_name text, city text, date_start date, distance_km double precision) AS $$
  SELECT e.id, e.event_name, e.city, e.date_start,
         ST_Distance(e.location, ST_SetSRID(ST_MakePoint(user_lng,user_lat),4326)::geography)/1000.0
  FROM events e
  WHERE e.verification_status <> 'abgesagt'
    AND e.date_start >= now()::date
    AND ST_DWithin(e.location, ST_SetSRID(ST_MakePoint(user_lng,user_lat),4326)::geography, radius_km*1000)
  ORDER BY e.date_start;
$$ LANGUAGE sql STABLE;

-- ------------------------------------------------ Row Level Security -------
-- Öffentliche Katalogdaten: für alle lesbar.
ALTER TABLE retailers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE retailer_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sets       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products           ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers             ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_locations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE drops              ENABLE ROW LEVEL SECURITY;
ALTER TABLE rumors             ENABLE ROW LEVEL SECURITY;
ALTER TABLE events             ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['retailers','retailer_locations','product_sets','products',
                           'offers','offer_locations','drops','rumors','events']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %1$s_public_read ON %1$s;', t);
    EXECUTE format('CREATE POLICY %1$s_public_read ON %1$s FOR SELECT USING (true);', t);
  END LOOP;
END $$;

-- Private Nutzerdaten: nur eigene Zeilen.
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings   ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications   ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions   ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS profiles_self ON profiles;
CREATE POLICY profiles_self ON profiles
  USING (auth_user_id = auth.uid()) WITH CHECK (auth_user_id = auth.uid());

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['user_settings','watchlist_items','portfolio_items',
                           'alert_rules','notifications','subscriptions']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %1$s_self ON %1$s;', t);
    EXECUTE format(
      'CREATE POLICY %1$s_self ON %1$s USING (
         profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
       ) WITH CHECK (
         profile_id IN (SELECT id FROM profiles WHERE auth_user_id = auth.uid())
       );', t);
  END LOOP;
END $$;

-- ############### TEIL 3 von 3: Beispieldaten ###############
-- ============================================================
-- PokeDrop – Seed-Daten (generiert aus /data)
-- Erzeugt mit: node scripts/generate-seed-sql.mjs
-- Idempotent: mehrfaches Ausfuehren ist unschaedlich.
-- ============================================================
BEGIN;

-- Haendler
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('kaufland', 'Kaufland', 'Kaufland', 'A', 'stationaer', 1, 'Bundesweit / teils prospektregional', '#e10915')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('edeka', 'EDEKA', 'EDEKA', 'A', 'stationaer', 1, 'Stark regional / filialabhängig', '#ffd400')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('edeka', 'E-Center', 'E-Center', 'A', 'stationaer', 1, 'Regional / filialabhängig', '#0a7bc4')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('edeka', 'Marktkauf', 'Marktkauf', 'A', 'stationaer', 1, 'Regional', '#e2001a')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('edeka', 'Scheck-in-Center', 'Scheck-in-Center', 'A', 'stationaer', 1, 'Regional / lokale Filialgruppen', '#00954c')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('rewe', 'REWE Center', 'REWE Center', 'A', 'stationaer', 1, 'Regional / filialabhängig', '#cc0000')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('netto_md', 'Netto Marken-Discount', 'Netto Marken-Discount', 'A', 'stationaer', 1, 'Überregional + regionale Varianten', '#ffcc00')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('penny', 'PENNY', 'PENNY', 'A', 'stationaer', 1, 'Überregional / regionale Prospektvarianten', '#d4021d')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('rossmann', 'Rossmann', 'Rossmann', 'A', 'stationaer', 1, 'Überregional / filialabhängig', '#c8102e')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('budni', 'Budni', 'Budni', 'A', 'stationaer', 1, 'Stark regional (Norddeutschland)', '#e5006d')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('famila', 'famila Nordwest', 'famila Nordwest', 'A', 'stationaer', 1, 'Stark regional', '#e30613')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('expert', 'Expert', 'Expert', 'A', 'stationaer', 1, 'Lokal / regional, Händlerverbund', '#e2001a')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('maec_geiz', 'Mäc-Geiz', 'Mäc-Geiz', 'A', 'stationaer', 1, 'Regional / Filialnetz', '#f39200')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('schmidts', 'Schmidt''s Märkte', 'Schmidt''s Märkte', 'A', 'stationaer', 1, 'Regional', '#004f9f')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('mueller', 'Müller', 'Müller', 'B', 'stationaer', 2, 'Bundesweit / Filialnetz', '#f7911e')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('smyths', 'Smyths Toys', 'Smyths Toys', 'B', 'stationaer', 2, 'Bundesweit / Filialnetz', '#e2001a')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('aldi_sued', 'ALDI SÜD', 'ALDI SÜD', 'B', 'stationaer', 2, 'Regionalgesellschaften', '#00538a')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('lidl', 'Lidl', 'Lidl', 'B', 'stationaer', 2, 'Überregional / regionale Varianten', '#0050aa')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('mediamarkt', 'MediaMarkt', 'MediaMarkt', 'B', 'stationaer', 2, 'Bundesweit / lokale Marktaktionen', '#df0000')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('galeria', 'Galeria', 'Galeria', 'B', 'stationaer', 2, 'Filialnetz', '#e3000f')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('kodi', 'KODi', 'KODi', 'B', 'stationaer', 2, 'Regional / NRW-Schwerpunkt', '#e30613')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('rofu', 'ROFU Kinderland', 'ROFU Kinderland', 'C', 'stationaer', 3, 'Regional / Filialnetz', '#e5007d')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('gate', 'Gate to the Games', 'Gate to the Games', 'C', 'stationaer', 3, 'TCG-Fachhandel', '#7b2ff7')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('fantasywelt', 'FantasyWelt', 'FantasyWelt', 'C', 'stationaer', 3, 'TCG-Fachhandel', '#1f7a3f')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('games_island', 'Games Island', 'Games Island', 'C', 'stationaer', 3, 'TCG-Fachhandel', '#0a84ff')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;
INSERT INTO retailers (retailer_group, retailer_brand, display_name, status, kind, crawler_tier, regionality, brand_color)
VALUES ('pokemon_center', 'Pokémon Center', 'Pokémon Center', 'A', 'online', 1, 'Online (offiziell)', '#ffcb05')
ON CONFLICT (retailer_group, retailer_brand) DO UPDATE
  SET display_name = EXCLUDED.display_name, status = EXCLUDED.status;

-- Filialen (Geo)
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'edeka-ob-1', 'EDEKA Rhein-Ruhr', 'EDEKA Sterkrade', 'Bahnhofstr. 112', '46145', 'Oberhausen',
       ST_SetSRID(ST_MakePoint(6.8556, 51.5279), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'kaufland-ob-1', NULL, 'Kaufland Oberhausen-Centro', 'Osterfelder Str. 12', '46047', 'Oberhausen',
       ST_SetSRID(ST_MakePoint(6.8792, 51.4949), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'mediamarkt-ob-1', NULL, 'MediaMarkt CentrO', 'Centroallee 279', '46047', 'Oberhausen',
       ST_SetSRID(ST_MakePoint(6.8807, 51.4931), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'mediamarkt' AND r.retailer_brand = 'MediaMarkt'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'rossmann-e-1', NULL, 'Rossmann Essen Rüttenscheid', 'Rüttenscheider Str. 154', '45131', 'Essen',
       ST_SetSRID(ST_MakePoint(7.0056, 51.4322), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'rossmann' AND r.retailer_brand = 'Rossmann'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'ecenter-e-1', 'EDEKA Rhein-Ruhr', 'E-Center Essen-Steele', 'Bochumer Str. 4', '45276', 'Essen',
       ST_SetSRID(ST_MakePoint(7.0776, 51.4489), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'marktkauf-do-1', 'EDEKA Rhein-Ruhr', 'Marktkauf Dortmund-Aplerbeck', 'Köln-Berliner-Str. 40', '44287', 'Dortmund',
       ST_SetSRID(ST_MakePoint(7.5645, 51.4842), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'Marktkauf'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'gate-do-1', NULL, 'Gate to the Games Dortmund', 'Westenhellweg 95', '44137', 'Dortmund',
       ST_SetSRID(ST_MakePoint(7.4585, 51.5142), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'gate' AND r.retailer_brand = 'Gate to the Games'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'smyths-do-1', NULL, 'Smyths Toys Dortmund', 'Indupark 3', '44149', 'Dortmund',
       ST_SetSRID(ST_MakePoint(7.3922, 51.4939), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'smyths' AND r.retailer_brand = 'Smyths Toys'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'kaufland-du-1', NULL, 'Kaufland Duisburg-Marxloh', 'Weseler Str. 40', '47169', 'Duisburg',
       ST_SetSRID(ST_MakePoint(6.7411, 51.4894), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'kodi-bo-1', NULL, 'KODi Bochum City', 'Kortumstr. 82', '44787', 'Bochum',
       ST_SetSRID(ST_MakePoint(7.216, 51.4805), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'kodi' AND r.retailer_brand = 'KODi'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'edeka-koeln-1', 'EDEKA Rhein-Ruhr', 'EDEKA Köln-Ehrenfeld', 'Venloer Str. 389', '50825', 'Köln',
       ST_SetSRID(ST_MakePoint(6.907, 50.9528), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'rewecenter-koeln-1', NULL, 'REWE Center Köln-Kalk', 'Kalker Hauptstr. 55', '51103', 'Köln',
       ST_SetSRID(ST_MakePoint(6.995, 50.9403), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'rewe' AND r.retailer_brand = 'REWE Center'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'mueller-koeln-1', NULL, 'Müller Köln Schildergasse', 'Schildergasse 88', '50667', 'Köln',
       ST_SetSRID(ST_MakePoint(6.952, 50.9359), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'mueller' AND r.retailer_brand = 'Müller'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'galeria-koeln-1', NULL, 'Galeria Köln', 'Hohe Str. 41', '50667', 'Köln',
       ST_SetSRID(ST_MakePoint(6.9573, 50.9375), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'galeria' AND r.retailer_brand = 'Galeria'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'ecenter-d-1', 'EDEKA Rhein-Ruhr', 'E-Center Düsseldorf-Bilk', 'Friedrichstr. 129', '40217', 'Düsseldorf',
       ST_SetSRID(ST_MakePoint(6.7801, 51.2064), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'penny-d-1', NULL, 'PENNY Düsseldorf-Flingern', 'Birkenstr. 44', '40233', 'Düsseldorf',
       ST_SetSRID(ST_MakePoint(6.8025, 51.2245), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'penny' AND r.retailer_brand = 'PENNY'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'fantasywelt-bn-1', NULL, 'FantasyWelt Bonn', 'Sternstr. 30', '53111', 'Bonn',
       ST_SetSRID(ST_MakePoint(7.0994, 50.736), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'fantasywelt' AND r.retailer_brand = 'FantasyWelt'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'netto-ms-1', NULL, 'Netto MD Münster', 'Hammer Str. 200', '48153', 'Münster',
       ST_SetSRID(ST_MakePoint(7.612, 51.9407), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'netto_md' AND r.retailer_brand = 'Netto Marken-Discount'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'edeka-lb-1', 'EDEKA Südwest', 'EDEKA Scheck-in Ludwigsburg', 'Schwieberdinger Str. 74', '71636', 'Ludwigsburg',
       ST_SetSRID(ST_MakePoint(9.173, 48.904), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'scheckin-lb-1', 'EDEKA Südwest', 'Scheck-in-Center Ludwigsburg', 'Heilbronner Str. 12', '71638', 'Ludwigsburg',
       ST_SetSRID(ST_MakePoint(9.1955, 48.901), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'Scheck-in-Center'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'ecenter-s-1', 'EDEKA Südwest', 'E-Center Stuttgart-Vaihingen', 'Industriestr. 3', '70565', 'Stuttgart',
       ST_SetSRID(ST_MakePoint(9.112, 48.728), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'kaufland-s-1', NULL, 'Kaufland Stuttgart-Bad Cannstatt', 'Mercedesstr. 2', '70372', 'Stuttgart',
       ST_SetSRID(ST_MakePoint(9.228, 48.806), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'gate-s-1', NULL, 'Gate to the Games Stuttgart', 'Eberhardstr. 61', '70173', 'Stuttgart',
       ST_SetSRID(ST_MakePoint(9.178, 48.771), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'gate' AND r.retailer_brand = 'Gate to the Games'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'mueller-ka-1', NULL, 'Müller Karlsruhe', 'Kaiserstr. 179', '76133', 'Karlsruhe',
       ST_SetSRID(ST_MakePoint(8.396, 49.0094), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'mueller' AND r.retailer_brand = 'Müller'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'marktkauf-ma-1', 'EDEKA Südwest', 'Marktkauf Mannheim', 'Fressgasse 4', '68159', 'Mannheim',
       ST_SetSRID(ST_MakePoint(8.465, 49.488), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'Marktkauf'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'smyths-fr-1', NULL, 'Smyths Toys Freiburg', 'Am Bahnhof 1', '79098', 'Freiburg',
       ST_SetSRID(ST_MakePoint(7.841, 47.997), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'smyths' AND r.retailer_brand = 'Smyths Toys'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'kaufland-m-1', NULL, 'Kaufland München-Riem', 'Willy-Brandt-Platz 5', '81829', 'München',
       ST_SetSRID(ST_MakePoint(11.698, 48.129), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'mediamarkt-m-1', NULL, 'MediaMarkt München-Euroindustriepark', 'Otto-Hahn-Ring 6', '80939', 'München',
       ST_SetSRID(ST_MakePoint(11.576, 48.198), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'mediamarkt' AND r.retailer_brand = 'MediaMarkt'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'games-island-m-1', NULL, 'Games Island München', 'Schwanthalerstr. 32', '80336', 'München',
       ST_SetSRID(ST_MakePoint(11.556, 48.137), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'games_island' AND r.retailer_brand = 'Games Island'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'edeka-n-1', 'EDEKA Nordbayern', 'EDEKA Nürnberg-Mitte', 'Königstr. 62', '90402', 'Nürnberg',
       ST_SetSRID(ST_MakePoint(11.079, 49.448), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'rofu-a-1', NULL, 'ROFU Kinderland Augsburg', 'Bürgermeister-Ackermann-Str. 15', '86150', 'Augsburg',
       ST_SetSRID(ST_MakePoint(10.894, 48.367), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'rofu' AND r.retailer_brand = 'ROFU Kinderland'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'budni-hh-1', NULL, 'Budni Hamburg-Altona', 'Ottenser Hauptstr. 10', '22765', 'Hamburg',
       ST_SetSRID(ST_MakePoint(9.933, 53.551), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'budni' AND r.retailer_brand = 'Budni'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'famila-hh-1', NULL, 'famila Hamburg-Wandsbek', 'Wandsbeker Marktstr. 73', '22041', 'Hamburg',
       ST_SetSRID(ST_MakePoint(10.081, 53.572), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'famila' AND r.retailer_brand = 'famila Nordwest'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'mediamarkt-hh-1', NULL, 'MediaMarkt Hamburg-Altona', 'Große Bergstr. 264', '22767', 'Hamburg',
       ST_SetSRID(ST_MakePoint(9.935, 53.549), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'mediamarkt' AND r.retailer_brand = 'MediaMarkt'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'famila-ki-1', NULL, 'famila Kiel', 'Holstenstr. 74', '24103', 'Kiel',
       ST_SetSRID(ST_MakePoint(10.135, 54.323), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'famila' AND r.retailer_brand = 'famila Nordwest'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'netto-hb-1', NULL, 'Netto MD Bremen', 'Obernstr. 40', '28195', 'Bremen',
       ST_SetSRID(ST_MakePoint(8.807, 53.076), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'netto_md' AND r.retailer_brand = 'Netto Marken-Discount'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'ecenter-h-1', 'EDEKA Minden-Hannover', 'E-Center Hannover-Linden', 'Limmerstr. 90', '30451', 'Hannover',
       ST_SetSRID(ST_MakePoint(9.71, 52.376), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'kaufland-b-1', NULL, 'Kaufland Berlin-Prenzlauer Berg', 'Storkower Str. 139', '10407', 'Berlin',
       ST_SetSRID(ST_MakePoint(13.463, 52.529), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'gate-b-1', NULL, 'Gate to the Games Berlin', 'Alexanderplatz 7', '10178', 'Berlin',
       ST_SetSRID(ST_MakePoint(13.4132, 52.5219), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'gate' AND r.retailer_brand = 'Gate to the Games'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'mediamarkt-b-1', NULL, 'MediaMarkt Berlin-Alexanderplatz', 'Alexanderplatz 3', '10178', 'Berlin',
       ST_SetSRID(ST_MakePoint(13.411, 52.5215), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'mediamarkt' AND r.retailer_brand = 'MediaMarkt'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'kaufland-l-1', NULL, 'Kaufland Leipzig-Zentrum', 'Brühl 1', '04109', 'Leipzig',
       ST_SetSRID(ST_MakePoint(12.376, 51.345), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'penny-dd-1', NULL, 'PENNY Dresden-Neustadt', 'Bautzner Str. 20', '01099', 'Dresden',
       ST_SetSRID(ST_MakePoint(13.753, 51.066), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'penny' AND r.retailer_brand = 'PENNY'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'edeka-f-1', 'EDEKA Südwest', 'EDEKA Frankfurt-Bornheim', 'Berger Str. 125', '60385', 'Frankfurt',
       ST_SetSRID(ST_MakePoint(8.708, 50.129), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;
INSERT INTO retailer_locations (retailer_id, external_store_id, regional_company, store_name, street, postal_code, city, location)
SELECT r.id, 'galeria-f-1', NULL, 'Galeria Frankfurt an der Hauptwache', 'Zeil 116', '60313', 'Frankfurt',
       ST_SetSRID(ST_MakePoint(8.682, 50.115), 4326)::geography
FROM retailers r WHERE r.retailer_group = 'galeria' AND r.retailer_brand = 'Galeria'
ON CONFLICT (retailer_id, external_store_id) DO NOTHING;

-- Sets
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('me5', 'Mega-Entwicklung: Dunkelnacht', '2026-07-17', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('sv09', 'Reisegefährten', '2026-05-30', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('sv08', 'Zeitlose Rivalen', '2026-03-14', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('mf1', 'Mega Forces', '2026-06-20', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('fpc3', 'First Partner Collection', '2026-07-04', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('sv03', 'Karmesin & Purpur – Obsidianflammen', '2023-08-11', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('mew', 'Karmesin & Purpur – 151', '2023-09-22', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('sv4pt5', 'Karmesin & Purpur – Paldeas Schicksale', '2024-01-26', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('swsh11', 'Schwert & Schild – Verlorener Ursprung', '2022-09-09', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('swsh09', 'Schwert & Schild – Brillante Sterne', '2022-02-25', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('cel25', 'Celebrations – 25 Jahre', '2021-10-08', 'Englisch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('sv07', 'Karmesin & Purpur – Stellarkrone', '2024-09-13', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('sv06', 'Karmesin & Purpur – Maskerade im Zwielicht', '2024-05-24', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;
INSERT INTO product_sets (set_code, set_name, release_date, language)
VALUES ('sv04', 'Karmesin & Purpur – Paradoxrift', '2023-11-03', 'Deutsch')
ON CONFLICT (set_code) DO NOTHING;

-- Produkte
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-dunkelnacht-display', 'Dunkelnacht – 36er Booster Display', ps.id, 'Display', '0820650550010', 'ME5-DISPLAY-DE',
  'Deutsch', '2026-07-17', 179.99, 'The Pokémon Company, DE-UVP 07/2026',
  179.99, 165, 149,
  'aktuell', 94, 'darkness'
FROM product_sets ps WHERE ps.set_code = 'me5'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-dunkelnacht-etb', 'Dunkelnacht – Top-Trainer-Box', ps.id, 'ETB', '0820650550027', 'ME5-ETB-DE',
  'Deutsch', '2026-07-17', 54.99, 'The Pokémon Company, DE-UVP 07/2026',
  54.99, 49, 45,
  'aktuell', 248, 'darkness'
FROM product_sets ps WHERE ps.set_code = 'me5'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-reisegefaehrten-etb', 'Reisegefährten – Top-Trainer-Box', ps.id, 'ETB', '0820650850013', 'SV09-ETB-DE',
  'Deutsch', '2026-05-30', 54.99, 'The Pokémon Company, DE-UVP 05/2026',
  56.99, 49, 45,
  'aktuell', 658, 'water'
FROM product_sets ps WHERE ps.set_code = 'sv09'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-reisegefaehrten-display', 'Reisegefährten – 36er Booster Display', ps.id, 'Display', '0820650850020', 'SV09-DISPLAY-DE',
  'Deutsch', '2026-05-30', 179.99, 'The Pokémon Company, DE-UVP 05/2026',
  184.99, 165, 149,
  'aktuell', 645, 'water'
FROM product_sets ps WHERE ps.set_code = 'sv09'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-zeitlose-rivalen-blister', 'Zeitlose Rivalen – 3er-Booster-Blister', ps.id, 'Blister', '0820650840014', 'SV08-3BLISTER-DE',
  'Deutsch', '2026-03-14', 14.99, 'The Pokémon Company, DE-UVP 03/2026',
  15.49, 13.5, 11.99,
  'aktuell', 25, 'lightning'
FROM product_sets ps WHERE ps.set_code = 'sv08'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-mega-forces-tin', 'Mega Forces – Mini-Tin (3 Booster)', ps.id, 'Mini Tin', '0820650560019', 'MF1-MINITIN-DE',
  'Deutsch', '2026-06-20', 24.99, 'The Pokémon Company, DE-UVP 06/2026',
  24.99, 21.5, 18.99,
  'aktuell', 384, 'dragon'
FROM product_sets ps WHERE ps.set_code = 'mf1'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-fpc3-collection', 'First Partner Collection Serie 3', ps.id, 'Premium Collection', '0820650560033', 'FPC3-DE',
  'Deutsch', '2026-07-04', 39.99, 'The Pokémon Company, DE-UVP 07/2026',
  42.99, 35, 31.99,
  'aktuell', 3, 'grass'
FROM product_sets ps WHERE ps.set_code = 'fpc3'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-obsidianflammen-etb', 'Obsidianflammen – Top-Trainer-Box (Glurak)', ps.id, 'ETB', '0820650800011', 'SV03-ETB-DE',
  'Deutsch', '2023-08-11', 49.99, 'The Pokémon Company, DE-UVP 08/2023',
  64.9, 56, 49,
  'aeltere_kollektion', 6, 'fire'
FROM product_sets ps WHERE ps.set_code = 'sv03'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-151-upc', 'Pokémon 151 – Ultra-Premium-Kollektion', ps.id, 'Premium Collection', '0820650800028', 'MEW-UPC-DE',
  'Deutsch', '2023-09-22', 119.99, 'The Pokémon Company, DE-UVP 09/2023',
  229, 199, 169,
  'out_of_print', 151, 'psychic'
FROM product_sets ps WHERE ps.set_code = 'mew'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-paldeas-schicksale-etb', 'Paldeas Schicksale – Top-Trainer-Box', ps.id, 'ETB', '0820650810010', 'SV4P5-ETB-DE',
  'Deutsch', '2024-01-26', 49.99, 'The Pokémon Company, DE-UVP 01/2024',
  82.9, 69, 58,
  'out_of_print', 700, 'fairy'
FROM product_sets ps WHERE ps.set_code = 'sv4pt5'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-verlorener-ursprung-display', 'Verlorener Ursprung – Booster Display', ps.id, 'Display', '0820650790015', 'SWSH11-DISPLAY-DE',
  'Deutsch', '2022-09-09', 149.99, 'The Pokémon Company, DE-UVP 09/2022',
  299, 259, 219,
  'out_of_print', 487, 'darkness'
FROM product_sets ps WHERE ps.set_code = 'swsh11'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-brillante-sterne-etb', 'Brillante Sterne – Top-Trainer-Box (Arceus)', ps.id, 'ETB', '0820650790022', 'SWSH09-ETB-DE',
  'Deutsch', '2022-02-25', 49.99, 'The Pokémon Company, DE-UVP 02/2022',
  104, 89, 74,
  'out_of_print', 493, 'colorless'
FROM product_sets ps WHERE ps.set_code = 'swsh09'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-celebrations-etb', '25 Jahre – Celebrations Top-Trainer-Box', ps.id, 'ETB', '0820650780016', 'CEL25-ETB-DE',
  'Englisch', '2021-10-08', 44.99, 'TPCi, UVP 10/2021',
  139, 115, 95,
  'out_of_print', 25, 'lightning'
FROM product_sets ps WHERE ps.set_code = 'cel25'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-stellarkrone-etb', 'Stellarkrone – Top-Trainer-Box', ps.id, 'ETB', '0820650830015', 'SV07-ETB-DE',
  'Deutsch', '2024-09-13', 54.99, 'The Pokémon Company, DE-UVP 09/2024',
  58.9, 51, 46,
  'aeltere_kollektion', 282, 'psychic'
FROM product_sets ps WHERE ps.set_code = 'sv07'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-maskerade-bundle', 'Maskerade im Zwielicht – Booster Bundle (6 Packs)', ps.id, 'Booster Bundle', '0820650820019', 'SV06-BUNDLE-DE',
  'Deutsch', '2024-05-24', 26.99, 'The Pokémon Company, DE-UVP 05/2024',
  33.5, 28, 24.5,
  'aeltere_kollektion', 658, 'water'
FROM product_sets ps WHERE ps.set_code = 'sv06'
ON CONFLICT (slug) DO NOTHING;
INSERT INTO products (slug, product_name, set_id, category, ean, sku, language, release_date,
  reference_uvp, uvp_source, market_reference_price, good_deal_threshold, great_deal_threshold,
  availability_status, pokemon_artwork_id, energy_type)
SELECT 'p-paradoxrift-premium', 'Paradoxrift – Premium-Kollektion Roaring Moon ex', ps.id, 'Premium Collection', '0820650820026', 'SV04-PREMIUM-DE',
  'Deutsch', '2023-11-03', 34.99, 'The Pokémon Company, DE-UVP 11/2023',
  51, 44, 37,
  'out_of_print', 373, 'dragon'
FROM product_sets ps WHERE ps.set_code = 'sv04'
ON CONFLICT (slug) DO NOTHING;

-- Events
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('PokéTausch Ruhrgebiet – Sommerbörse', 'Tauschbörse', '2026-07-25', NULL, '10:00 – 16:00 Uhr',
  'Turbinenhalle Oberhausen', 'Im Lipperfeld 23', '46047', 'Oberhausen',
  ST_SetSRID(ST_MakePoint(6.873, 51.487), 4326)::geography,
  'PokéTausch NRW e. V.', 'https://example.org/poketausch-nrw', 3, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-21')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Card Show Rheinland', 'Card Show', '2026-07-26', NULL, '09:00 – 17:00 Uhr',
  'MediaPark Köln, Halle 2', 'Im MediaPark 8', '50670', 'Köln',
  ST_SetSRID(ST_MakePoint(6.945, 50.949), 4326)::geography,
  'Rheinland Card Events', 'https://example.org/cardshow-rheinland', 8, 'https://example.org/tickets',
  'starker_anteil', true, 'bestaetigt', '2026-07-20')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Pokémon TCG Community-Treff München', 'Community-Treffen', '2026-07-24', NULL, '18:00 – 22:00 Uhr',
  'Games Island München', 'Schwanthalerstr. 32', '80336', 'München',
  ST_SetSRID(ST_MakePoint(11.556, 48.137), 4326)::geography,
  'Games Island', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-22')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Sammlerbörse Hamburg Nord', 'Sammlerbörse', '2026-08-02', NULL, '11:00 – 16:00 Uhr',
  'Bürgerhaus Wilhelmsburg', 'Mengestr. 20', '21107', 'Hamburg',
  ST_SetSRID(ST_MakePoint(10.013, 53.499), 4326)::geography,
  'Sammlerbörse Nord', NULL, 4, NULL,
  'multi_tcg', true, 'wahrscheinlich', '2026-07-19')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('TCG Grand Tournament + Trading Day', 'Turnier', '2026-08-08', '2026-08-09', '10:00 – 18:00 Uhr',
  'Messe Stuttgart, Halle 4', 'Messepiazza 1', '70629', 'Stuttgart',
  ST_SetSRID(ST_MakePoint(9.193, 48.69), 4326)::geography,
  'Southside TCG', 'https://example.org/grand-tournament', 25, 'https://example.org/tickets-gt',
  'pokemon_only', true, 'bestaetigt', '2026-07-18')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Pokémon Tauschbörse Berlin-Mitte', 'Tauschbörse', '2026-08-01', NULL, '12:00 – 17:00 Uhr',
  'Alte Münze', 'Am Krögel 2', '10179', 'Berlin',
  ST_SetSRID(ST_MakePoint(13.413, 52.515), 4326)::geography,
  'Berlin Poké Society', NULL, 5, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-21')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Sammelkartenmesse RheinMain', 'Sammelkartenmesse', '2026-09-05', '2026-09-06', '10:00 – 18:00 Uhr',
  'Messe Frankfurt, Halle 1', 'Ludwig-Erhard-Anlage 1', '60327', 'Frankfurt',
  ST_SetSRID(ST_MakePoint(8.643, 50.112), 4326)::geography,
  'CardExpo GmbH', 'https://example.org/cardexpo', 12, 'https://example.org/cardexpo-tickets',
  'starker_anteil', true, 'bestaetigt', '2026-07-15')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Dortmunder Kartentausch', 'Tauschbörse', '2026-08-15', NULL, '13:00 – 18:00 Uhr',
  'Dietrich-Keuning-Haus', 'Leopoldstr. 50-58', '44147', 'Dortmund',
  ST_SetSRID(ST_MakePoint(7.46, 51.523), 4326)::geography,
  'TCG Dortmund', NULL, 2, NULL,
  'pokemon_only', true, 'wahrscheinlich', '2026-07-17')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Nürnberg Toy & Card Fair', 'Card Show', '2026-09-19', NULL, '10:00 – 17:00 Uhr',
  'Meistersingerhalle', 'Münchener Str. 21', '90478', 'Nürnberg',
  ST_SetSRID(ST_MakePoint(11.1, 49.436), 4326)::geography,
  'Franken Cards', NULL, 7, NULL,
  'multi_tcg', true, 'bestaetigt', '2026-07-16')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Leipzig TCG Community Meetup', 'Community-Treffen', '2026-07-29', NULL, '17:30 – 21:00 Uhr',
  'Spielecafé Leipzig', 'Karl-Liebknecht-Str. 62', '04275', 'Leipzig',
  ST_SetSRID(ST_MakePoint(12.372, 51.323), 4326)::geography,
  'Leipzig TCG', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-20')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Hannover Sammlertag', 'Sammlerbörse', '2026-08-23', NULL, '10:00 – 15:00 Uhr',
  'HCC Hannover', 'Theodor-Heuss-Platz 1-3', '30175', 'Hannover',
  ST_SetSRID(ST_MakePoint(9.762, 52.379), 4326)::geography,
  'Sammlertag Nord', NULL, 5, NULL,
  'multi_tcg', true, 'wahrscheinlich', '2026-07-14')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Dresden Pokémon Trade Night', 'Tauschbörse', '2026-08-06', NULL, '18:00 – 22:00 Uhr',
  'Brettspiel-Bar Dresden', 'Alaunstr. 36', '01099', 'Dresden',
  ST_SetSRID(ST_MakePoint(13.754, 51.068), 4326)::geography,
  'Elbe TCG', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-18')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Card Show West – Düsseldorf', 'Card Show', '2026-09-12', NULL, '09:30 – 17:00 Uhr',
  'Areal Böhler', 'Hansaallee 321', '40549', 'Düsseldorf',
  ST_SetSRID(ST_MakePoint(6.73, 51.256), 4326)::geography,
  'West Card Events', 'https://example.org/cardshow-west', 9, NULL,
  'starker_anteil', true, 'bestaetigt', '2026-07-19')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Bremen Kartenflohmarkt', 'Sammlerbörse', '2026-08-30', NULL, '11:00 – 16:00 Uhr',
  'Bürgerhaus Weserterrassen', 'Osterdeich 70b', '28203', 'Bremen',
  ST_SetSRID(ST_MakePoint(8.828, 53.07), 4326)::geography,
  'Nordbörse', NULL, 3, NULL,
  'multi_tcg', true, 'unbestaetigt', '2026-07-12')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Kiel Trainer Trading Meetup', 'Community-Treffen', '2026-08-13', NULL, '18:00 – 21:30 Uhr',
  'famila Kiel – Eventfläche', 'Holstenstr. 74', '24103', 'Kiel',
  ST_SetSRID(ST_MakePoint(10.135, 54.323), 4326)::geography,
  'Kiel Poké Crew', NULL, NULL, NULL,
  'pokemon_only', true, 'wahrscheinlich', '2026-07-16')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Ludwigsburg TCG-Tauschtag', 'Tauschbörse', '2026-07-25', NULL, '10:00 – 14:00 Uhr',
  'Musikhalle Ludwigsburg', 'Bahnhofstr. 19', '71638', 'Ludwigsburg',
  ST_SetSRID(ST_MakePoint(9.187, 48.894), 4326)::geography,
  'Barock TCG', NULL, 2, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-21')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Card Show Süd – Augsburg', 'Card Show', '2026-10-03', '2026-10-04', '10:00 – 18:00 Uhr',
  'Schwabenhalle', 'Am Schwaneck 15', '86156', 'Augsburg',
  ST_SetSRID(ST_MakePoint(10.86, 48.352), 4326)::geography,
  'Süd Card Events', NULL, 10, NULL,
  'starker_anteil', true, 'bestaetigt', '2026-07-10')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Essen Trade & Play', 'Turnier', '2026-08-16', NULL, '11:00 – 19:00 Uhr',
  'Zeche Carl', 'Wilhelm-Nieswandt-Allee 100', '45326', 'Essen',
  ST_SetSRID(ST_MakePoint(7.009, 51.488), 4326)::geography,
  'Ruhr TCG League', NULL, 15, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-17')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Mannheim Sammelkartentag', 'Sammlerbörse', '2026-09-27', NULL, '10:00 – 16:00 Uhr',
  'Rosengarten Mannheim', 'Rosengartenplatz 2', '68161', 'Mannheim',
  ST_SetSRID(ST_MakePoint(8.476, 49.485), 4326)::geography,
  'Kurpfalz Cards', NULL, 6, NULL,
  'multi_tcg', true, 'wahrscheinlich', '2026-07-13')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Bonn Poké Trade Sunday', 'Tauschbörse', '2026-08-09', NULL, '12:00 – 16:00 Uhr',
  'FantasyWelt Bonn', 'Sternstr. 30', '53111', 'Bonn',
  ST_SetSRID(ST_MakePoint(7.0994, 50.736), 4326)::geography,
  'FantasyWelt', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-20')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Karlsruhe TCG Convention', 'Sammelkartenmesse', '2026-10-17', '2026-10-18', '10:00 – 18:00 Uhr',
  'Messe Karlsruhe', 'Messeallee 1', '76287', 'Rheinstetten',
  ST_SetSRID(ST_MakePoint(8.33, 48.97), 4326)::geography,
  'Baden Card Convention', 'https://example.org/karlsruhe-tcg', 14, NULL,
  'starker_anteil', true, 'bestaetigt', '2026-07-11')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Münster Kartenrunde', 'Community-Treffen', '2026-07-31', NULL, '18:00 – 21:00 Uhr',
  'Spieltrieb Münster', 'Hammer Str. 130', '48153', 'Münster',
  ST_SetSRID(ST_MakePoint(7.622, 51.945), 4326)::geography,
  'Münster TCG', NULL, NULL, NULL,
  'pokemon_only', true, 'wahrscheinlich', '2026-07-19')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Bochum Retro & TCG Börse', 'Sammlerbörse', '2026-08-22', NULL, '10:00 – 15:00 Uhr',
  'RuhrCongress Bochum', 'Stadionring 20', '44791', 'Bochum',
  ST_SetSRID(ST_MakePoint(7.24, 51.49), 4326)::geography,
  'Retro Ruhr', NULL, 4, NULL,
  'multi_tcg', true, 'bestaetigt', '2026-07-18')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Freiburg Trainer Trade Night', 'Tauschbörse', '2026-08-07', NULL, '18:30 – 22:00 Uhr',
  'Spielbar Freiburg', 'Wilhelmstr. 8', '79098', 'Freiburg',
  ST_SetSRID(ST_MakePoint(7.848, 47.997), 4326)::geography,
  'Breisgau TCG', NULL, NULL, NULL,
  'pokemon_only', true, 'wahrscheinlich', '2026-07-15')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Card Show Nord – Hamburg', 'Card Show', '2026-09-26', '2026-09-27', '10:00 – 18:00 Uhr',
  'Messehallen Hamburg', 'Messeplatz 1', '20357', 'Hamburg',
  ST_SetSRID(ST_MakePoint(9.975, 53.562), 4326)::geography,
  'Nord Card Events', 'https://example.org/cardshow-nord', 11, NULL,
  'starker_anteil', true, 'bestaetigt', '2026-07-12')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Wiesbaden Community Cup', 'Turnier', '2026-09-13', NULL, '10:00 – 17:00 Uhr',
  'Kulturzentrum Schlachthof', 'Murnaustr. 1', '65189', 'Wiesbaden',
  ST_SetSRID(ST_MakePoint(8.251, 50.068), 4326)::geography,
  'Rheingau TCG', NULL, 18, NULL,
  'pokemon_only', true, 'wahrscheinlich', '2026-07-16')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Duisburg Tausch am Hafen', 'Tauschbörse', '2026-08-29', NULL, '11:00 – 16:00 Uhr',
  'Kultbunker', 'Am Innenhafen 12', '47059', 'Duisburg',
  ST_SetSRID(ST_MakePoint(6.771, 51.438), 4326)::geography,
  'Hafen TCG', NULL, 2, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-20')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Bielefeld Card Meetup', 'Community-Treffen', '2026-08-05', NULL, '18:00 – 21:00 Uhr',
  'Ludothek Bielefeld', 'Arndtstr. 6', '33602', 'Bielefeld',
  ST_SetSRID(ST_MakePoint(8.532, 52.021), 4326)::geography,
  'OWL TCG', NULL, NULL, NULL,
  'pokemon_only', true, 'unbestaetigt', '2026-07-14')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Kassel Mitte-Deutschland Börse', 'Sammlerbörse', '2026-09-20', NULL, '10:00 – 15:00 Uhr',
  'Kongress Palais Kassel', 'Holger-Börner-Platz 1', '34119', 'Kassel',
  ST_SetSRID(ST_MakePoint(9.488, 51.316), 4326)::geography,
  'Mitte Cards', NULL, 5, NULL,
  'multi_tcg', true, 'wahrscheinlich', '2026-07-13')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('PokéDrop Release-Party: Dunkelnacht', 'Community-Treffen', '2026-07-26', NULL, '14:00 – 20:00 Uhr',
  'Gate to the Games Dortmund', 'Westenhellweg 95', '44137', 'Dortmund',
  ST_SetSRID(ST_MakePoint(7.4585, 51.5142), 4326)::geography,
  'Gate to the Games', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-22')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Stuttgart Sunday Trade', 'Tauschbörse', '2026-08-16', NULL, '12:00 – 16:00 Uhr',
  'Gate to the Games Stuttgart', 'Eberhardstr. 61', '70173', 'Stuttgart',
  ST_SetSRID(ST_MakePoint(9.178, 48.771), 4326)::geography,
  'Gate to the Games', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-21')
ON CONFLICT DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Nürnberg Spielwarenmesse Sonderfläche TCG', 'Sammelkartenmesse', '2026-10-24', '2026-10-25', '09:00 – 18:00 Uhr',
  'Messe Nürnberg', 'Messezentrum 1', '90471', 'Nürnberg',
  ST_SetSRID(ST_MakePoint(11.123, 49.427), 4326)::geography,
  'Toy & Card Fair', 'https://example.org/nuernberg-messe', 16, NULL,
  'starker_anteil', true, 'bestaetigt', '2026-07-10')
ON CONFLICT DO NOTHING;

COMMIT;
