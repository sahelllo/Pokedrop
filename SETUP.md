# Einrichtung – Schritt für Schritt

Diese Anleitung setzt **kein Vorwissen** voraus. Wenn irgendwo steht "klicke
auf X", dann ist genau das gemeint.

**Gute Nachricht:** Für die normale Nutzung der Website musst du gar nichts
einrichten. Sie läuft bereits unter
**https://sahelllo.github.io/Pokedrop/**

Diese Anleitung brauchst du nur, wenn du selbst am Code arbeiten willst oder
die Datenbank neu aufsetzen möchtest.

---

## A) Die Website läuft schon – nichts zu tun

Bei jeder Änderung am Code baut GitHub die Seite automatisch neu und
veröffentlicht sie. Du musst nichts anstoßen.

---

## B) Datenbank neu aufsetzen (falls nötig)

Deine Datenbank liegt bei Supabase. Das ist ein kostenloser Dienst, der den
"Aktenschrank" für dich im Internet betreibt.

### B1 – Datenbank komplett neu aufbauen

1. Öffne **https://supabase.com/dashboard** und melde dich an.
2. Klicke auf dein Projekt.
3. Klicke links in der Leiste auf **„SQL Editor"** (das Symbol sieht aus wie `</>`).
4. Klicke auf **„New query"**. Es öffnet sich ein großes leeres Feld.
5. Öffne in einem neuen Browser-Tab die Datei **`db/setup-komplett.sql`**
   aus diesem Projekt.
6. Markiere dort alles (**Strg + A**) und kopiere es (**Strg + C**).
7. Gehe zurück zu Supabase, klicke in das große leere Feld und füge ein
   (**Strg + V**).
8. Klicke unten rechts auf den Knopf **„Run"**.
9. Es sollte **„Success. No rows returned"** erscheinen. Fertig.

> Diese Datei kann man **beliebig oft** ausführen. Sie überspringt alles, was
> schon da ist, und ergänzt nur, was fehlt.

### B2 – Prüfen, ob alles drin ist

Gleiches Vorgehen wie oben, aber diesen Text einfügen und auf „Run" klicken:

```sql
SELECT 'produkte' AS tabelle, count(*) FROM products
UNION ALL SELECT 'haendler',  count(*) FROM retailers
UNION ALL SELECT 'filialen',  count(*) FROM retailer_locations
UNION ALL SELECT 'angebote',  count(*) FROM offers
UNION ALL SELECT 'drops',     count(*) FROM drops
UNION ALL SELECT 'geruechte', count(*) FROM rumors
UNION ALL SELECT 'events',    count(*) FROM events;
```

**Erwartete Zahlen:** produkte 16, haendler 26, filialen 44, angebote 81,
drops 12, geruechte 8, events 32.

---

## C) Zugangsdaten hinterlegen (nur beim ersten Mal)

Damit die Website weiß, wo ihre Datenbank steht, braucht sie zwei Angaben.

### C1 – Die zwei Werte finden

1. In Supabase links unten auf **„Project Settings"** (Zahnrad-Symbol).
2. Dann auf **„API Keys"** bzw. **„API"**.
3. Dort stehen zwei Dinge, die du brauchst:
   - **Project URL** – sieht aus wie `https://xxxxxxxx.supabase.co`
   - **anon / publishable key** – ein langer Text, beginnt mit `sb_publishable_`
     oder `eyJ`

> ⚠️ **Wichtig:** Nimm **nur** den Schlüssel mit der Bezeichnung `anon` bzw.
> `publishable`. Falls dort auch `service_role` oder `secret` steht – **Finger
> weg**. Dieser Schlüssel hätte volle Rechte und darf nirgends hinterlegt
> werden, wo ihn jemand sehen kann.

### C2 – Bei GitHub hinterlegen

1. Öffne **https://github.com/sahelllo/Pokedrop/settings/secrets/actions/new**
2. **Oberes Feld** („Name"), genau so eintippen: `NEXT_PUBLIC_SUPABASE_URL`
3. **Unteres Feld** („Secret"): die Project URL einfügen
4. Grüner Knopf **„Add secret"**
5. Denselben Link nochmal öffnen und wiederholen mit:
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Secret: der `anon`-Schlüssel

**Am Ende müssen in der Liste genau diese zwei Namen stehen.** Die Werte
selbst sieht man danach nicht mehr – das ist richtig so, sie sind
verschlüsselt.

---

## D) Am Code arbeiten (nur für Entwickler)

Voraussetzung: **Node.js 20 oder neuer** von https://nodejs.org

```bash
npm install                 # einmalig: Bausteine herunterladen
cp .env.example .env.local  # Zugangsdaten-Vorlage kopieren
                            # danach .env.local öffnen und Werte eintragen
npm run dev                 # Website lokal starten → http://localhost:3000
```

Weitere nützliche Befehle:

| Befehl | Was er macht |
|---|---|
| `npm run verify` | Prüft alles auf einmal: Code-Fehler, Stil, Tests, Zusammenbau |
| `npm test` | Nur die Logik-Prüfungen (schnell) |
| `npm run test:e2e` | Der Roboter, der die Website wie ein Mensch durchklickt |
| `npm run db:check` | Zeigt, wie viele Einträge in der Datenbank stehen |
| `npm run db:seed` | Erzeugt die Datei mit den Beispieldaten neu |

---

## Wenn etwas nicht klappt

| Problem | Lösung |
|---|---|
| Website zeigt eine alte Version | Browser komplett schließen und neu öffnen. Am iPhone: die zum Home-Bildschirm gelegte App löschen und neu hinzufügen. |
| „Datenquelle: Demo-Daten" statt „Verbunden" | Die zwei GitHub-Einträge aus Abschnitt C prüfen – Namen müssen **exakt** stimmen. |
| SQL-Editor zeigt einen roten Fehler | Fehlertext kopieren und melden. Nichts geht dabei kaputt. |
| `npm install` schlägt fehl | Prüfen, ob Node.js 20+ installiert ist: `node --version` |
