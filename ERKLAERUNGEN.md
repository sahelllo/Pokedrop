# PokéDrop – Erklärungen für Nicht-Techniker

Dieses Dokument ist dein Nachschlagewerk. Es erklärt jeden Fachbegriff in
normalem Deutsch und hält fest, was wann gebaut wurde und wozu.

---

## Teil 1: Was ist eine Datenbank – und warum braucht PokéDrop eine?

### Was ist eine Datenbank überhaupt?

Stell dir einen **sehr ordentlichen Aktenschrank** vor. Er hat beschriftete
Schubladen ("Händler", "Produkte", "Angebote"), und in jeder Schublade liegen
Karteikarten mit immer denselben Feldern. Eine Datenbank ist genau das – nur
als Programm, das auf einem Computer im Internet läuft.

Der entscheidende Unterschied zu einem echten Aktenschrank: Sie kann in
Sekundenbruchteilen antworten auf Fragen wie *"Zeig mir alle Angebote unter
50 Euro, die weniger als 25 km von Oberhausen entfernt sind und noch bis
Samstag gelten."*

### Warum braucht PokéDrop eine?

Ganz konkret an deiner App:

- **Wo sollen die Händler gespeichert werden?** Kaufland, EDEKA, Rossmann und
  alle Filialen mit ihren Adressen – aktuell 26 Händler und 44 Filialen.
- **Wo die Preise von gestern?** Ohne gespeicherte Vergangenheit kann niemand
  sagen, ob 149 € für ein Display gerade günstig ist oder nicht.
- **Wo die Alarm-Regeln deiner Nutzer?** "Sag mir Bescheid, wenn die
  Dunkelnacht-Box unter 45 € fällt" – das muss irgendwo dauerhaft liegen,
  auch wenn die Person das Handy weglegt.
- **Wo die Standorte?** Damit "im Umkreis von 25 km" überhaupt berechenbar
  ist, braucht jede Filiale gespeicherte Koordinaten (Längen- und Breitengrad,
  wie bei Google Maps).

### Warum reicht keine normale Datei?

Eine Datei ist wie ein Blatt Papier: Wenn **zwei Leute gleichzeitig** darauf
schreiben wollen, gibt es Chaos – der eine überschreibt den anderen. Bei
1000 gleichzeitigen Besuchern wäre das ein Desaster.

Und: Um in einer Datei etwas zu finden, muss man sie **komplett von vorne bis
hinten durchlesen**. Bei 100.000 Preiseinträgen dauert das ewig. Eine
Datenbank legt sich stattdessen ein *Register* an (wie das Stichwortverzeichnis
hinten in einem Buch) und findet den Eintrag sofort.

### Tabellen, Spalten, Zeilen, Verknüpfungen

| Begriff | Einfach erklärt | PokéDrop-Beispiel |
|---|---|---|
| **Tabelle** | Eine Schublade für eine Art von Dingen | die Schublade "Produkte" |
| **Spalte** | Ein Feld, das jede Karteikarte hat | "Name", "UVP", "Erscheinungsdatum" |
| **Zeile** | Eine einzelne Karteikarte | *Dunkelnacht Top-Trainer-Box, 54,99 €* |
| **Verknüpfung** (Fachwort: *Foreign Key*) | Ein Verweis von einer Karte auf eine andere | Das Angebot verweist auf das Produkt *und* auf den Händler – statt den Produktnamen 81-mal abzuschreiben |

Verknüpfungen sind wichtig, weil sie **Widersprüche verhindern**: Wenn du den
Produktnamen einmal änderst, stimmt er automatisch überall.

### Was ist eine Migration? Was ein Seed?

- **Migration** = ein **Bauplan-Schritt**. Eine Datei, die sagt: "Füge der
  Datenbank jetzt diese Schublade hinzu." Weil es Dateien sind, kann man den
  gesamten Aktenschrank jederzeit von null identisch nachbauen – auf jedem
  Computer, beliebig oft.
- **Seed** = **Möbel reinstellen**. Der Bauplan erstellt nur die leeren
  Schubladen. Der Seed legt die ersten Karteikarten hinein, damit die App
  nicht leer aussieht.

---

## Teil 2: Weitere Fachwörter

| Fachwort | Einfach erklärt |
|---|---|
| **Branch** (Arbeitszweig) | Eine Fotokopie des Projekts, auf der gearbeitet wird. Das Original bleibt unberührt, bis alles sicher ist. |
| **Commit** | Ein Speicherpunkt mit Notiz, wie beim Speichern in einem Spiel. Man kann jederzeit dorthin zurück. |
| **Deploy** | Veröffentlichen – die fertige Website ins Internet stellen. |
| **Build** | Das Zusammenbauen: Aus dem Programmiercode werden die fertigen Dateien, die ein Browser anzeigen kann. |
| **API** | Eine Durchreiche zwischen zwei Programmen. Die Website ruft dort Daten ab, wie bei einer Essensausgabe. |
| **Environment-Variable** | Ein Zettel mit einer Einstellung (z. B. der Adresse der Datenbank), der außerhalb des Codes liegt – damit Geheimnisse nicht im Code stehen. |
| **RLS** (Row Level Security) | Zeilen-Schutz: Regeln, die festlegen, wer welche Karteikarten sehen darf. Produkte darf jeder sehen, fremde Merklisten niemand. |
| **PostGIS** | Eine Zusatzfunktion der Datenbank, die mit Landkarten-Koordinaten rechnen kann ("was liegt im Umkreis von 25 km?"). |
| **Test** | Ein automatischer Prüfer. Er rechnet ein Beispiel mit bekanntem Ergebnis nach und schlägt Alarm, wenn etwas nicht stimmt. |
| **E2E-Test** | Ein Roboter, der die Website wie ein echter Mensch bedient: klickt, tippt, scrollt – und prüft, ob alles funktioniert. |
| **Hydration** | Der Moment, in dem die fertig angelieferte Seite im Browser "lebendig" wird (Knöpfe fangen an zu funktionieren). |
| **Fallback** | Ein Notfallplan: Wenn A nicht klappt, nimm automatisch B. Bei uns: Wenn die Datenbank schweigt, zeige Beispieldaten. |

---

## Teil 3: Verlauf – was wurde wann gebaut und wozu

### Vor diesem Umbau

| Was | Wozu |
|---|---|
| Website neu aufgebaut (Next.js) | Aus der einfachen Vorgänger-Seite wurde eine richtige App mit mehreren Bereichen. Die alte Version liegt unverändert im Ordner `legacy/`. |
| Deal-Bewertung | Rechnet aus, ob ein Preis gut ist – bei neuen Produkten gegen die UVP, bei älteren gegen den aktuellen Marktpreis. |
| Umkreis-Suche | Berechnet die Entfernung zu jeder Filiale und zeigt nur, was im eingestellten Radius liegt. |
| Karten-Scanner, Portfolio, Preisquellen | Zusätzliche Bereiche der App. |
| Datenbank angebunden (Supabase) | Die Daten liegen jetzt zentral im Internet statt fest im Code. |
| 122 automatische Tests | Prüfen bei jeder Änderung, ob noch alles stimmt. |

### Bekannte offene Punkte

- **Bilder:** Es werden nur frei nutzbare Pokémon-Renderbilder verlinkt.
  Für echte Produktfotos (Verpackungen) braucht es später Partnerprogramme
  oder eigene Aufnahmen. Betroffen sind alle Produktbilder in der App.
- **Bezahlung:** Der Premium-Schalter ist eine Vorschau, noch keine echte
  Abrechnung.

---

## Teil 4: Das Design-Leitbild „RADAR"

Die Website ist bewusst wie ein **Ortungsgerät** gestaltet – nicht wie ein
Standard-Dashboard. Alles folgt einer Idee: *Was ist in meiner Reichweite,
und wie gut ist es?*

### Die Signature-Elemente

Das sind wiedererkennbare Bausteine, die es so nur bei PokéDrop gibt.

**1. Distanz-Ring** (`components/signature/distance-ring.tsx`)
Der farbige Ring um jedes Produktbild zeigt, wie nah ein Angebot ist –
**ohne dass man eine Zahl lesen muss**.

| Ring | Bedeutung |
|---|---|
| fast geschlossen, hellgrün | ganz in der Nähe |
| halb voll, mittelgrün | mittlere Entfernung |
| schmaler Bogen, dunkelgrün | am Rand deines Umkreises |
| voller Ring, blau | Online-Angebot (überall gleich nah) |

**2. Deal-Heat-Balken** (`components/signature/heat-bar.tsx`)
Der dünne Balken unter jedem Angebot zeigt die Preisqualität als
**Temperatur**: Je weiter der Preis unter dem Referenzwert liegt, desto
heißer glüht er.

| Farbe | Bedeutung |
|---|---|
| grau-blau | kein Preisvorteil |
| gelb | leicht günstiger |
| orange | deutlich günstiger |
| rot | Top-Deal |

**3. Radar-Hintergrund** (`components/radar-background.tsx`)
Entfernungsringe, ein umlaufender Suchstrahl und einzelne Ping-Punkte.
Er erzählt dasselbe wie die App, bleibt aber im Hintergrund.

**4. Statuszeilen in Monospace**
Entfernungen, Preise und Zustände stehen in einer Schreibmaschinen-Schrift.
Grund: Die Zahlen stehen dadurch exakt untereinander und lassen sich
schneller vergleichen – wie auf einer Geräteanzeige.

### Bewegungs-Regeln (Motion-Signature)

- Nur **eine** Beschleunigungs-Kurve im ganzen Projekt
- Drei feste Zeiten: 150 ms (schnell), 240 ms (Standard), 400 ms (langsam)
- Nur `transform` und `opacity` werden animiert → flüssig auch auf älteren Handys
- Der Radar-Strahl pausiert, wenn der Tab im Hintergrund ist (schont Akku)
- Bei Systemeinstellung „Bewegung reduzieren" stehen alle Animationen still

### Bilder – rechtlicher Hinweis

Es werden **keine offiziellen Pokémon-Logos oder Produktfotos** fest im Code
verwendet. Aktuell werden frei nutzbare Pokémon-Renderbilder per Verweis
geladen; fällt die Quelle aus, erscheint automatisch ein farbiger Platzhalter
passend zum Energie-Typ.

**Stellen, an denen später lizenzierte oder händlereigene Bilder nötig sind:**
- Produktbilder auf Deal-Karten, Produktdetailseite, Portfolio und Scanner
- Händler-Logos (aktuell nur farbige Markierungen, keine echten Logos)

---

## Teil 5: Die Startseite als Übersicht

### Das Problem

Die Startseite war eine einzige lange Liste. Man scrollte auf dem Handy an
78 Angeboten vorbei – und erfuhr dabei nie, dass es auch Events, Gerüchte,
einen Karten-Scanner und eine Sammlung gibt.

### Die Lösung: Kacheln mit Zahlen

Die Startseite zeigt jetzt **zwölf Kacheln in drei Gruppen**. Jede Kachel ist
eine Kategorie und trägt eine Zahl: wie viel es dort gerade gibt.

| Gruppe | Kacheln | Bedeutung |
|---|---|---|
| **Angebote** | Top-Deals · Unter UVP · Im Laden · Online | Die vier Arten, ein Angebot zu suchen |
| **Entdecken** | Live Drops · Events · Gerüchte · Pokémon Center | Alles, was kein Preisangebot ist |
| **Meine Sachen** | Merkliste · Sammlung · Scanner · Premium | Was dir gehört |

Darunter stehen noch **drei** Angebote als Kostprobe – nicht achtzig. Wer alle
sehen will, tippt auf „Alle 78 Angebote ansehen" und landet auf der neuen
Angebotsseite.

### Warum die Zahlen immer stimmen

Es wäre ärgerlich, auf „22" zu tippen und dann 19 Karten zu sehen. Deshalb
gibt es im Programm **genau eine Regel pro Kategorie**. Dieselbe Regel wird
zum Zählen auf der Kachel *und* zum Filtern der Liste benutzt – ein
Auseinanderlaufen ist damit technisch ausgeschlossen. Sechs automatische
Tests prüfen das bei jeder Änderung nach.

### Was sich sonst geändert hat

- **Neue Seite „Angebote"** (`/deals`): die vollständige Liste mit den
  Kategorien als Knopfreihe oben.
- **Untere Leiste am Handy:** Start · Angebote · Live · Events · Sammlung.
  Alles andere ist von der Startseite aus einen Tipp entfernt.
- **Umkreis:** Der Schieberegler ist auf der Startseite durch fünf große
  Knöpfe ersetzt (10 / 50 / 100 / 300 / 500 km). Mit dem Daumen deutlich
  leichter zu treffen.
- **Filter:** Die Feineinstellungen (Set, Händler, Preisspanne) sitzen jetzt
  hinter dem Filter-Knopf, statt dauerhaft Platz zu belegen.

### Der Oma-Test

> *Kann jemand, der die App noch nie gesehen hat, in drei Tipps ein Angebot
> in seiner Nähe finden?*

1. App öffnen → man sieht sofort „Oberhausen · 500 km" und zwölf beschriftete
   Kacheln mit Zahlen.
2. Auf „Im Laden 76" tippen → die Liste zeigt ausschließlich Angebote zum
   Abholen, das Beste oben.
3. Auf ein Angebot tippen → Preis, Entfernung, Filiale und Gültigkeit.

Drei Tipps, kein Fachwort, kein Scrollen ins Leere.

---

## Teil 6: Der Scanner und die Sammlung

### Warum Strichcode und nicht Foto-Erkennung

Der alte Scanner tat nur so: Er wartete zwei Sekunden und würfelte dann ein
Produkt aus dem Katalog. Das war eine Attrappe.

Für echtes Erkennen gibt es zwei Wege:

| Weg | Wie es geht | Warum (nicht) |
|---|---|---|
| **Foto der Packung erkennen** | Ein Bilderkennungs-Dienst vergleicht dein Foto mit Millionen Bildern | Braucht einen kostenpflichtigen fremden Dienst, das Bild müsste hochgeladen werden, und bei ähnlichen Verpackungen rät er trotzdem |
| **Strichcode lesen** ✅ | Die Kamera liest die Nummer unter den schwarzen Strichen | Eindeutig, kostenlos, läuft komplett auf deinem Handy – und **jede** versiegelte Packung hat einen |

Gewählt wurde der Strichcode. PokéDrop handelt mit versiegelten Produkten –
Displays, Top-Trainer-Boxen, Blistern. Auf jedem klebt einer.

### Was passiert beim Scannen

1. Du tippst auf „Kamera starten" und hältst den Strichcode in den Rahmen.
2. Die App liest die Nummer – **automatisch**, du musst nichts drücken.
3. Sie prüft die **Prüfziffer**: Die letzte Ziffer eines Strichcodes ist eine
   Quersumme der anderen. Stimmt sie nicht, war das Bild verwackelt und die
   App liest weiter. Zusätzlich muss dieselbe Nummer **zweimal hintereinander**
   gelesen werden. So kann kein Zufallstreffer durchrutschen.
4. Preis, UVP, Seltenheit und das günstigste Angebot in deiner Nähe erscheinen.
5. Das Produkt wandert in deine Sammlung (abschaltbar, einzeln rückgängig).

### Wenn der Code unbekannt ist

Dann fragt die App einmal: *„Was ist das?"* Du suchst das Produkt aus der
Liste – und **ab da kennt der Scanner diesen Code**. Beim nächsten Mal wird
er sofort erkannt. Die Zuordnung liegt nur auf deinem Gerät.

Das ist der Grund, warum der Scanner auch mit echten Packungen funktioniert,
deren Nummer noch nicht im Katalog steht.

### Wie die Seltenheit berechnet wird

Seltenheit ist keine Meinung, sondern das, was der Markt verlangt:

```
Aufschlag = Marktpreis ÷ UVP − 1
```

| Aufschlag | Stufe |
|---|---|
| unter 5 % | Standard |
| ab 5 % | Gesucht |
| ab 20 % | Selten |
| ab 50 % | Sehr selten |
| ab 100 % | Sammlerstück |

Produkte, die **nicht mehr gedruckt werden**, rücken eine Stufe hoch – der
Nachschub ist versiegt. Die oberste Stufe muss ein Produkt sich aber am Markt
verdienen (echter Verdoppler), sonst wäre „Sammlerstück" wertlos.

Beispiel aus dem Katalog: *Celebrations Top-Trainer-Box*, UVP 49,99 €,
Marktpreis 154,99 € → **209 % Aufschlag → Sammlerstück**.

### Die Sammlung

Unter „Sammlung" steht:

- der **Gesamtwert** und der Gewinn gegenüber dem UVP-Einstand
- wie viele Stück, davon wie viele **gescannt**
- **Wert nach Seltenheit** – ein Balken, der zeigt, worin dein Geld steckt
- die Liste, standardmäßig **seltenstes zuerst** (umschaltbar auf Wert oder
  Neueste)

### Wie das getestet wird

Der Kamera-Weg lässt sich schwer „von Hand" prüfen, deshalb tut es ein
Roboter: Chromium bekommt statt einer echten Kamera **ein Video mit einem
echten EAN-13-Strichcode** untergeschoben (erzeugt von
`scripts/make-barcode-fixture.mjs`). Für die Seite ist das eine ganz normale
Kamera. Der Test prüft, dass die App den Code daraus liest, das richtige
Produkt zeigt und die Kamera danach wieder abschaltet.

Dazu kommen 30 weitere automatische Tests für Prüfziffer, UPC-Umrechnung,
unbekannte Codes, die Seltenheitsstufen und die Sammlung.
