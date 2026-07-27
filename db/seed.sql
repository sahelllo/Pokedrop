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

-- Angebote (inkl. teilnehmender Filialen)
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 42.99, 54.99, '2026-07-20', '2026-07-26',
  'LOCAL', 'Prospekt', 'https://www.prospektangebote.de/geschaefte/edeka/angebote/pokemon-sammelkarten-angebot-56374012/', 'REGIONAL_CONFIRMED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-reisegefaehrten-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'Scheck-in-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-reisegefaehrten-etb' AND o2.retailer_id = r.id
      AND o2.price = 42.99 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'scheckin-lb-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 42.99 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 149, 179.99, '2026-07-21', '2026-07-28',
  'NATIONAL', 'Prospekt', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-dunkelnacht-display'
  AND r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-dunkelnacht-display' AND o2.retailer_id = r.id
      AND o2.price = 149 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-ob-1'
WHERE p.slug = 'p-dunkelnacht-display' AND o.price = 149 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-du-1'
WHERE p.slug = 'p-dunkelnacht-display' AND o.price = 149 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-s-1'
WHERE p.slug = 'p-dunkelnacht-display' AND o.price = 149 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-m-1'
WHERE p.slug = 'p-dunkelnacht-display' AND o.price = 149 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-b-1'
WHERE p.slug = 'p-dunkelnacht-display' AND o.price = 149 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-l-1'
WHERE p.slug = 'p-dunkelnacht-display' AND o.price = 149 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 44.99, 54.99, '2026-07-22', '2026-07-27',
  'NATIONAL', 'Prospekt', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-dunkelnacht-etb'
  AND r.retailer_group = 'netto_md' AND r.retailer_brand = 'Netto Marken-Discount'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-dunkelnacht-etb' AND o2.retailer_id = r.id
      AND o2.price = 44.99 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'netto-ms-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 44.99 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'netto-hb-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 44.99 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 164.99, 229, '2026-07-19', '2026-07-31',
  'STORE_GROUP', 'App', NULL, 'VERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-151-upc'
  AND r.retailer_group = 'mueller' AND r.retailer_brand = 'Müller'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-151-upc' AND o2.retailer_id = r.id
      AND o2.price = 164.99 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mueller-koeln-1'
WHERE p.slug = 'p-151-upc' AND o.price = 164.99 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mueller-ka-1'
WHERE p.slug = 'p-151-upc' AND o.price = 164.99 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 47.9, 64.9, '2026-07-17', '2026-08-11',
  'LOCAL', 'Händlerseite', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-obsidianflammen-etb'
  AND r.retailer_group = 'gate' AND r.retailer_brand = 'Gate to the Games'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-obsidianflammen-etb' AND o2.retailer_id = r.id
      AND o2.price = 47.9 AND o2.valid_from = '2026-07-17'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'gate-do-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 47.9 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 219, 299, '2026-07-21', '2026-08-05',
  'ONLINE', 'Online-Shop', NULL, 'VERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-verlorener-ursprung-display'
  AND r.retailer_group = 'fantasywelt' AND r.retailer_brand = 'FantasyWelt'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-verlorener-ursprung-display' AND o2.retailer_id = r.id
      AND o2.price = 219 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 11.99, 14.99, '2026-07-22', '2026-07-29',
  'NATIONAL', 'Prospekt', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-zeitlose-rivalen-blister'
  AND r.retailer_group = 'rossmann' AND r.retailer_brand = 'Rossmann'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-zeitlose-rivalen-blister' AND o2.retailer_id = r.id
      AND o2.price = 11.99 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'rossmann-e-1'
WHERE p.slug = 'p-zeitlose-rivalen-blister' AND o.price = 11.99 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 31.99, 39.99, '2026-07-21', '2026-07-25',
  'NATIONAL', 'Prospekt', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-fpc3-collection'
  AND r.retailer_group = 'penny' AND r.retailer_brand = 'PENNY'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-fpc3-collection' AND o2.retailer_id = r.id
      AND o2.price = 31.99 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'penny-d-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 31.99 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'penny-dd-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 31.99 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 57.99, 82.9, '2026-07-20', '2026-07-27',
  'REGIONAL', 'Prospekt', NULL, 'REGIONAL_CONFIRMED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-paldeas-schicksale-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'Marktkauf'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-paldeas-schicksale-etb' AND o2.retailer_id = r.id
      AND o2.price = 57.99 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-ma-1'
WHERE p.slug = 'p-paldeas-schicksale-etb' AND o.price = 57.99 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-paldeas-schicksale-etb' AND o.price = 57.99 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 18.99, 24.99, '2026-07-22', '2026-07-28',
  'STORE_GROUP', 'Prospekt', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-mega-forces-tin'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'Scheck-in-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-mega-forces-tin' AND o2.retailer_id = r.id
      AND o2.price = 18.99 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'scheckin-lb-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 18.99 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-s-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 18.99 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 74, 104, '2026-07-18', '2026-08-02',
  'STORE_GROUP', 'Händlerseite', NULL, 'PROBABLE',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-brillante-sterne-etb'
  AND r.retailer_group = 'galeria' AND r.retailer_brand = 'Galeria'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-brillante-sterne-etb' AND o2.retailer_id = r.id
      AND o2.price = 74 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'galeria-koeln-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 74 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'galeria-f-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 74 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 94.9, 139, '2026-07-21', '2026-07-30',
  'LOCAL', 'Community-Fund', NULL, 'COMMUNITY_UNVERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-celebrations-etb'
  AND r.retailer_group = 'smyths' AND r.retailer_brand = 'Smyths Toys'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-celebrations-etb' AND o2.retailer_id = r.id
      AND o2.price = 94.9 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'smyths-do-1'
WHERE p.slug = 'p-celebrations-etb' AND o.price = 94.9 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 46.99, 58.9, '2026-07-21', '2026-07-27',
  'REGIONAL', 'Prospekt', NULL, 'REGIONAL_CONFIRMED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-stellarkrone-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-stellarkrone-etb' AND o2.retailer_id = r.id
      AND o2.price = 46.99 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-h-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 46.99 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 46.99 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 37.99, 51, '2026-07-16', '2026-08-06',
  'LOCAL', 'Instagram', NULL, 'PROBABLE',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-paradoxrift-premium'
  AND r.retailer_group = 'games_island' AND r.retailer_brand = 'Games Island'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-paradoxrift-premium' AND o2.retailer_id = r.id
      AND o2.price = 37.99 AND o2.valid_from = '2026-07-16'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'games-island-m-1'
WHERE p.slug = 'p-paradoxrift-premium' AND o.price = 37.99 AND o.valid_from = '2026-07-16'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 24.99, 33.5, '2026-07-22', '2026-07-26',
  'REGIONAL', 'App', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-maskerade-bundle'
  AND r.retailer_group = 'budni' AND r.retailer_brand = 'Budni'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-maskerade-bundle' AND o2.retailer_id = r.id
      AND o2.price = 24.99 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'budni-hh-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 24.99 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 154.99, 184.99, '2026-07-20', '2026-07-28',
  'REGIONAL', 'Prospekt', NULL, 'REGIONAL_CONFIRMED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-reisegefaehrten-display'
  AND r.retailer_group = 'famila' AND r.retailer_brand = 'famila Nordwest'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-reisegefaehrten-display' AND o2.retailer_id = r.id
      AND o2.price = 154.99 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'famila-hh-1'
WHERE p.slug = 'p-reisegefaehrten-display' AND o.price = 154.99 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'famila-ki-1'
WHERE p.slug = 'p-reisegefaehrten-display' AND o.price = 154.99 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 64.99, 54.99, '2026-07-21', '2026-08-21',
  'ONLINE', 'Online-Shop', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-dunkelnacht-etb'
  AND r.retailer_group = 'mediamarkt' AND r.retailer_brand = 'MediaMarkt'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-dunkelnacht-etb' AND o2.retailer_id = r.id
      AND o2.price = 64.99 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 13.17, 14.99, '2026-07-22', '2026-08-04',
  'STORE_GROUP', 'Community-Fund', NULL, 'REGIONAL_CONFIRMED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-zeitlose-rivalen-blister'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-zeitlose-rivalen-blister' AND o2.retailer_id = r.id
      AND o2.price = 13.17 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-zeitlose-rivalen-blister' AND o.price = 13.17 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-zeitlose-rivalen-blister' AND o.price = 13.17 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-zeitlose-rivalen-blister' AND o.price = 13.17 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 72.46, 82.9, '2026-07-18', '2026-07-25',
  'LOCAL', 'App', NULL, 'VERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-paldeas-schicksale-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-paldeas-schicksale-etb' AND o2.retailer_id = r.id
      AND o2.price = 72.46 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-paldeas-schicksale-etb' AND o.price = 72.46 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 37.370000000000005, 39.99, '2026-07-17', '2026-07-23',
  'REGIONAL', 'Prospekt', NULL, 'COMMUNITY_UNVERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-fpc3-collection'
  AND r.retailer_group = 'famila' AND r.retailer_brand = 'famila Nordwest'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-fpc3-collection' AND o2.retailer_id = r.id
      AND o2.price = 37.370000000000005 AND o2.valid_from = '2026-07-17'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'famila-hh-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 37.370000000000005 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'famila-ki-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 37.370000000000005 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 22.319999999999997, 24.99, '2026-07-20', '2026-07-23',
  'STORE_GROUP', 'Community-Fund', NULL, 'COMMUNITY_UNVERIFIED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-mega-forces-tin'
  AND r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-mega-forces-tin' AND o2.retailer_id = r.id
      AND o2.price = 22.319999999999997 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-l-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 22.319999999999997 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-ob-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 22.319999999999997 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-du-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 22.319999999999997 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 50.25, 54.99, '2026-07-19', '2026-07-31',
  'NATIONAL', 'Prospekt', NULL, 'REGIONAL_CONFIRMED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-dunkelnacht-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-dunkelnacht-etb' AND o2.retailer_id = r.id
      AND o2.price = 50.25 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-n-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 50.25 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 50.25 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 50.25 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 50.25 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 50.25 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 50.25 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-lb-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 50.25 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 37.45, 33.5, '2026-07-21', '2026-08-03',
  'REGIONAL', 'Händlerseite', NULL, 'PROBABLE',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-maskerade-bundle'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-maskerade-bundle' AND o2.retailer_id = r.id
      AND o2.price = 37.45 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 37.45 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 37.45 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 37.45 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 37.45 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 80.97999999999999, 82.9, '2026-07-17', '2026-07-21',
  'LOCAL', 'App', NULL, 'COMMUNITY_UNVERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-paldeas-schicksale-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-paldeas-schicksale-etb' AND o2.retailer_id = r.id
      AND o2.price = 80.97999999999999 AND o2.valid_from = '2026-07-17'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-paldeas-schicksale-etb' AND o.price = 80.97999999999999 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 34.11, 33.5, '2026-07-19', '2026-07-23',
  'REGIONAL', 'Händlerseite', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-maskerade-bundle'
  AND r.retailer_group = 'mediamarkt' AND r.retailer_brand = 'MediaMarkt'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-maskerade-bundle' AND o2.retailer_id = r.id
      AND o2.price = 34.11 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-ob-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 34.11 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-m-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 34.11 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-hh-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 34.11 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-b-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 34.11 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 50.42, 58.9, '2026-07-20', '2026-07-29',
  'LOCAL', 'Instagram', NULL, 'COMMUNITY_UNVERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-stellarkrone-etb'
  AND r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-stellarkrone-etb' AND o2.retailer_id = r.id
      AND o2.price = 50.42 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-du-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 50.42 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 26.439999999999998, 33.5, '2026-07-19', '2026-07-25',
  'LOCAL', 'App', NULL, 'PROBABLE',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-maskerade-bundle'
  AND r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-maskerade-bundle' AND o2.retailer_id = r.id
      AND o2.price = 26.439999999999998 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-ob-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 26.439999999999998 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 77.53999999999999, 82.9, '2026-07-21', '2026-07-27',
  'REGIONAL', 'App', NULL, 'PROBABLE',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-paldeas-schicksale-etb'
  AND r.retailer_group = 'games_island' AND r.retailer_brand = 'Games Island'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-paldeas-schicksale-etb' AND o2.retailer_id = r.id
      AND o2.price = 77.53999999999999 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'games-island-m-1'
WHERE p.slug = 'p-paldeas-schicksale-etb' AND o.price = 77.53999999999999 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 200.61, 229, '2026-07-19', '2026-07-22',
  'NATIONAL', 'Instagram', NULL, 'COMMUNITY_UNVERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-151-upc'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-151-upc' AND o2.retailer_id = r.id
      AND o2.price = 200.61 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-h-1'
WHERE p.slug = 'p-151-upc' AND o.price = 200.61 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-151-upc' AND o.price = 200.61 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-151-upc' AND o.price = 200.61 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-151-upc' AND o.price = 200.61 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-151-upc' AND o.price = 200.61 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-151-upc' AND o.price = 200.61 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-lb-1'
WHERE p.slug = 'p-151-upc' AND o.price = 200.61 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 20.4, 24.99, '2026-07-17', '2026-07-20',
  'NATIONAL', 'Prospekt', NULL, 'COMMUNITY_UNVERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-mega-forces-tin'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-mega-forces-tin' AND o2.retailer_id = r.id
      AND o2.price = 20.4 AND o2.valid_from = '2026-07-17'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 20.4 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 20.4 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 20.4 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 20.4 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 20.4 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-lb-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 20.4 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'scheckin-lb-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 20.4 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 24.759999999999998, 24.99, '2026-07-18', '2026-07-24',
  'LOCAL', 'Händlerseite', NULL, 'REGIONAL_CONFIRMED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-mega-forces-tin'
  AND r.retailer_group = 'mediamarkt' AND r.retailer_brand = 'MediaMarkt'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-mega-forces-tin' AND o2.retailer_id = r.id
      AND o2.price = 24.759999999999998 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-hh-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 24.759999999999998 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 14.27, 14.99, '2026-07-17', '2026-07-24',
  'STORE_GROUP', 'Händlerseite', NULL, 'REGIONAL_CONFIRMED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-zeitlose-rivalen-blister'
  AND r.retailer_group = 'penny' AND r.retailer_brand = 'PENNY'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-zeitlose-rivalen-blister' AND o2.retailer_id = r.id
      AND o2.price = 14.27 AND o2.valid_from = '2026-07-17'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'penny-d-1'
WHERE p.slug = 'p-zeitlose-rivalen-blister' AND o.price = 14.27 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'penny-dd-1'
WHERE p.slug = 'p-zeitlose-rivalen-blister' AND o.price = 14.27 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 103.35, 104, '2026-07-18', '2026-07-28',
  'REGIONAL', 'Prospekt', NULL, 'VERIFIED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-brillante-sterne-etb'
  AND r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-brillante-sterne-etb' AND o2.retailer_id = r.id
      AND o2.price = 103.35 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-m-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 103.35 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-ob-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 103.35 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-du-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 103.35 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-s-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 103.35 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 32.97, 39.99, '2026-07-21', '2026-07-26',
  'STORE_GROUP', 'Prospekt', NULL, 'COMMUNITY_UNVERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-fpc3-collection'
  AND r.retailer_group = 'famila' AND r.retailer_brand = 'famila Nordwest'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-fpc3-collection' AND o2.retailer_id = r.id
      AND o2.price = 32.97 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'famila-ki-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 32.97 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'famila-hh-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 32.97 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 47.160000000000004, 54.99, '2026-07-19', '2026-07-27',
  'LOCAL', 'Prospekt', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-reisegefaehrten-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-reisegefaehrten-etb' AND o2.retailer_id = r.id
      AND o2.price = 47.160000000000004 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 47.160000000000004 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 71.77, 82.9, '2026-07-21', '2026-07-26',
  'NATIONAL', 'Community-Fund', NULL, 'COMMUNITY_UNVERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-paldeas-schicksale-etb'
  AND r.retailer_group = 'fantasywelt' AND r.retailer_brand = 'FantasyWelt'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-paldeas-schicksale-etb' AND o2.retailer_id = r.id
      AND o2.price = 71.77 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'fantasywelt-bn-1'
WHERE p.slug = 'p-paldeas-schicksale-etb' AND o.price = 71.77 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 102.16, 104, '2026-07-22', '2026-08-04',
  'NATIONAL', 'Händlerseite', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-brillante-sterne-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-brillante-sterne-etb' AND o2.retailer_id = r.id
      AND o2.price = 102.16 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 102.16 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 102.16 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 102.16 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 102.16 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 102.16 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-lb-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 102.16 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'scheckin-lb-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 102.16 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 27.79, 24.99, '2026-07-22', '2026-07-30',
  'LOCAL', 'App', NULL, 'COMMUNITY_UNVERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-mega-forces-tin'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-mega-forces-tin' AND o2.retailer_id = r.id
      AND o2.price = 27.79 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 27.79 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 53.050000000000004, 58.9, '2026-07-20', '2026-07-25',
  'LOCAL', 'App', NULL, 'COMMUNITY_UNVERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-stellarkrone-etb'
  AND r.retailer_group = 'netto_md' AND r.retailer_brand = 'Netto Marken-Discount'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-stellarkrone-etb' AND o2.retailer_id = r.id
      AND o2.price = 53.050000000000004 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'netto-hb-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 53.050000000000004 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 47.95, 58.9, '2026-07-20', '2026-08-02',
  'LOCAL', 'Prospekt', NULL, 'VERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-stellarkrone-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'Scheck-in-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-stellarkrone-etb' AND o2.retailer_id = r.id
      AND o2.price = 47.95 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'scheckin-lb-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 47.95 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 21.38, 24.99, '2026-07-18', '2026-08-01',
  'LOCAL', 'Instagram', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-mega-forces-tin'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-mega-forces-tin' AND o2.retailer_id = r.id
      AND o2.price = 21.38 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 21.38 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 52.39, 54.99, '2026-07-17', '2026-07-30',
  'STORE_GROUP', 'Instagram', NULL, 'REGIONAL_CONFIRMED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-reisegefaehrten-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'Scheck-in-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-reisegefaehrten-etb' AND o2.retailer_id = r.id
      AND o2.price = 52.39 AND o2.valid_from = '2026-07-17'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'scheckin-lb-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 52.39 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 52.39 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 52.39 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 26.36, 24.99, '2026-07-21', '2026-08-03',
  'LOCAL', 'Prospekt', NULL, 'COMMUNITY_UNVERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-mega-forces-tin'
  AND r.retailer_group = 'mueller' AND r.retailer_brand = 'Müller'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-mega-forces-tin' AND o2.retailer_id = r.id
      AND o2.price = 26.36 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mueller-koeln-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 26.36 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 60.74, 64.9, '2026-07-21', '2026-08-04',
  'LOCAL', 'App', NULL, 'COMMUNITY_UNVERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-obsidianflammen-etb'
  AND r.retailer_group = 'kodi' AND r.retailer_brand = 'KODi'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-obsidianflammen-etb' AND o2.retailer_id = r.id
      AND o2.price = 60.74 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kodi-bo-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 60.74 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 229.28, 229, '2026-07-21', '2026-07-29',
  'NATIONAL', 'Community-Fund', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-151-upc'
  AND r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-151-upc' AND o2.retailer_id = r.id
      AND o2.price = 229.28 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-l-1'
WHERE p.slug = 'p-151-upc' AND o.price = 229.28 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-ob-1'
WHERE p.slug = 'p-151-upc' AND o.price = 229.28 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-du-1'
WHERE p.slug = 'p-151-upc' AND o.price = 229.28 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-s-1'
WHERE p.slug = 'p-151-upc' AND o.price = 229.28 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-m-1'
WHERE p.slug = 'p-151-upc' AND o.price = 229.28 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-b-1'
WHERE p.slug = 'p-151-upc' AND o.price = 229.28 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 191.47, 229, '2026-07-19', '2026-08-02',
  'NATIONAL', 'Community-Fund', NULL, 'REGIONAL_CONFIRMED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-151-upc'
  AND r.retailer_group = 'gate' AND r.retailer_brand = 'Gate to the Games'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-151-upc' AND o2.retailer_id = r.id
      AND o2.price = 191.47 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'gate-do-1'
WHERE p.slug = 'p-151-upc' AND o.price = 191.47 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'gate-s-1'
WHERE p.slug = 'p-151-upc' AND o.price = 191.47 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'gate-b-1'
WHERE p.slug = 'p-151-upc' AND o.price = 191.47 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 32.940000000000005, 39.99, '2026-07-22', '2026-08-03',
  'STORE_GROUP', 'Instagram', NULL, 'PROBABLE',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-fpc3-collection'
  AND r.retailer_group = 'netto_md' AND r.retailer_brand = 'Netto Marken-Discount'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-fpc3-collection' AND o2.retailer_id = r.id
      AND o2.price = 32.940000000000005 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'netto-ms-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 32.940000000000005 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'netto-hb-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 32.940000000000005 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 56.89, 54.99, '2026-07-19', '2026-07-27',
  'NATIONAL', 'Community-Fund', NULL, 'PROBABLE',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-dunkelnacht-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'Marktkauf'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-dunkelnacht-etb' AND o2.retailer_id = r.id
      AND o2.price = 56.89 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 56.89 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 56.89 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 56.89 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 56.89 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 56.89 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-lb-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 56.89 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'scheckin-lb-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 56.89 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 56.36, 51, '2026-07-22', '2026-08-05',
  'REGIONAL', 'Prospekt', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-paradoxrift-premium'
  AND r.retailer_group = 'smyths' AND r.retailer_brand = 'Smyths Toys'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-paradoxrift-premium' AND o2.retailer_id = r.id
      AND o2.price = 56.36 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'smyths-fr-1'
WHERE p.slug = 'p-paradoxrift-premium' AND o.price = 56.36 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'smyths-do-1'
WHERE p.slug = 'p-paradoxrift-premium' AND o.price = 56.36 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 15.6, 14.99, '2026-07-20', '2026-07-28',
  'REGIONAL', 'Händlerseite', NULL, 'VERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-zeitlose-rivalen-blister'
  AND r.retailer_group = 'netto_md' AND r.retailer_brand = 'Netto Marken-Discount'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-zeitlose-rivalen-blister' AND o2.retailer_id = r.id
      AND o2.price = 15.6 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'netto-ms-1'
WHERE p.slug = 'p-zeitlose-rivalen-blister' AND o.price = 15.6 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'netto-hb-1'
WHERE p.slug = 'p-zeitlose-rivalen-blister' AND o.price = 15.6 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 49.81, 54.99, '2026-07-18', '2026-08-01',
  'NATIONAL', 'Instagram', NULL, 'VERIFIED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-reisegefaehrten-etb'
  AND r.retailer_group = 'smyths' AND r.retailer_brand = 'Smyths Toys'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-reisegefaehrten-etb' AND o2.retailer_id = r.id
      AND o2.price = 49.81 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'smyths-fr-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 49.81 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'smyths-do-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 49.81 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 33.410000000000004, 33.5, '2026-07-22', '2026-08-05',
  'NATIONAL', 'App', NULL, 'REGIONAL_CONFIRMED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-maskerade-bundle'
  AND r.retailer_group = 'mediamarkt' AND r.retailer_brand = 'MediaMarkt'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-maskerade-bundle' AND o2.retailer_id = r.id
      AND o2.price = 33.410000000000004 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-ob-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 33.410000000000004 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-m-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 33.410000000000004 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-hh-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 33.410000000000004 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-b-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 33.410000000000004 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 41.03, 51, '2026-07-18', '2026-07-31',
  'NATIONAL', 'Prospekt', NULL, 'PROBABLE',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-paradoxrift-premium'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'Marktkauf'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-paradoxrift-premium' AND o2.retailer_id = r.id
      AND o2.price = 41.03 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-paradoxrift-premium' AND o.price = 41.03 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-paradoxrift-premium' AND o.price = 41.03 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-paradoxrift-premium' AND o.price = 41.03 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-paradoxrift-premium' AND o.price = 41.03 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-paradoxrift-premium' AND o.price = 41.03 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-lb-1'
WHERE p.slug = 'p-paradoxrift-premium' AND o.price = 41.03 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'scheckin-lb-1'
WHERE p.slug = 'p-paradoxrift-premium' AND o.price = 41.03 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 43.38, 54.99, '2026-07-19', '2026-07-22',
  'NATIONAL', 'Händlerseite', NULL, 'REGIONAL_CONFIRMED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-reisegefaehrten-etb'
  AND r.retailer_group = 'netto_md' AND r.retailer_brand = 'Netto Marken-Discount'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-reisegefaehrten-etb' AND o2.retailer_id = r.id
      AND o2.price = 43.38 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'netto-hb-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 43.38 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'netto-ms-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 43.38 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 110.17999999999999, 104, '2026-07-21', '2026-08-03',
  'LOCAL', 'Händlerseite', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-brillante-sterne-etb'
  AND r.retailer_group = 'mueller' AND r.retailer_brand = 'Müller'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-brillante-sterne-etb' AND o2.retailer_id = r.id
      AND o2.price = 110.17999999999999 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mueller-ka-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 110.17999999999999 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 52.95, 58.9, '2026-07-18', '2026-07-29',
  'NATIONAL', 'Händlerseite', NULL, 'COMMUNITY_UNVERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-stellarkrone-etb'
  AND r.retailer_group = 'gate' AND r.retailer_brand = 'Gate to the Games'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-stellarkrone-etb' AND o2.retailer_id = r.id
      AND o2.price = 52.95 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'gate-do-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 52.95 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'gate-s-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 52.95 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'gate-b-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 52.95 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 25.88, 24.99, '2026-07-17', '2026-07-22',
  'LOCAL', 'Prospekt', NULL, 'PROBABLE',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-mega-forces-tin'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-mega-forces-tin' AND o2.retailer_id = r.id
      AND o2.price = 25.88 AND o2.valid_from = '2026-07-17'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-f-1'
WHERE p.slug = 'p-mega-forces-tin' AND o.price = 25.88 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 54.02, 54.99, '2026-07-20', '2026-07-31',
  'NATIONAL', 'App', NULL, 'REGIONAL_CONFIRMED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-dunkelnacht-etb'
  AND r.retailer_group = 'rofu' AND r.retailer_brand = 'ROFU Kinderland'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-dunkelnacht-etb' AND o2.retailer_id = r.id
      AND o2.price = 54.02 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'rofu-a-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 54.02 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 98, 104, '2026-07-18', '2026-08-01',
  'REGIONAL', 'Prospekt', NULL, 'VERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-brillante-sterne-etb'
  AND r.retailer_group = 'rewe' AND r.retailer_brand = 'REWE Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-brillante-sterne-etb' AND o2.retailer_id = r.id
      AND o2.price = 98 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'rewecenter-koeln-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 98 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 56.46, 54.99, '2026-07-21', '2026-07-24',
  'LOCAL', 'Händlerseite', NULL, 'REGIONAL_CONFIRMED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-dunkelnacht-etb'
  AND r.retailer_group = 'kodi' AND r.retailer_brand = 'KODi'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-dunkelnacht-etb' AND o2.retailer_id = r.id
      AND o2.price = 56.46 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kodi-bo-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 56.46 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 37.09, 39.99, '2026-07-18', '2026-07-25',
  'STORE_GROUP', 'Instagram', NULL, 'COMMUNITY_UNVERIFIED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-fpc3-collection'
  AND r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-fpc3-collection' AND o2.retailer_id = r.id
      AND o2.price = 37.09 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-m-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 37.09 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-ob-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 37.09 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-du-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 37.09 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 206.79000000000002, 229, '2026-07-18', '2026-07-28',
  'NATIONAL', 'App', NULL, 'COMMUNITY_UNVERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-151-upc'
  AND r.retailer_group = 'penny' AND r.retailer_brand = 'PENNY'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-151-upc' AND o2.retailer_id = r.id
      AND o2.price = 206.79000000000002 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'penny-dd-1'
WHERE p.slug = 'p-151-upc' AND o.price = 206.79000000000002 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'penny-d-1'
WHERE p.slug = 'p-151-upc' AND o.price = 206.79000000000002 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 71.35, 64.9, '2026-07-20', '2026-07-24',
  'STORE_GROUP', 'Händlerseite', NULL, 'PROBABLE',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-obsidianflammen-etb'
  AND r.retailer_group = 'mediamarkt' AND r.retailer_brand = 'MediaMarkt'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-obsidianflammen-etb' AND o2.retailer_id = r.id
      AND o2.price = 71.35 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-hh-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 71.35 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-ob-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 71.35 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'mediamarkt-m-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 71.35 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 57.080000000000005, 54.99, '2026-07-21', '2026-07-26',
  'NATIONAL', 'Händlerseite', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-reisegefaehrten-etb'
  AND r.retailer_group = 'galeria' AND r.retailer_brand = 'Galeria'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-reisegefaehrten-etb' AND o2.retailer_id = r.id
      AND o2.price = 57.080000000000005 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'galeria-f-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 57.080000000000005 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'galeria-koeln-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 57.080000000000005 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 70.14, 64.9, '2026-07-21', '2026-07-27',
  'NATIONAL', 'Community-Fund', NULL, 'REGIONAL_CONFIRMED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-obsidianflammen-etb'
  AND r.retailer_group = 'games_island' AND r.retailer_brand = 'Games Island'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-obsidianflammen-etb' AND o2.retailer_id = r.id
      AND o2.price = 70.14 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'games-island-m-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 70.14 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 64.92, 58.9, '2026-07-17', '2026-07-26',
  'NATIONAL', 'Community-Fund', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-stellarkrone-etb'
  AND r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-stellarkrone-etb' AND o2.retailer_id = r.id
      AND o2.price = 64.92 AND o2.valid_from = '2026-07-17'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-m-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 64.92 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-ob-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 64.92 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-du-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 64.92 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-s-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 64.92 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-b-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 64.92 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-l-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 64.92 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 29.2, 33.5, '2026-07-19', '2026-07-30',
  'NATIONAL', 'Händlerseite', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-maskerade-bundle'
  AND r.retailer_group = 'galeria' AND r.retailer_brand = 'Galeria'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-maskerade-bundle' AND o2.retailer_id = r.id
      AND o2.price = 29.2 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'galeria-f-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 29.2 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'galeria-koeln-1'
WHERE p.slug = 'p-maskerade-bundle' AND o.price = 29.2 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 82.17, 104, '2026-07-18', '2026-07-31',
  'LOCAL', 'App', NULL, 'COMMUNITY_UNVERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-brillante-sterne-etb'
  AND r.retailer_group = 'rossmann' AND r.retailer_brand = 'Rossmann'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-brillante-sterne-etb' AND o2.retailer_id = r.id
      AND o2.price = 82.17 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'rossmann-e-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 82.17 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 50.75, 64.9, '2026-07-17', '2026-07-26',
  'NATIONAL', 'Instagram', NULL, 'VERIFIED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-obsidianflammen-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'Marktkauf'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-obsidianflammen-etb' AND o2.retailer_id = r.id
      AND o2.price = 50.75 AND o2.valid_from = '2026-07-17'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 50.75 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 50.75 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 50.75 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 50.75 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 50.75 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-lb-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 50.75 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'scheckin-lb-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 50.75 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 57.09, 58.9, '2026-07-18', '2026-07-21',
  'REGIONAL', 'Händlerseite', NULL, 'REGIONAL_CONFIRMED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-stellarkrone-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-stellarkrone-etb' AND o2.retailer_id = r.id
      AND o2.price = 57.09 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 57.09 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 57.09 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 57.09 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 57.09 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 95.86, 104, '2026-07-22', '2026-08-05',
  'REGIONAL', 'App', NULL, 'REGIONAL_CONFIRMED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-brillante-sterne-etb'
  AND r.retailer_group = 'kaufland' AND r.retailer_brand = 'Kaufland'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-brillante-sterne-etb' AND o2.retailer_id = r.id
      AND o2.price = 95.86 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-ob-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 95.86 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-du-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 95.86 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-s-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 95.86 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kaufland-m-1'
WHERE p.slug = 'p-brillante-sterne-etb' AND o.price = 95.86 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 58.81, 54.99, '2026-07-22', '2026-07-31',
  'REGIONAL', 'Community-Fund', NULL, 'COMMUNITY_UNVERIFIED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-reisegefaehrten-etb'
  AND r.retailer_group = 'gate' AND r.retailer_brand = 'Gate to the Games'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-reisegefaehrten-etb' AND o2.retailer_id = r.id
      AND o2.price = 58.81 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'gate-b-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 58.81 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'gate-do-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 58.81 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'gate-s-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 58.81 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 13.73, 14.99, '2026-07-20', '2026-08-02',
  'STORE_GROUP', 'Prospekt', NULL, 'VERIFIED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-zeitlose-rivalen-blister'
  AND r.retailer_group = 'kodi' AND r.retailer_brand = 'KODi'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-zeitlose-rivalen-blister' AND o2.retailer_id = r.id
      AND o2.price = 13.73 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'kodi-bo-1'
WHERE p.slug = 'p-zeitlose-rivalen-blister' AND o.price = 13.73 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 55.120000000000005, 54.99, '2026-07-22', '2026-07-27',
  'NATIONAL', 'Händlerseite', NULL, 'PROBABLE',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-dunkelnacht-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'EDEKA'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-dunkelnacht-etb' AND o2.retailer_id = r.id
      AND o2.price = 55.120000000000005 AND o2.valid_from = '2026-07-22'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 55.120000000000005 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 55.120000000000005 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 55.120000000000005 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 55.120000000000005 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 55.120000000000005 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-lb-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 55.120000000000005 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'scheckin-lb-1'
WHERE p.slug = 'p-dunkelnacht-etb' AND o.price = 55.120000000000005 AND o.valid_from = '2026-07-22'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 69.05999999999999, 64.9, '2026-07-20', '2026-07-29',
  'NATIONAL', 'Community-Fund', NULL, 'REGIONAL_CONFIRMED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-obsidianflammen-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-obsidianflammen-etb' AND o2.retailer_id = r.id
      AND o2.price = 69.05999999999999 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-h-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 69.05999999999999 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 69.05999999999999 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 69.05999999999999 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 69.05999999999999 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-koeln-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 69.05999999999999 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-d-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 69.05999999999999 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-lb-1'
WHERE p.slug = 'p-obsidianflammen-etb' AND o.price = 69.05999999999999 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 64.00999999999999, 58.9, '2026-07-20', '2026-07-30',
  'LOCAL', 'App', NULL, 'COMMUNITY_UNVERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-stellarkrone-etb'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-stellarkrone-etb' AND o2.retailer_id = r.id
      AND o2.price = 64.00999999999999 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 64.00999999999999 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 51.510000000000005, 58.9, '2026-07-21', '2026-08-03',
  'LOCAL', 'Händlerseite', NULL, 'VERIFIED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-stellarkrone-etb'
  AND r.retailer_group = 'smyths' AND r.retailer_brand = 'Smyths Toys'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-stellarkrone-etb' AND o2.retailer_id = r.id
      AND o2.price = 51.510000000000005 AND o2.valid_from = '2026-07-21'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'smyths-do-1'
WHERE p.slug = 'p-stellarkrone-etb' AND o.price = 51.510000000000005 AND o.valid_from = '2026-07-21'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 37.190000000000005, 39.99, '2026-07-18', '2026-07-30',
  'REGIONAL', 'App', NULL, 'PROBABLE',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-fpc3-collection'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-fpc3-collection' AND o2.retailer_id = r.id
      AND o2.price = 37.190000000000005 AND o2.valid_from = '2026-07-18'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-s-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 37.190000000000005 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'edeka-ob-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 37.190000000000005 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-e-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 37.190000000000005 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'marktkauf-do-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 37.190000000000005 AND o.valid_from = '2026-07-18'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 40.72, 39.99, '2026-07-17', '2026-07-23',
  'LOCAL', 'Community-Fund', NULL, 'REGIONAL_CONFIRMED',
  'verfuegbar', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-fpc3-collection'
  AND r.retailer_group = 'edeka' AND r.retailer_brand = 'E-Center'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-fpc3-collection' AND o2.retailer_id = r.id
      AND o2.price = 40.72 AND o2.valid_from = '2026-07-17'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'ecenter-h-1'
WHERE p.slug = 'p-fpc3-collection' AND o.price = 40.72 AND o.valid_from = '2026-07-17'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 43.09, 54.99, '2026-07-20', '2026-07-24',
  'STORE_GROUP', 'App', NULL, 'VERIFIED',
  'ausverkauft', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-reisegefaehrten-etb'
  AND r.retailer_group = 'penny' AND r.retailer_brand = 'PENNY'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-reisegefaehrten-etb' AND o2.retailer_id = r.id
      AND o2.price = 43.09 AND o2.valid_from = '2026-07-20'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'penny-dd-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 43.09 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'penny-d-1'
WHERE p.slug = 'p-reisegefaehrten-etb' AND o.price = 43.09 AND o.valid_from = '2026-07-20'
ON CONFLICT DO NOTHING;
INSERT INTO offers (product_id, retailer_id, price, regular_price, valid_from, valid_until,
  validity_type, source_type, source_url, verification_status, stock_signal, stock_signal_at)
SELECT p.id, r.id, 228.59, 229, '2026-07-19', '2026-07-24',
  'LOCAL', 'Händlerseite', NULL, 'VERIFIED',
  'wenig_bestand', '2026-07-22'::timestamptz
FROM products p, retailers r
WHERE p.slug = 'p-151-upc'
  AND r.retailer_group = 'netto_md' AND r.retailer_brand = 'Netto Marken-Discount'
  AND NOT EXISTS (
    SELECT 1 FROM offers o2 JOIN products p2 ON p2.id = o2.product_id
    WHERE p2.slug = 'p-151-upc' AND o2.retailer_id = r.id
      AND o2.price = 228.59 AND o2.valid_from = '2026-07-19'
  );
INSERT INTO offer_locations (offer_id, location_id)
SELECT o.id, rl.id
FROM offers o
  JOIN products p ON p.id = o.product_id
  JOIN retailer_locations rl ON rl.external_store_id = 'netto-ms-1'
WHERE p.slug = 'p-151-upc' AND o.price = 228.59 AND o.valid_from = '2026-07-19'
ON CONFLICT DO NOTHING;

-- Live Drops & Restocks
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'Pokémon Center' LIMIT 1),
  'restock', true, 54.99, 'verfuegbar', true,
  'Pokémon Center', 'https://www.pokemoncenter.com/', now() - (2 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-dunkelnacht-etb'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-dunkelnacht-etb' AND dd.source_name = 'Pokémon Center' AND dd.kind = 'restock');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'Pokémon Center' LIMIT 1),
  'restock', true, 119.99, 'wenig_bestand', true,
  'Pokémon Center', NULL, now() - (6 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-151-upc'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-151-upc' AND dd.source_name = 'Pokémon Center' AND dd.kind = 'restock');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'Pokémon Center' LIMIT 1),
  'drop', true, 179.99, 'verfuegbar', true,
  'Pokémon Center', NULL, now() - (11 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-reisegefaehrten-display'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-reisegefaehrten-display' AND dd.source_name = 'Pokémon Center' AND dd.kind = 'drop');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'FantasyWelt' LIMIT 1),
  'new_product', false, 22.99, 'verfuegbar', false,
  'FantasyWelt', 'https://www.fantasywelt.de/', now() - (18 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-mega-forces-tin'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-mega-forces-tin' AND dd.source_name = 'FantasyWelt' AND dd.kind = 'new_product');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'Games Island' LIMIT 1),
  'restock', false, 39.99, 'wenig_bestand', false,
  'Games Island', NULL, now() - (24 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-fpc3-collection'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-fpc3-collection' AND dd.source_name = 'Games Island' AND dd.kind = 'restock');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'Gate to the Games' LIMIT 1),
  'restock', false, 59.9, 'verfuegbar', false,
  'Gate to the Games', NULL, now() - (33 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-obsidianflammen-etb'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-obsidianflammen-etb' AND dd.source_name = 'Gate to the Games' AND dd.kind = 'restock');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'Pokémon Center' LIMIT 1),
  'drop', true, 179.99, 'ausverkauft', true,
  'Pokémon Center', NULL, now() - (41 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-dunkelnacht-display'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-dunkelnacht-display' AND dd.source_name = 'Pokémon Center' AND dd.kind = 'drop');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'Smyths Toys Online' LIMIT 1),
  'restock', false, 49.99, 'wenig_bestand', false,
  'Smyths Toys Online', NULL, now() - (52 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-paldeas-schicksale-etb'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-paldeas-schicksale-etb' AND dd.source_name = 'Smyths Toys Online' AND dd.kind = 'restock');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'Müller Online' LIMIT 1),
  'new_product', false, 14.99, 'verfuegbar', false,
  'Müller Online', NULL, now() - (68 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-zeitlose-rivalen-blister'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-zeitlose-rivalen-blister' AND dd.source_name = 'Müller Online' AND dd.kind = 'new_product');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'Pokémon Center' LIMIT 1),
  'restock', true, 54.99, 'verfuegbar', false,
  'Pokémon Center', NULL, now() - (84 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-stellarkrone-etb'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-stellarkrone-etb' AND dd.source_name = 'Pokémon Center' AND dd.kind = 'restock');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'FantasyWelt' LIMIT 1),
  'restock', false, 34.99, 'wenig_bestand', false,
  'FantasyWelt', NULL, now() - (96 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-paradoxrift-premium'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-paradoxrift-premium' AND dd.source_name = 'FantasyWelt' AND dd.kind = 'restock');
INSERT INTO drops (product_id, retailer_id, kind, is_pokemon_center, price, availability, hot, source_name, source_url, drop_at)
SELECT p.id,
  (SELECT id FROM retailers WHERE display_name = 'Games Island' LIMIT 1),
  'new_product', false, 26.99, 'verfuegbar', false,
  'Games Island', NULL, now() - (122 * INTERVAL '1 minute')
FROM products p WHERE p.slug = 'p-maskerade-bundle'
  AND NOT EXISTS (SELECT 1 FROM drops dd JOIN products pp ON pp.id = dd.product_id
                  WHERE pp.slug = 'p-maskerade-bundle' AND dd.source_name = 'Games Island' AND dd.kind = 'new_product');

-- Geruechte
INSERT INTO rumors (product_id, title, body, status, source_type, source_handle, source_count, confidence, posted_at)
VALUES ((SELECT id FROM products WHERE slug = 'p-dunkelnacht-display'),
  'Kaufland plant offenbar Dunkelnacht-Display-Aktion zum Wochenstart', 'Mehrere Prospekt-Leaks zeigen ein Display-Angebot deutlich unter UVP. Noch keine offizielle Bestätigung aus dem Zentraleinkauf.', 'MULTI_SOURCE_RUMOR', 'Instagram', '@prospekt.leaks.de',
  3, 0.62, now() - (27 * INTERVAL '1 minute'))
ON CONFLICT DO NOTHING;
INSERT INTO rumors (product_id, title, body, status, source_type, source_handle, source_count, confidence, posted_at)
VALUES ((SELECT id FROM products WHERE slug = 'p-151-upc'),
  'Pokémon Center: Restock der 151 UPC angeblich diese Woche', 'Ein Händler-Teaser deutet auf eine erneute Verfügbarkeit der Ultra-Premium-Kollektion hin. Wird als wahrscheinlich eingestuft.', 'LIKELY', 'Instagram', '@pokeradarde',
  2, 0.78, now() - (54 * INTERVAL '1 minute'))
ON CONFLICT DO NOTHING;
INSERT INTO rumors (product_id, title, body, status, source_type, source_handle, source_count, confidence, posted_at)
VALUES ((SELECT id FROM products WHERE slug = 'p-mega-forces-tin'),
  'Lokaler Kartenladen kündigt Mega-Forces-Nachschub an (Köln)', 'Story-Ankündigung eines Kölner Shops zu neuer Lieferung. Kurzfristig, daher schnell prüfen.', 'RUMOR', 'Instagram', '@cardcorner.koeln',
  1, 0.4, now() - (12 * INTERVAL '1 minute'))
ON CONFLICT DO NOTHING;
INSERT INTO rumors (product_id, title, body, status, source_type, source_handle, source_count, confidence, posted_at)
VALUES ((SELECT id FROM products WHERE slug = 'p-reisegefaehrten-etb'),
  'Netto-Prospekt KW31: Reisegefährten-ETB im Anmarsch?', 'Frühe Prospektvorschau in einer Facebook-Gruppe geteilt. Zwei unabhängige Poster berichten dasselbe.', 'MULTI_SOURCE_RUMOR', 'Facebook', 'Schnäppchen-Gruppe NRW',
  2, 0.58, now() - (88 * INTERVAL '1 minute'))
ON CONFLICT DO NOTHING;
INSERT INTO rumors (product_id, title, body, status, source_type, source_handle, source_count, confidence, posted_at)
VALUES (NULL,
  'Rossmann-App: Coupon auf Sammelkarten angeblich ab Donnerstag', 'Nutzerhinweis über einen bevorstehenden App-Coupon. Noch keine weitere Quelle.', 'RUMOR', 'Community-Fund', 'PokeDrop-Community',
  1, 0.35, now() - (40 * INTERVAL '1 minute'))
ON CONFLICT DO NOTHING;
INSERT INTO rumors (product_id, title, body, status, source_type, source_handle, source_count, confidence, posted_at)
VALUES ((SELECT id FROM products WHERE slug = 'p-fpc3-collection'),
  'First Partner Collection Serie 3 – breite Verfügbarkeit bestätigt', 'Offizielle Händlerkommunikation bestätigt die Auslieferung. Kann in den regulären Drop-Bereich überführt werden.', 'CONFIRMED', 'Händlerseite', 'Distributor DE',
  4, 0.95, now() - (150 * INTERVAL '1 minute'))
ON CONFLICT DO NOTHING;
INSERT INTO rumors (product_id, title, body, status, source_type, source_handle, source_count, confidence, posted_at)
VALUES ((SELECT id FROM products WHERE slug = 'p-stellarkrone-etb'),
  'Gerücht: Stellarkrone-Nachdruck sorgt für fallende Marktpreise', 'Diskussion in mehreren Sammler-Communities über einen möglichen Reprint. Auswirkung auf Deal-Schwellen wird beobachtet.', 'MULTI_SOURCE_RUMOR', 'Instagram', '@tcg.insights',
  3, 0.55, now() - (210 * INTERVAL '1 minute'))
ON CONFLICT DO NOTHING;
INSERT INTO rumors (product_id, title, body, status, source_type, source_handle, source_count, confidence, posted_at)
VALUES (NULL,
  'MediaMarkt-Aktion zu Booster-Displays am kommenden Samstag?', 'Ein Marktmitarbeiter soll eine lokale Wochenendaktion erwähnt haben. Sehr unsicher, nur eine Quelle.', 'RUMOR', 'Community-Fund', 'PokeDrop-Community',
  1, 0.3, now() - (75 * INTERVAL '1 minute'))
ON CONFLICT DO NOTHING;

-- Events
-- Duplikate aus frueheren Laeufen entfernen (es gab keinen Schluessel)
DELETE FROM events a USING events b
WHERE a.ctid > b.ctid
  AND a.event_name = b.event_name AND a.date_start = b.date_start AND a.city = b.city;
-- ab jetzt verhindert ein Schluessel Doppelungen
ALTER TABLE events DROP CONSTRAINT IF EXISTS events_natural_key;
ALTER TABLE events ADD CONSTRAINT events_natural_key UNIQUE (event_name, date_start, city);
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('PokéTausch Ruhrgebiet – Sommerbörse', 'Tauschbörse', '2026-07-25', NULL, '10:00 – 16:00 Uhr',
  'Turbinenhalle Oberhausen', 'Im Lipperfeld 23', '46047', 'Oberhausen',
  ST_SetSRID(ST_MakePoint(6.873, 51.487), 4326)::geography,
  'PokéTausch NRW e. V.', 'https://example.org/poketausch-nrw', 3, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-21')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Card Show Rheinland', 'Card Show', '2026-07-26', NULL, '09:00 – 17:00 Uhr',
  'MediaPark Köln, Halle 2', 'Im MediaPark 8', '50670', 'Köln',
  ST_SetSRID(ST_MakePoint(6.945, 50.949), 4326)::geography,
  'Rheinland Card Events', 'https://example.org/cardshow-rheinland', 8, 'https://example.org/tickets',
  'starker_anteil', true, 'bestaetigt', '2026-07-20')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Pokémon TCG Community-Treff München', 'Community-Treffen', '2026-07-24', NULL, '18:00 – 22:00 Uhr',
  'Games Island München', 'Schwanthalerstr. 32', '80336', 'München',
  ST_SetSRID(ST_MakePoint(11.556, 48.137), 4326)::geography,
  'Games Island', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-22')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Sammlerbörse Hamburg Nord', 'Sammlerbörse', '2026-08-02', NULL, '11:00 – 16:00 Uhr',
  'Bürgerhaus Wilhelmsburg', 'Mengestr. 20', '21107', 'Hamburg',
  ST_SetSRID(ST_MakePoint(10.013, 53.499), 4326)::geography,
  'Sammlerbörse Nord', NULL, 4, NULL,
  'multi_tcg', true, 'wahrscheinlich', '2026-07-19')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('TCG Grand Tournament + Trading Day', 'Turnier', '2026-08-08', '2026-08-09', '10:00 – 18:00 Uhr',
  'Messe Stuttgart, Halle 4', 'Messepiazza 1', '70629', 'Stuttgart',
  ST_SetSRID(ST_MakePoint(9.193, 48.69), 4326)::geography,
  'Southside TCG', 'https://example.org/grand-tournament', 25, 'https://example.org/tickets-gt',
  'pokemon_only', true, 'bestaetigt', '2026-07-18')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Pokémon Tauschbörse Berlin-Mitte', 'Tauschbörse', '2026-08-01', NULL, '12:00 – 17:00 Uhr',
  'Alte Münze', 'Am Krögel 2', '10179', 'Berlin',
  ST_SetSRID(ST_MakePoint(13.413, 52.515), 4326)::geography,
  'Berlin Poké Society', NULL, 5, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-21')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Sammelkartenmesse RheinMain', 'Sammelkartenmesse', '2026-09-05', '2026-09-06', '10:00 – 18:00 Uhr',
  'Messe Frankfurt, Halle 1', 'Ludwig-Erhard-Anlage 1', '60327', 'Frankfurt',
  ST_SetSRID(ST_MakePoint(8.643, 50.112), 4326)::geography,
  'CardExpo GmbH', 'https://example.org/cardexpo', 12, 'https://example.org/cardexpo-tickets',
  'starker_anteil', true, 'bestaetigt', '2026-07-15')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Dortmunder Kartentausch', 'Tauschbörse', '2026-08-15', NULL, '13:00 – 18:00 Uhr',
  'Dietrich-Keuning-Haus', 'Leopoldstr. 50-58', '44147', 'Dortmund',
  ST_SetSRID(ST_MakePoint(7.46, 51.523), 4326)::geography,
  'TCG Dortmund', NULL, 2, NULL,
  'pokemon_only', true, 'wahrscheinlich', '2026-07-17')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Nürnberg Toy & Card Fair', 'Card Show', '2026-09-19', NULL, '10:00 – 17:00 Uhr',
  'Meistersingerhalle', 'Münchener Str. 21', '90478', 'Nürnberg',
  ST_SetSRID(ST_MakePoint(11.1, 49.436), 4326)::geography,
  'Franken Cards', NULL, 7, NULL,
  'multi_tcg', true, 'bestaetigt', '2026-07-16')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Leipzig TCG Community Meetup', 'Community-Treffen', '2026-07-29', NULL, '17:30 – 21:00 Uhr',
  'Spielecafé Leipzig', 'Karl-Liebknecht-Str. 62', '04275', 'Leipzig',
  ST_SetSRID(ST_MakePoint(12.372, 51.323), 4326)::geography,
  'Leipzig TCG', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-20')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Hannover Sammlertag', 'Sammlerbörse', '2026-08-23', NULL, '10:00 – 15:00 Uhr',
  'HCC Hannover', 'Theodor-Heuss-Platz 1-3', '30175', 'Hannover',
  ST_SetSRID(ST_MakePoint(9.762, 52.379), 4326)::geography,
  'Sammlertag Nord', NULL, 5, NULL,
  'multi_tcg', true, 'wahrscheinlich', '2026-07-14')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Dresden Pokémon Trade Night', 'Tauschbörse', '2026-08-06', NULL, '18:00 – 22:00 Uhr',
  'Brettspiel-Bar Dresden', 'Alaunstr. 36', '01099', 'Dresden',
  ST_SetSRID(ST_MakePoint(13.754, 51.068), 4326)::geography,
  'Elbe TCG', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-18')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Card Show West – Düsseldorf', 'Card Show', '2026-09-12', NULL, '09:30 – 17:00 Uhr',
  'Areal Böhler', 'Hansaallee 321', '40549', 'Düsseldorf',
  ST_SetSRID(ST_MakePoint(6.73, 51.256), 4326)::geography,
  'West Card Events', 'https://example.org/cardshow-west', 9, NULL,
  'starker_anteil', true, 'bestaetigt', '2026-07-19')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Bremen Kartenflohmarkt', 'Sammlerbörse', '2026-08-30', NULL, '11:00 – 16:00 Uhr',
  'Bürgerhaus Weserterrassen', 'Osterdeich 70b', '28203', 'Bremen',
  ST_SetSRID(ST_MakePoint(8.828, 53.07), 4326)::geography,
  'Nordbörse', NULL, 3, NULL,
  'multi_tcg', true, 'unbestaetigt', '2026-07-12')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Kiel Trainer Trading Meetup', 'Community-Treffen', '2026-08-13', NULL, '18:00 – 21:30 Uhr',
  'famila Kiel – Eventfläche', 'Holstenstr. 74', '24103', 'Kiel',
  ST_SetSRID(ST_MakePoint(10.135, 54.323), 4326)::geography,
  'Kiel Poké Crew', NULL, NULL, NULL,
  'pokemon_only', true, 'wahrscheinlich', '2026-07-16')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Ludwigsburg TCG-Tauschtag', 'Tauschbörse', '2026-07-25', NULL, '10:00 – 14:00 Uhr',
  'Musikhalle Ludwigsburg', 'Bahnhofstr. 19', '71638', 'Ludwigsburg',
  ST_SetSRID(ST_MakePoint(9.187, 48.894), 4326)::geography,
  'Barock TCG', NULL, 2, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-21')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Card Show Süd – Augsburg', 'Card Show', '2026-10-03', '2026-10-04', '10:00 – 18:00 Uhr',
  'Schwabenhalle', 'Am Schwaneck 15', '86156', 'Augsburg',
  ST_SetSRID(ST_MakePoint(10.86, 48.352), 4326)::geography,
  'Süd Card Events', NULL, 10, NULL,
  'starker_anteil', true, 'bestaetigt', '2026-07-10')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Essen Trade & Play', 'Turnier', '2026-08-16', NULL, '11:00 – 19:00 Uhr',
  'Zeche Carl', 'Wilhelm-Nieswandt-Allee 100', '45326', 'Essen',
  ST_SetSRID(ST_MakePoint(7.009, 51.488), 4326)::geography,
  'Ruhr TCG League', NULL, 15, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-17')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Mannheim Sammelkartentag', 'Sammlerbörse', '2026-09-27', NULL, '10:00 – 16:00 Uhr',
  'Rosengarten Mannheim', 'Rosengartenplatz 2', '68161', 'Mannheim',
  ST_SetSRID(ST_MakePoint(8.476, 49.485), 4326)::geography,
  'Kurpfalz Cards', NULL, 6, NULL,
  'multi_tcg', true, 'wahrscheinlich', '2026-07-13')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Bonn Poké Trade Sunday', 'Tauschbörse', '2026-08-09', NULL, '12:00 – 16:00 Uhr',
  'FantasyWelt Bonn', 'Sternstr. 30', '53111', 'Bonn',
  ST_SetSRID(ST_MakePoint(7.0994, 50.736), 4326)::geography,
  'FantasyWelt', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-20')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Karlsruhe TCG Convention', 'Sammelkartenmesse', '2026-10-17', '2026-10-18', '10:00 – 18:00 Uhr',
  'Messe Karlsruhe', 'Messeallee 1', '76287', 'Rheinstetten',
  ST_SetSRID(ST_MakePoint(8.33, 48.97), 4326)::geography,
  'Baden Card Convention', 'https://example.org/karlsruhe-tcg', 14, NULL,
  'starker_anteil', true, 'bestaetigt', '2026-07-11')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Münster Kartenrunde', 'Community-Treffen', '2026-07-31', NULL, '18:00 – 21:00 Uhr',
  'Spieltrieb Münster', 'Hammer Str. 130', '48153', 'Münster',
  ST_SetSRID(ST_MakePoint(7.622, 51.945), 4326)::geography,
  'Münster TCG', NULL, NULL, NULL,
  'pokemon_only', true, 'wahrscheinlich', '2026-07-19')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Bochum Retro & TCG Börse', 'Sammlerbörse', '2026-08-22', NULL, '10:00 – 15:00 Uhr',
  'RuhrCongress Bochum', 'Stadionring 20', '44791', 'Bochum',
  ST_SetSRID(ST_MakePoint(7.24, 51.49), 4326)::geography,
  'Retro Ruhr', NULL, 4, NULL,
  'multi_tcg', true, 'bestaetigt', '2026-07-18')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Freiburg Trainer Trade Night', 'Tauschbörse', '2026-08-07', NULL, '18:30 – 22:00 Uhr',
  'Spielbar Freiburg', 'Wilhelmstr. 8', '79098', 'Freiburg',
  ST_SetSRID(ST_MakePoint(7.848, 47.997), 4326)::geography,
  'Breisgau TCG', NULL, NULL, NULL,
  'pokemon_only', true, 'wahrscheinlich', '2026-07-15')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Card Show Nord – Hamburg', 'Card Show', '2026-09-26', '2026-09-27', '10:00 – 18:00 Uhr',
  'Messehallen Hamburg', 'Messeplatz 1', '20357', 'Hamburg',
  ST_SetSRID(ST_MakePoint(9.975, 53.562), 4326)::geography,
  'Nord Card Events', 'https://example.org/cardshow-nord', 11, NULL,
  'starker_anteil', true, 'bestaetigt', '2026-07-12')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Wiesbaden Community Cup', 'Turnier', '2026-09-13', NULL, '10:00 – 17:00 Uhr',
  'Kulturzentrum Schlachthof', 'Murnaustr. 1', '65189', 'Wiesbaden',
  ST_SetSRID(ST_MakePoint(8.251, 50.068), 4326)::geography,
  'Rheingau TCG', NULL, 18, NULL,
  'pokemon_only', true, 'wahrscheinlich', '2026-07-16')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Duisburg Tausch am Hafen', 'Tauschbörse', '2026-08-29', NULL, '11:00 – 16:00 Uhr',
  'Kultbunker', 'Am Innenhafen 12', '47059', 'Duisburg',
  ST_SetSRID(ST_MakePoint(6.771, 51.438), 4326)::geography,
  'Hafen TCG', NULL, 2, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-20')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Bielefeld Card Meetup', 'Community-Treffen', '2026-08-05', NULL, '18:00 – 21:00 Uhr',
  'Ludothek Bielefeld', 'Arndtstr. 6', '33602', 'Bielefeld',
  ST_SetSRID(ST_MakePoint(8.532, 52.021), 4326)::geography,
  'OWL TCG', NULL, NULL, NULL,
  'pokemon_only', true, 'unbestaetigt', '2026-07-14')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Kassel Mitte-Deutschland Börse', 'Sammlerbörse', '2026-09-20', NULL, '10:00 – 15:00 Uhr',
  'Kongress Palais Kassel', 'Holger-Börner-Platz 1', '34119', 'Kassel',
  ST_SetSRID(ST_MakePoint(9.488, 51.316), 4326)::geography,
  'Mitte Cards', NULL, 5, NULL,
  'multi_tcg', true, 'wahrscheinlich', '2026-07-13')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('PokéDrop Release-Party: Dunkelnacht', 'Community-Treffen', '2026-07-26', NULL, '14:00 – 20:00 Uhr',
  'Gate to the Games Dortmund', 'Westenhellweg 95', '44137', 'Dortmund',
  ST_SetSRID(ST_MakePoint(7.4585, 51.5142), 4326)::geography,
  'Gate to the Games', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-22')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Stuttgart Sunday Trade', 'Tauschbörse', '2026-08-16', NULL, '12:00 – 16:00 Uhr',
  'Gate to the Games Stuttgart', 'Eberhardstr. 61', '70173', 'Stuttgart',
  ST_SetSRID(ST_MakePoint(9.178, 48.771), 4326)::geography,
  'Gate to the Games', NULL, NULL, NULL,
  'pokemon_only', true, 'bestaetigt', '2026-07-21')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;
INSERT INTO events (event_name, event_type, date_start, date_end, opening_hours, venue_name,
  street, postal_code, city, location, organizer, official_source, ticket_price, ticket_url,
  pokemon_focus, trading_available, verification_status, last_checked)
VALUES ('Nürnberg Spielwarenmesse Sonderfläche TCG', 'Sammelkartenmesse', '2026-10-24', '2026-10-25', '09:00 – 18:00 Uhr',
  'Messe Nürnberg', 'Messezentrum 1', '90471', 'Nürnberg',
  ST_SetSRID(ST_MakePoint(11.123, 49.427), 4326)::geography,
  'Toy & Card Fair', 'https://example.org/nuernberg-messe', 16, NULL,
  'starker_anteil', true, 'bestaetigt', '2026-07-10')
ON CONFLICT ON CONSTRAINT events_natural_key DO NOTHING;

COMMIT;
