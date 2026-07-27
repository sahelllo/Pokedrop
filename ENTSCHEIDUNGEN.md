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

---

## 5. Startseite: Übersicht statt Angebotsstrom

**Ausgangslage:** Rückmeldung nach dem RADAR-Umbau – *„Die Website ist auf dem
Handy immer noch schwer im Überblick zu haben, es soll einfach sein und
vielleicht kategorisch."*

Die Startseite war ein einziger langer Strom: Kopfbereich, Standort,
Statistiken, Live-Drops-Karussell, Filterleiste, Top-Deals **und danach alle
78 Angebote untereinander**. Auf einem 412 Pixel breiten Handy bedeutete das
rund zwölf Bildschirme Scrollen. Wer die App zum ersten Mal öffnete, sah nur
Angebote – und nicht, dass es auch Events, Gerüchte, einen Scanner und eine
Sammlung gibt.

### Verglichene Möglichkeiten

| | A · Strom kürzen | B · Kategorie-Übersicht | C · Tabs oben |
|---|---|---|---|
| Was es ist | wie bisher, aber nur 10 Angebote und „mehr laden" | Startseite = Kacheln pro Bereich, Angebote auf eigener Seite | Angebote in Reitern (Top / UVP / Laden / Online) |
| Überblick über die ganze App | schlecht – man sieht weiter nur Angebote | **sehr gut** – alle zwölf Bereiche auf zwei Bildschirmen | mittel |
| Wie viele Tipps bis zum Angebot | 0 | 2 | 1 |
| Aufwand | klein | mittel | klein |

**Gewählt: B.** Die Rückmeldung nennt zwei Dinge – *einfach* und
*kategorisch*. Nur B liefert beides: Jede Kachel ist eine Kategorie, trägt
eine Zahl und sagt in einem Satz, was dahintersteckt. Der eine zusätzliche
Tipp bis zum Angebot ist der Preis dafür, dass man überhaupt erst sieht, was
es alles gibt.

### Folgeentscheidungen

| Thema | Gewählt | Warum |
|---|---|---|
| Wohin mit der Angebotsliste | eigene Seite `/deals` | Sie bleibt vollständig erhalten, verstopft aber nicht mehr den Einstieg. |
| Wie die Kategorie mitwandert | im Arbeitsspeicher, **nicht** dauerhaft gespeichert | Beim nächsten Besuch soll wieder „Alle" stehen. Sonst wundert man sich, warum plötzlich nur noch zwei Angebote da sind. |
| Kachelzahl und Liste synchron halten | eine einzige Regel je Kategorie (`matchesCategory`) | Wird zum Zählen **und** zum Filtern benutzt. Sechs Tests halten fest, dass „22" auch 22 Karten bedeutet. |
| Schnellfilter (unter UVP, verifiziert, Badges) | hinter den Filter-Knopf verschoben | Sie doppelten die neuen Kategorien und kosteten auf dem Handy einen halben Bildschirm. |
| Umkreis-Schieberegler auf der Startseite | entfernt, nur noch fünf Knöpfe | Einen Regler trifft man mit dem Daumen schlecht; fünf große Knöpfe sind schneller und eindeutiger. |
| Untere Leiste am Handy | Start · Angebote · Live · Events · Sammlung | Scanner, Merkliste, Gerüchte und Pokémon Center sind über die Kacheln mit einem Tipp erreichbar – die Leiste bleibt bei fünf Einträgen lesbar. |
| Chat-Knopf | auf dem Handy kleiner | In der alten Größe verdeckte er die Zahl auf der Events-Kachel. |

---

## 6. Scanner: echt statt Attrappe

**Ausgangslage:** Rückmeldung – *„Der Karten Scanner funktioniert auch nicht."*
Zu Recht: Der alte Scanner wartete 1,7 Sekunden und wählte dann per
`Math.random()` ein Produkt aus dem Katalog.

### Verglichene Möglichkeiten

| | A · Bilderkennungs-Dienst | B · Strichcode auf dem Gerät | C · nur Suchfeld |
|---|---|---|---|
| Erkennt | Verpackung am Foto | die Nummer unter den Strichen | nichts, man tippt |
| Zuverlässigkeit | rät bei ähnlichen Verpackungen | eindeutig | – |
| Datenschutz | Bild geht an einen fremden Dienst | nichts verlässt das Gerät | – |
| Kosten | laufend je Anfrage | keine | keine |
| Auf GitHub Pages lauffähig | nein (bräuchte Schlüssel/Server) | **ja** | ja |

**Gewählt: B**, mit C als Rückfallebene. Der Katalog besteht aus
versiegelten Produkten – die haben alle einen Strichcode. Damit ist die
Erkennung eindeutig statt geraten, kostet nichts und funktioniert auf einer
rein statischen Website.

### Folgeentscheidungen

| Thema | Gewählt | Warum |
|---|---|---|
| Leseverfahren | eingebaute Browser-Erkennung, sonst ZXing | Chrome auf Android kann es selbst (schnell, stromsparend). ZXing wird nur nachgeladen, wenn nicht – z. B. auf dem iPhone. |
| Schutz vor Lesefehlern | Prüfziffer **und** zweimal dieselbe Nummer | Ein verwackeltes Einzelbild darf niemals ein falsches Produkt anzeigen. |
| Unbekannte Codes | einmal zuordnen, danach gemerkt | Sonst funktioniert der Scanner nur mit den 16 Katalogprodukten. So lernt er jede echte Packung dazu. |
| Seltenheit | aus dem Marktaufschlag berechnet | Nachvollziehbar und automatisch aktuell – im Gegensatz zu einer handgepflegten Liste. |
| Oberste Seltenheitsstufe | nur über den Marktpreis erreichbar | Sonst wäre jedes eingestellte Produkt ein „Sammlerstück" und die Auszeichnung wertlos. |
| Scan → Sammlung | automatisch, mit Schalter und Rückgängig | Das ist der erwartete Ablauf. Der Schalter fängt Vielscanner ab, die erst prüfen wollen. |
| Test der Kamera | Fake-Kamera mit erzeugtem Strichcode-Video | Nur so lässt sich belegen, dass wirklich gelesen wird – statt es zu behaupten. |
| EAN-Prüfziffern im Katalog | 12 von 16 korrigiert | Sie waren erfunden und formal ungültig. Ein echter Scanner hätte sie nie erzeugen können. |
