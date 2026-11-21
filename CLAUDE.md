# Pockio web (pockio.eu)

Web mini studia Pockio. Řešíme **jen web**, ne mobilní appky (ty jsou v jiných repech).

## Zdroje pravdy
- Plán, rozsah a fáze: `pockio-mvp-plan.md`. Drž se ho.
- Vzhled: složka `design/` (screenshoty plátna: Domů, O studiu, Detail appky, Kontakt; EN + CS; jen tmavé téma). Logo: `pockio-logo-dark.svg`.

## Tech stack
- Astro (statický build), TypeScript strict, Markdown + content collections.
- Vanilla CSS s CSS proměnnými (bez Tailwindu). Jen tmavé téma.
- Fonty lokálně přes `@fontsource-variable/nunito` (text a nadpisy), `@fontsource-variable/doto` (jen číslice na displeji v ukázkových screenshotech appek; lze úplně vynechat) a `@fontsource-variable/jetbrains-mono` (terminál a odkazy v patičce), podmnožiny latin + latin-ext (česká diakritika musí fungovat).
- Hosting GitHub Pages přes GitHub Actions (`withastro/action`), `site: 'https://pockio.eu'`, `public/CNAME`. Výstup `dist/` musí jít nasadit i na jiný statický server.
- Žádný zbytečný JS, žádný React/Vue. Výjimka: malý vanilla TypeScript skript terminálu (`src/scripts/terminal.ts`, bez knihoven); HTML každé stránky je kompletní i bez JS. Nové knihovny jen po dotazu.

## Design
- Minimalistický layout. **Celý web je terminál** (okno „pockio — zsh", 760 px, vystředěný, bez záře). Domů: ASCII logo `pockio` (viz „Logo“ níže), řádek „Select a command:" a **čtyři příkazy** (`/apps`, `/about`, `/privacy`, `/contact`; CS `/appky`, `/o-studiu`, `/soukromi`, `/kontakt`; každý řádek je odkaz s krátkým popisem, první vybraný okrou) a funkční vstupní řádek s blikajícím kurzorem. Na Domů **nejsou appky přímo**, ty jsou za `/apps`. Bez plovoucích ikonek a bez wireframe pozadí.
- **Stránky jako výpis:** Appky (`/apps`), O studiu, Kontakt a Detail appky se vypisují **uvnitř terminálu** jako výstup příkazu (`/apps`, `/about`, `/contact`, `/attendance`). `/apps` vypíše „Select an app:" se seznamem appek (každý řádek odkaz, první vybraný okrou) a pod ním tlumený neklikatelný řádek „More pocket-sized helpers on the way" bez lomítka. `/privacy` (CS `/soukromi`) vypíše celou privacy policy také v terminálu (žádná samostatná stránka bez terminálu). Detail appky má na konci **`← /apps`**, ostatní výpisy **`← /home`**. Okno je pořád 760 px široké a **výška se protáhne podle obsahu**. Po příkazu se obrazovka **vyčistí**: nahoře ASCII logo (odkaz na Domů), echo `> /about`, výpis, na konci odkaz **`← /home`**. Výpis je JetBrains Mono: nadpis 14 px tučně, podnadpisy 13 px tučně, text 12 px normální, příkazy a drobné řádky 11 px (na telefonu text 13 px, nadpisy 15,5 / 14 px, drobné 12 px); velikosti jsou CSS proměnné `--tf`, `--ts`, `--t2`, `--t3`, `--al` přepsané v media query. Řádek max. cca 72 znaků. Screenshoty appky jsou v terminálu zmenšené náhledy telefonů (na telefonu ve dvou sloupcích pod sebou, **žádný horizontální scroll**).
- **Plynulé vypisování:** výpis po spuštění příkazu se objevuje postupně po slovech (fade-in, cca 3 slova za 35 ms), obrázky a screenshoty se prolnou jako celek. Na konci právě vypsaného textu je okrový blokový **kurzor**, který se posouvá s výpisem a po dokončení zmizí (kurzor pak zůstane jen ve vstupním řádku). Kliknutí nebo klávesa dokončí výpis hned. Při `prefers-reduced-motion` a při přímém načtení URL se zobrazí vše okamžitě. HTML je vždy kompletní (SEO, čtečky, bez JS); animace je jen vrstva přes něj. Obsah nikdy neskrývej, pokud skript neběží.
- **Každá stránka má vlastní URL a vlastní HTML** (Astro ji vygeneruje v rámu terminálu s hotovým výpisem). Skript jen přepíná obsah bez načítání a mění URL (History API); bez JS fungují obyčejné odkazy. Žádná „jedna stránka bez URL".
- **Privacy policy** (web i každá appka) je **výpis v terminálu** s vlastní URL (`/privacy/`, `/privacy/<slug>/`), jako ostatní stránky; žádná samostatná stránka bez terminálu. Odkaz je v patičce a na stránce appky.
- **Ovládání terminálu:** řádky jsou obyčejné odkazy (funguje myš, dotyk i bez JS). Skript přidá šipky ↑/↓ (výběr), Enter (otevřít), psaní `/…` s filtrem, Tab (doplnit), Esc (smazat). Na telefonu a dotykových zařízeních (`@media (max-width:640px), (pointer:coarse)`) **jen klikatelný seznam, vstupní řádek i nápověda se schovají** (nejde psát). Výběr se nesmí označovat jen barvou. Nikdy klávesová past.
- **Příkazy:** na Domů jsou vidět jen čtyři příkazy `/apps`, `/about`, `/privacy`, `/contact`; appky (z content collection `apps`) se vypisují v `/apps` a jdou i napsat přímo (`/attendance`). Další (skryté) příkazy (`link` a `output`, např. krátký výpis jen e-mailu, telefon se nezveřejňuje; `/help` vypíše všechny příkazy včetně skrytých) se definují na jednom místě `src/data/commands.ts`; počítej s nimi v návrhu komponenty. Neznámý příkaz: `command not found: /xyz`.
- **Patička:** jazykové menu (English první) a odkazy `about`, `contact`, `privacy` (česky `o studiu`, `kontakt`, `soukromí`; malými písmeny, bez lomítka, mono), vpravo copyright. Samostatná hlavička s odkazy neexistuje.
- **Jednotná šířka:** terminál a patička na jednom kontejneru 760 px. Terminál se nesmí zúžit.
- Okrový akcent `#D9A441` na teplé černé `#0D0B07`; tokeny v `pockio-mvp-plan.md` (sekce 3).
- Doto jen na číslice na displeji v ukázkových screenshotech (na webu ho nepoužíváme). Terminál, výpisy a odkazy v patičce JetBrains Mono; Nunito jen pro patičku a běžný text mimo terminál. Slogan tlumený `#7F785F`.
- **Logo = ASCII art** `pockio` malými písmeny, JetBrains Mono, okrová `#D9A441`, bez orámování, zarovnané vlevo; pod ním podtitul `✻ Pocket-sized helpers · pockio.eu` (✻ okrově, text tlumeně). Jen běžné ASCII znaky (figlet font „standard“, 6 řádků, 31 sloupců), žádné blokové znaky (█ ╗ ═; v JetBrains Mono latin nejsou). Vykresluje se jako `<pre aria-hidden="true">` s `white-space:pre`, `line-height:1.2`, bez letter-spacing, v obalovém `<h1 aria-label="pockio">` s `font-weight:400`. Stejné logo na Domů i nad každým výpisem (na výpisech odkaz na Domů). Velikost 14 px na desktopu, 13 px na telefonu. Dlaždice s „p“ zůstává jen jako favicon a ikona.
- Záře (glow) kolem tlačítek, ne kolem terminálu; respektuj `prefers-reduced-motion` (i u blikajícího kurzoru).
- Styl je inspirovaný, nikoli kopie jiných webů.

## Pravidla webu
- Výchozí jazyk angličtina na `/`, čeština pod `/cs/`. Přepínač je malá rolovací nabídka v patičce (English první).
- Stránky: Domů (terminál), Appky (`/apps`), O studiu, Kontakt, Detail appky (všechny jako výpis v terminálu) a Privacy (web i každá appka; také výpis v terminálu).
- Na webu nezmiňovat platformní plány typu „zatím jen Android, iOS možná později".
- Obsah se edituje v `.md`. Nová appka vzniká příkazem `npm run new-app -- <slug>` ze šablony `src/content/apps/_template/` (`en.md`, `cs.md`, `privacy.cs.md`, `privacy.en.md`, `icon.png`, `screenshots/`).
- Stránky appek (`.md`) si píše Tomáš sám; kód je jen vykreslí. Nový příkaz terminálu nesmí vyžadovat zásah do komponenty. Appka má v každém jazyce vlastní `slug` ve frontmatteru (EN `attendance`, CS `dochazka`); složka appky je jen klíč, který spojí EN a CS.
- Chybějící pole ve frontmatteru musí zachytit schéma kolekce při buildu.
- Odznak Google Play: v ostré verzi použít oficiální odznak „Get it on Google Play" podle pravidel Google, ne vlastní kopii.
- Bez cookies a trackerů.

## Bezpečnost
- Žádná hesla, klíče ani tokeny v gitu. Tajemství jen do `.env` (je v `.gitignore`), vzor v `.env.example`.
- Repo je veřejné: nic soukromého.
- Do repa žádná videa ani velké originály obrázků (jen zmenšené verze).

## Pracovní postup
- Před commitem vždy `npm run build`. Commituj po malých krocích.
- Vyvíjej na větvi `astro`; `main` drží živou coming-soon stránku, dokud web není hotový.
- Mně (v JS/TS začátečník, umím Python) stručně vysvětli nové koncepty.
- Před větší změnou napiš krátký plán a počkej na OK.

## Mobil (telefon)
- Breakpoint `@media (max-width:640px)`; vstupní řádek a nápověda se skrývají už přes `(pointer:coarse)`.
- ASCII logo 13 px (desktop 14 px), musí se vejít do okna, nikdy nesmí přetéct. Menší okraje terminálu, tabulka „Informace" pod sebe, screenshoty ve dvou sloupcích (zoom ~0,7), nic se neposouvá do strany. Terminál na telefonu nezužuj pod šířku displeje.
- V designu jsou telefonní boardy (390 px) pro Home, Apps, About, App, Contact, Privacy.
