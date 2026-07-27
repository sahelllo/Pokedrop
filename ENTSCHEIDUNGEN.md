# Entscheidungen – welche Variante und warum

Hier steht bei jeder wichtigen Weggabelung, welche Möglichkeiten es gab,
wofür ich mich entschieden habe und aus welchem Grund.

---

## 1. Datenbank: Wo soll sie laufen?

| Variante | Vorteil | Nachteil |
|---|---|---|
| **A – Supabase (Cloud)** | Nichts zu installieren, Login und Datei-Speicher gleich dabei | Einmal ein Konto anlegen und zwei Zugangsdaten kopieren |
| B – Postgres per Docker | Läuft auf dem eigenen Rechner | Docker muss installiert werden – genau hier scheitern Anfänger häufig |
| C – ohne PostGIS (Umkreis per Formel im Code) | Weniger Installationsaufwand | Umkreis-Suche wäre bei sehr vielen Daten langsamer |

**Gewählt: A.** Umgesetzt und im Betrieb. Die Datenbank enthält 16 Produkte,
81 Angebote, 44 Filialen, 32 Events und antwortet zuverlässig.

Variante C wurde ausdrücklich geprüft, weil PostGIS (die Landkarten-Erweiterung
der Datenbank) als möglicher Stolperstein galt. **Sie war es nicht** – PostGIS
läuft einwandfrei, die Umkreis-Suche liefert Entfernungen metergenau. Damit
entfällt der Grund für den Ausweichweg, und wir behalten die schnellere Lösung.

---

## 2. Wie kommen die Daten in die App?

| Variante | Vorteil | Nachteil |
|---|---|---|
| Nur Datenbank | Immer aktuell | Seite wäre leer, wenn die Datenbank mal nicht antwortet |
| Nur Beispieldaten | Kann nie ausfallen | Nichts lässt sich pflegen |
| **Beides mit Umschaltung** | Immer eine funktionierende Seite | Etwas mehr Code |

**Gewählt: Beides.** Die App startet immer mit Beispieldaten (dadurch ist sofort
etwas zu sehen) und ersetzt sie durch die echten Daten, sobald die Datenbank
geantwortet hat. Fällt die Datenbank aus, bleibt die Seite benutzbar und zeigt
dezent „Demo-Daten" an.

---

## 3. Design-Leitbild

Drei Welten wurden **als echter Live-Feed in Handy-Breite gebaut** und
nebeneinander verglichen (nicht nur beschrieben).

| Kriterium | A · RADAR | B · TERMINAL | C · VAULT |
|---|---|---|---|
| Wiedererkennbarkeit | **stark** – Ortungsgerät-Optik, Entfernungs-Ringe | mittel – erinnert an Börsen-Apps | schwach – Karten mit Farbverlauf sieht man überall |
| Übersichtlichkeit | gut | **sehr gut** – viel Information auf wenig Platz | mäßig – nur 3 Einträge passen auf den Schirm |
| Bedienbarkeit mit dem Daumen | **sehr gut** – große Reihen | mittel – enge Zeilen | gut, aber viel Scrollen |
| Umsetzbarkeit | gut | gut | mittel |

**Gewählt: A · RADAR.**

Begründung in drei Sätzen: Der Entfernungs-Ring macht die wichtigste Information
der App – *wie weit ist das von mir weg* – auf einen Blick begreifbar, ohne dass
man eine Zahl lesen muss. Die Radar-Optik erzählt genau das, was PokéDrop ist:
ein Ortungsgerät für Deals in der Nähe. Variante C fiel raus, weil sie gegen
zwei Punkte der Verbotsliste verstößt (Karten-Raster mit Farbverlauf), und
Variante B wirkt zu kühl und finanzlastig für eine Sammler-App.

**Was ich aus B übernehme:** die Idee der *Hitze-Farbe* für die Deal-Qualität.
Im Radar-Leitbild wird daraus der **Deal-Heat-Balken** – ein Angebot mit 28 %
unter UVP „glüht" heißer als eines mit 5 %.

---

## 4. Weitere Entscheidungen

| Thema | Gewählt | Warum |
|---|---|---|
| Zoom auf dem Handy | gesperrt | Ausdrücklicher Wunsch: Das Layout soll fest sitzen wie in einer App. Bewusst in Kauf genommener Nachteil bei der Barrierefreiheit. |
| Design-Werkzeuge im Repo | ausgeschlossen | Die Hilfsprogramme (rund 60 Dateien) gehören nicht in ein öffentliches Produkt-Repository. Sie bleiben lokal nutzbar. |
| Karten-Raster auf dem Handy | eine Spalte, ausdrücklich gesetzt | Ohne diese Angabe liefen die Karten rechts aus dem Bild – der gemeldete Fehler „man sieht die Sachen nur halb". |
