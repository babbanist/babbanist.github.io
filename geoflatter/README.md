# Geoflatter

Online multiplayer aardrijkskundespel voor 2 tot 6 spelers, ook op de telefoon. Peer to peer (WebRTC via Trystero), geen server, geen account, geen kosten.

## Bestanden

| Bestand | Inhoud |
|---|---|
| `index.html` | Hele spel (HTML, CSS, JS) |
| `data/countries.geojson` | Landgrenzen (Natural Earth 50m, 234 landen, zonder Antarctica) |
| `data/countries.json` | Hintdata per land (continent, talen, valuta, buurlanden, enz.) |

## Online zetten via GitHub Pages

1. Maak een account op github.com (als je die nog niet hebt).
2. Klik rechtsboven op **+** en kies **New repository**. Naam bijvoorbeeld `landenraden`. Zet hem op **Public**. Klik **Create repository**.
3. Klik op **uploading an existing file**. Sleep `index.html`, `README.md` en de map `data` erin. Klik **Commit changes**.
4. Ga naar **Settings**, dan **Pages** (linkermenu).
5. Bij **Source**: kies **Deploy from a branch**. Branch: `main`, map: `/ (root)`. Klik **Save**.
6. Wacht 1 tot 2 minuten. Je link verschijnt bovenaan: `https://JOUWNAAM.github.io/landenraden/`.

## Spelen

* Host: vul naam in, klik **Maak kamer**, deel de link of de 4 letter code.
* Vrienden: open de link (join gaat automatisch) of typ de code en klik **Join**.
* Verbinden duurt 1 tot 15 seconden.

## Testen

* Twee tabbladen: maak een kamer in tabblad 1, join in tabblad 2 met de code.
* Telefoon op 4G/5G (wifi uit) joinen bij een laptop op wifi. Lukt dat niet, stel TURN in (hieronder).

## TURN instellen (alleen als verbinden op mobiel faalt)

Sommige mobiele netwerken blokkeren directe verbindingen. Een gratis TURN server lost dat op.

1. Maak een gratis account op metered.ca (Open Relay, 20 GB per maand gratis).
2. Maak een app aan en kopieer je **username** en **credential**.
3. Open `index.html`, zoek `turn: [` in het CONFIG blok bovenaan het script.
4. Haal de `//` weg voor beide regels en vul je gegevens in.
5. Upload `index.html` opnieuw naar GitHub.

## Aanpassen

Alles staat in het `CONFIG` object bovenaan het script in `index.html`:

* `score`: punten voor goed, aftrek per hint, minimum
* `zoom` en `pan`: zoomniveau en bewegingsruimte per moeilijkheid
* `tiles`: kaartlaag. Standaard Esri satelliet (geen labels, geen key nodig). Wil je Mapbox: zet je URL met key in `tiles.main.url` en beperk de key in Mapbox op je GitHub Pages domein.
* `street`: zoekinstellingen voor straatbeeld
* `maxPlayers`, `resultAutoMs`
* `CUR_FIX` (valuta-correcties op landcode) en `HINT_DEFS` (alle hinttypes, rang en groep)

## Straatbeeld

Kies in de lobby de modus **Straatbeeld**. De foto's komen van [Panoramax](https://panoramax.xyz) (open data, geen key, geen kosten). De host zoekt de foto, controleert of hij laadt en stuurt hem naar iedereen.

* Dekking wisselt per land. De host zoekt in een willekeurig land en probeert een volgend land als er niets is. Lukt het niet, dan speelt die ronde op satelliet.
* 360-foto's gaan voor. Niet elk land heeft ze, dan krijg je een gewone foto waarin je beperkt kunt rondkijken.
* Moeilijk: je kunt niet rondkijken.
* De maker en licentie van de foto staan op het uitslagscherm.

Google Street View zit er niet in: dat vraagt een eigen API key met betaalaccount.

## Nederland-modus

Kies in de lobby de modus **Nederland**. Je krijgt een willekeurige plek in Nederland en raadt de plaats.

* Ongeveer 200 plaatsen (steden, dorpen en eilanden), met inwoners, provincie en coördinaten in `NL_RAW` in `index.html`. Een plaats toevoegen is één regel.
* De plek ligt binnen een paar km van de plaats, en de plaats is altijd de dichtstbijzijnde uit de lijst. Dat is het juiste antwoord.
* **Plaatsen**: alle, alleen steden (50.000+) of alleen dorpen. **Beeld**: satelliet of straatbeeld (Panoramax).
* Hints: provincie, landsdeel, inwoners, afstand en richting vanaf een grotere plaats, lengte van de naam, beginletter.
* Goed geeft de volle score. Fout binnen 25 km of in dezelfde provincie geeft 100 punten (`CONFIG.nl.nearKm`).
* Op het uitslagscherm zie je de juiste plek en de gok van elke speler.

## Straatjacht

Kies in de lobby de modus **Straatjacht**. Je krijgt de naam van een straat of gebouw en een satellietkaart zonder namen, en je moet het doel vinden.

* **Tikken is scannen.** Elke tik zet je pin en laat zien wat daar ligt (straat of gebouw), met de omtrek op de kaart. Zo bouw je de kaart zelf op.
* **Warm of koud.** Na elke scan zie je hoe dicht je zit. Makkelijk: temperatuur, afstand en richting. Normaal: temperatuur en warmer/kouder. Moeilijk: alleen warmer of kouder.
* **Scans:** 8, 6 of 4 per ronde. Daarna kun je je pin nog wel verzetten, maar je krijgt geen informatie meer.
* **Raak?** Tik je op het doel (of ergens anders op dezelfde straat), dan ben je meteen klaar. Anders zet je je pin vast, of telt bij het einde van de tijd je laatste pin, zonder tijdbonus.
* **Score:** hoe dichterbij hoe meer (`falloff` in `CONFIG.hunt`), maal 60% plus 40% van je resterende tijd, plus 20 punten per ongebruikte scan als je binnen 300 m zit.
* **Hints:** richting, afstand, buurt, postcode, een straat in de buurt en als laatste een cirkel op de kaart.
* **Waar speel je:** kies je eigen plaats (leuk met mensen die er wonen) of een willekeurige. Moeilijker betekent ook een groter gebied (800, 1200 of 1700 m straal).

De namen komen van [OpenStreetMap](https://www.openstreetmap.org/copyright) via [Nominatim](https://nominatim.org/release-docs/latest/api/Reverse/): geen key, geen kosten. Het spel doet per speler maximaal één verzoek per seconde, zoals hun [gebruiksregels](https://operations.osmfoundation.org/policies/nominatim/) vragen, en onthoudt antwoorden. Is Nominatim niet bereikbaar, dan speelt de ronde als gewone Nederland-ronde. Instellingen staan in `CONFIG.hunt`.

## Font

De fonts staan als base64 in `index.html`, dus ze laden meteen en zijn voor iedereen gelijk.

* **The Logo Font** (demo, © The Bold Font, Sven Pels): titels, knoppen en grote tekst. De demo heeft alleen letters.
* **The Bold Font** (gratis versie, © Sven Pels): vult de cijfers en leestekens aan die in de demo van The Logo Font ontbreken.
* **Madani** (demo, NamelaType): uitleg, hints, labels, invoer en chat. Teruggebracht tot Latijnse letters om de pagina klein te houden. De cijfers in de demo zijn doorgestreepte blokjes en leestekens als `- ' ( ) : / ? !` ontbreken: die komen uit The Bold Font. Met een gekochte versie kun je de cijfers en leestekens gewoon meenemen.

**Let op, licentie.** De demo van The Logo Font mag volgens zijn licentie niet in een website worden ingebed of worden verspreid, ook niet gratis. Koop de volledige versie op [the-bold-font.com](https://www.the-bold-font.com/) voordat je dit online zet (die heeft ook cijfers). De demo van Madani is alleen voor persoonlijk gebruik: koop een licentie op [namelatype.com](https://namelatype.com) voor promotioneel of commercieel gebruik.

## Goed om te weten

* De host bepaalt alles (locatie, hints, timer, score). Valt de host weg, dan neemt de speler die het eerst joinde het over (binnen ongeveer 9 seconden).
* Iemand die wegvalt kan terugkomen via dezelfde link en houdt zijn score.
* De coördinaten van de ronde gaan naar elke speler (de kaart heeft ze nodig). Wie wil valsspelen kan ze in de browser opzoeken. Bij vrienden prima.
* Lokaal openen door dubbelklikken werkt niet (de browser blokkeert het laden van de data). Gebruik GitHub Pages, of lokaal `python -m http.server` in de map.

## Bronnen

Natural Earth (publiek domein), world-countries (ODbL), Esri World Imagery, OpenStreetMap en Nominatim (ODbL), CARTO, Panoramax, Leaflet, Pannellum, Trystero, The Logo Font, The Bold Font.
