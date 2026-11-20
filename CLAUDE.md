# Pockio web (pockio.eu)

Web mini studia Pockio. Řešíme **jen web**, ne mobilní appky (ty jsou v jiných repech).

## Zdroje pravdy
- Plán, rozsah a fáze: `pockio-mvp-plan.md`. Drž se ho.
- Vzhled: složka `design/` (screenshoty plátna: Domů, O studiu, Detail appky, Kontakt; EN + CS; jen tmavé téma). Logo: `pockio-logo-dark.svg`.

## Tech stack
- Astro (statický build), TypeScript strict, Markdown + content collections.
- Vanilla CSS s CSS proměnnými (bez Tailwindu). Jen tmavé téma.
- Fonty lokálně přes `@fontsource-variable/nunito` (text a nadpisy), `@fontsource-variable/doto` (jen logo) a `@fontsource-variable/jetbrains-mono` (terminál a odkazy v patičce), podmnožiny latin + latin-ext (česká diakritika musí fungovat).
- Hosting GitHub Pages přes GitHub Actions (`withastro/action`), `site: 'https://pockio.eu'`, `public/CNAME`. Výstup `dist/` musí jít nasadit i na jiný statický server.
- Žádný zbytečný JS, žádný React/Vue. Výjimka: malý vanilla TypeScript skript terminálu (`src/scripts/terminal.ts`, bez knihoven); privacy stránky bez JS. Nové knihovny jen po dotazu.

## Design
- Minimalistický layout. **Celý web je terminál** (okno „pockio — zsh", 960 px, vystředěný, bez záře). Domů: rámeček s logem `pockio` (Doto, malými písmeny), seznam appek jako příkazů (`/attendance`, každý řádek je odkaz, první vybraný okrou), pod ním tlumený neklikatelný řádek „More pocket-sized helpers on the way" bez lomítka a funkční vstupní řádek s blikajícím kurzorem. V seznamu **jen appky**. Bez plovoucích ikonek a bez wireframe pozadí.
- **Stránky jako výpis:** O studiu, Kontakt a Detail appky se vypisují **uvnitř terminálu** jako výstup příkazu (`/about`, `/contact`, `/attendance`). Okno je pořád 960 px široké a **výška se protáhne podle obsahu**. Po příkazu se obrazovka **vyčistí**: nahoře malé logo (odkaz na Domů), echo `> /about`, výpis, na konci odkaz **`← /home`**. Výpis je JetBrains Mono: nadpis 19 px tučně, podnadpisy 16,5 px tučně, text 15 px normální, řádek max. cca 72 znaků. Screenshoty appky jsou v terminálu zmenšené náhledy telefonů.
- **Plynulé vypisování:** výpis po spuštění příkazu se objevuje postupně po slovech (fade-in, cca 3 slova za 35 ms), obrázky a screenshoty se prolnou jako celek. Na konci právě vypsaného textu je okrový blokový **kurzor**, který se posouvá s výpisem a po dokončení zmizí (kurzor pak zůstane jen ve vstupním řádku). Kliknutí nebo klávesa dokončí výpis hned. Při `prefers-reduced-motion` a při přímém načtení URL se zobrazí vše okamžitě. HTML je vždy kompletní (SEO, čtečky, bez JS); animace je jen vrstva přes něj. Obsah nikdy neskrývej, pokud skript neběží.
- **Každá stránka má vlastní URL a vlastní HTML** (Astro ji vygeneruje v rámu terminálu s hotovým výpisem). Skript jen přepíná obsah bez načítání a mění URL (History API); bez JS fungují obyčejné odkazy. Žádná „jedna stránka bez URL".
- **Privacy policy** (web i každá appka) je **samostatná textová stránka bez terminálu** (kompaktní logo nahoře, Nunito, text, patička). Odkaz je v patičce a na stránce appky.
- **Ovládání terminálu:** řádky jsou obyčejné odkazy (funguje myš, dotyk i bez JS). Skript přidá šipky ↑/↓ (výběr), Enter (otevřít), psaní `/…` s filtrem, Tab (doplnit), Esc (smazat). Na dotykových zařízeních jen klikatelný seznam bez vstupního řádku (doladit při vývoji). Výběr se nesmí označovat jen barvou. Nikdy klávesová past.
- **Příkazy:** viditelné jsou jen appky (z content collection `apps`). Skryté příkazy (`link` a `output`, např. `/contact` vypíše jen e-mail, telefon se nezveřejňuje; `/help` vypíše všechny příkazy včetně skrytých) se definují na jednom místě `src/data/commands.ts`; počítej s nimi v návrhu komponenty. Neznámý příkaz: `command not found: /xyz`.
- **Patička:** jazykové menu (English první) a odkazy `about`, `contact`, `privacy` (česky `o studiu`, `kontakt`, `soukromí`; malými písmeny, bez lomítka, mono), vpravo copyright. Samostatná hlavička s odkazy neexistuje.
- **Jednotná šířka:** terminál, patička i hlavička privacy stránky na jednom kontejneru 960 px; text privacy max. 720 px vlevo. Terminál se nesmí zúžit.
- Okrový akcent `#D9A441` na teplé černé `#0D0B07`; tokeny v `pockio-mvp-plan.md` (sekce 3).
- Doto jen na logo (a číslice na displeji v ukázkových screenshotech). Terminál, výpisy a odkazy v patičce JetBrains Mono; privacy stránka Nunito (nadpisy tučně). Slogan tlumený `#7F785F`.
- Záře (glow) kolem loga a tlačítek, ne kolem terminálu; respektuj `prefers-reduced-motion` (i u blikajícího kurzoru).
- Styl je inspirovaný, nikoli kopie jiných webů.

## Pravidla webu
- Výchozí jazyk angličtina na `/`, čeština pod `/cs/`. Přepínač je malá rolovací nabídka v patičce (English první).
- Stránky: Domů (terminál), O studiu, Kontakt, Detail appky (všechny jako výpis v terminálu) a Privacy (web i každá appka, samostatně bez terminálu).
- Na webu nezmiňovat platformní plány typu „zatím jen Android, iOS možná později".
- Obsah se edituje v `.md`. Nová appka vzniká příkazem `npm run new-app -- <slug>` ze šablony `src/content/apps/_template/` (`en.md`, `cs.md`, `privacy.cs.md`, `privacy.en.md`, `icon.png`, `screenshots/`).
- Stránky appek (`.md`) si píše Tomáš sám; kód je jen vykreslí. Nový příkaz terminálu nesmí vyžadovat zásah do komponenty.
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
