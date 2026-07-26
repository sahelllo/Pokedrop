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
