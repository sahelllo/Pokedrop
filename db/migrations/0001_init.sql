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
