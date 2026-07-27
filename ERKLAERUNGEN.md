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
