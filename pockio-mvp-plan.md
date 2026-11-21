# Pockio.eu – web: MVP, tech stack a postup do spuštění

Stav: plán schválen 4. 11. 2026, přepsáno 20. 11. 2026 (web je terminál: všechny stránky se vypisují v něm; ovládání a skryté příkazy) podle finálního designu ( jen tmavé téma, Nunito + JetBrains Mono, ASCII logo, okrový akcent, stránky O studiu / Kontakt / Detail appky, šablony pro další appky).
Návrh designu: plátno „Pockio.eu – website" (24 artboardů: Domů, Appky, O studiu, Detail appky, Kontakt, Soukromí; EN + CS, každé jako web 1280 px i telefon 390 px; jen tmavá varianta).

---

## 1. Cíl

Lehký, rychlý a minimalistický web pro mini studio Pockio. Hlavní stránka je rozcestník na appky, každá appka má vlastní stránku s popisem, screenshoty a odkazem na Google Play. Obsah se přidává a edituje v Markdown souborech, bez databáze a bez adminu. Nová appka = zkopírovaná šablona, vyplněné `.md`, `git push`.

## 2. Rozsah MVP

**Je v MVP**

- **Domů** (`/`): uprostřed stránky **terminál** (okno „pockio — zsh", šířka 760 px). Uvnitř ASCII logo `pockio` s podtitulem „✻ Pocket-sized helpers · pockio.eu", řádek „Select a command:" a **čtyři příkazy**: `/apps` (our pocket-sized apps), `/about` (about the studio), `/privacy` (privacy policy), `/contact` (get in touch); česky `/appky`, `/o-studiu`, `/soukromi`, `/kontakt`. Každý řádek je odkaz, první je vybraný okrou. Dole **funkční vstupní řádek** `> ▮ type / for commands…` s blikajícím kurzorem a nápověda „? help · tab complete". Na Domů nejsou appky přímo (jsou v `/apps`) a není tam přepínač jazyka. Na pozadí jen jemné hvězdy, bez plovoucích ikonek a bez záře kolem okna.
- **Plynulé vypisování (jako v AI chatu):** po spuštění příkazu se výpis objevuje postupně po slovech (fade-in, cca 3 slova za 35 ms, celá stránka appky do pár sekund), screenshoty se prolnou jako celek. Na konci právě vypsaného textu je okrový blokový kurzor, který se posouvá s výpisem a po dokončení zmizí (zůstane jen ve vstupním řádku); je `aria-hidden`. Kliknutí nebo klávesa výpis dokončí hned. Při `prefers-reduced-motion` a při přímém otevření URL (odkaz, vyhledávač) se zobrazí vše okamžitě. HTML je vždy kompletní, animace je jen vrstva přes něj, takže nic neutrpí SEO, čtečky ani web bez JS.
- **Web je jeden terminál.** Stránky Appky, O studiu, Kontakt a Detail appky se **vypisují uvnitř terminálu** jako výstup příkazu (`/apps`, `/about`, `/contact`, `/attendance`). Okno má pořád 760 px na šířku, **výška se podle obsahu protáhne dolů** (stránka se posouvá, ne okno uvnitř). Po spuštění příkazu se obrazovka **vyčistí**: nahoře zůstane ASCII logo (odkaz na Domů), pod ním echo příkazu `> /about`, pak výpis a na konci odkaz **`← /home`** (zpět). Starší příkazy se nezobrazují jako historie.
- **Terminál: ovládání a příkazy** (platí na všech stránkách, tedy i na privacy):
  - **Myš a dotyk:** každý příkaz v seznamu je obyčejný odkaz, klik nebo klepnutí otevře stránku appky. Funguje i bez JavaScriptu.
  - **Klávesnice (desktop):** šipky ↑/↓ posouvají výběr (okrový řádek), **Enter** otevře vybranou položku, psaní `/…` filtruje příkazy a **Tab** doplní (např. `/att` → `/attendance`), **Esc** smaže vstup. Při načtení je vybraná první appka.
  - **Telefon (dotykové zařízení):** jen klikatelný seznam, vstupní řádek se schová (nevyskakuje klávesnice). Doladí se při vývoji.
  - **Viditelné příkazy na Domů:** `/apps`, `/about`, `/privacy`, `/contact`. Příkaz `/apps` vypíše „Select an app:" se seznamem appek (generuje se z content collection `apps`, první vybraná okrou, každý řádek odkaz) a pod ním šedý neklikatelný řádek „More pocket-sized helpers on the way" bez lomítka; na konci `← /home`. Příkaz appky (`/attendance`) jde napsat i přímo. Detail appky končí `← /apps`. `/privacy` je typ `link` na výpis privacy policy v terminálu (vlastní URL).
  - **Skryté příkazy** (zatím jen koncept, počítá se s nimi od začátku): příkaz, který v seznamu není, ale dá se napsat. Typy: `link` (otevře stránku, např. `/about`, `/contact`) a `output` (vypíše text přímo v terminálu, např. `/contact` vypíše e-mail). Neznámý příkaz vypíše `command not found: /xyz`. **`/help` vypíše všechny příkazy včetně skrytých** (nejsou tedy tajné, jen nejsou v hlavním seznamu).
  - Všechny příkazy (viditelné i skryté) jsou definované na jednom místě (`src/data/commands.ts`), takže nový příkaz = jeden záznam, bez zásahu do komponenty.
- **O studiu / About** (výpis `/about`): kdo jsem, proč vlastní studio, odkud je název, jak appky vznikají a věta s odkazem na `/contact`.
- **Kontakt / Contact** (výpis `/contact`): e-mail, odkaz na vývojářský účet Google Play, tip, co napsat při hlášení chyby.
- **Appky** (výpis `/apps`; URL `/apps/`, CS `/cs/appky/`): seznam appek jako příkazy, viz výše.
- **Detail appky** (výpis `/attendance`; URL `/apps/<slug>/`, CS `/cs/appky/<slug>/`): název, tagline a štítky (Android, Zdarma, Bez reklam…), tlačítko Google Play, **screenshoty jako náhledy telefonů** (v terminálu zmenšené, s popisky; na desktopu v řadě, na telefonu ve dvou sloupcích bez horizontálního scrollu), popis, „Co umí", informace (verze, velikost, aktualizace, požadavky, cena, vývojář), „Co je nového" a odkaz na privacy policy appky.
- **Privacy policy** je **výpis v terminálu** (jako ostatní stránky, žádná samostatná stránka bez terminálu) pro web (`/privacy/`) i pro každou appku (`/privacy/<slug>/`). Odkaz na ni je v patičce a na stránce appky. Google Play ji vyžaduje, proto musí mít stabilní čitelnou URL. Texty na webu jsou zatím zástupné a před spuštěním je potřeba je zkontrolovat.
- **Stránky appek (`.md`) si tvoří Tomáš sám** podle šablony; kód ho jen vykreslí. Nikde se nepočítá s ruční úpravou HTML.
- Další jednoduché stránky podle potřeby (např. Podmínky) se přidají jako `.md` bez změny kódu.
- Jazyky: **angličtina výchozí (na `/`)**, čeština druhá (pod `/cs/`); přepínač jako malá rolovací nabídka v patičce (otevírá se nahoru, English je první). Nikde jinde přepínač není.
- **Navigace:** hlavní navigace je terminál. Patička má jazykové menu a odkazy `about`, `contact` a `privacy` (česky `o studiu`, `kontakt`, `soukromí`; malými písmeny, bez lomítka, mono písmo). Aktuální stránka je okrově. Samostatná hlavička s odkazy neexistuje; na stránce privacy je jen kompaktní logo.
- Pouze **tmavé téma** (světlá varianta je zrušená).
- Favicon sada (z ikony loga), základní SEO (title, description, Open Graph, sitemap, `hreflang` CS/EN).
- **Telefon:** vstupní řádek a nápověda se schovají (`(max-width:640px), (pointer:coarse)`), jen klikatelné řádky. ASCII logo se zmenší na 13 px (desktop 14 px) a vejde se do okna, tabulka „Informace" jde pod sebe, screenshoty ve dvou sloupcích. V designu je k tomu 6 telefonních boardů (390 px) na jazyk.
- Responzivní, přístupné (kontrasty, focus, klávesnice), **bez cookies a trackerů**.

**Není v MVP (později)**

- Blog / novinky
- Analytika (případně Plausible nebo jiná bez cookies)
- Admin rozhraní (CMS)
- Další jazyky, vyhledávání
- Světlý režim

## 3. Design (finální směr)

Zdroj pravdy je plátno „Pockio.eu – website". Hlavní rysy:

- **Atmosféra:** téměř černé teplé pozadí s jemnými hvězdami. Záře (glow) jen kolem loga a tlačítek, ne kolem terminálu.
- **Jednotná šířka:** terminál, patička i hlavička privacy stránky sedí na jednom kontejneru **760 px** (okraj 24 px), takže levý a pravý okraj jsou všude stejné. Text privacy stránky má max. 720 px, zarovnaný vlevo uvnitř tohoto kontejneru.
- **Logo (ASCII art):** `pockio` malými písmeny, JetBrains Mono, okrová `#D9A441`, bez orámování, zarovnané vlevo; pod ním podtitul `✻ Pocket-sized helpers · pockio.eu` (✻ okrově, text tlumeně). Jen běžné ASCII znaky (figlet font „standard", 6 řádků, 31 sloupců), takže vždy sedí v podmnožině latin. Bez blokových znaků (█ ╗ ═): v JetBrains Mono latin nejsou a vykreslují se s mezerami. Vykresluje se jako `<pre aria-hidden="true">` s `white-space:pre`, `line-height:1.2`, bez letter-spacing; obalový `<h1 aria-label="pockio">` má `font-weight:400`, jinak se logo zbytečně ztučňuje. Velikost 14 px na desktopu, 13 px na telefonu. Dlaždice s „p" a font Doto se z webu odstraňují; dlaždice zůstává jako favicon a ikona.
- **Otevřené: šířka terminálu.** Zvažuje se zúžení z 760 na cca 640 px, aby víc připomínal okno terminálu; zatím platí 760 px.
- **Logo na výpisech:** stejné ASCII logo nad echem příkazu; je to odkaz na Domů.
- Poznámka: blokové ASCII logo (█) by vyžadovalo podmnožinu se symboly nebo SVG.
- **Terminál:** okno s tmavším pozadím `#0A0907`, tenký okraj, radius 14 px, horní lišta se třemi tečkami a titulkem „pockio — zsh". Písmo JetBrains Mono (velikosti viz „Výpisy v terminálu"), výběr řádku tónem `#2B2416` a okrovým textem, hover na řádku totéž. Kurzor bliká CSS animací, při `prefers-reduced-motion` stojí. Vybraný řádek má vždy i nebarevné označení (▸), ne jen barvu.
- **Slogan:** malý, tlumená barva `#7F785F`; v terminálu je součástí podtitulu loga.
- **Výpisy v terminálu:** JetBrains Mono. Nadpis výpisu 14 px tučně, podnadpisy 13 px tučně, běžný text 12 px normální, příkazy a drobné řádky 11 px (na telefonu text 13 px, nadpisy 15,5 a 14 px, drobné 12 px). Realizace: CSS proměnné `--tf`, `--ts`, `--t2`, `--t3`, `--al`, na telefonu přepsané v media query. Řádek max. cca 72 znaků (screenshoty a tabulky mohou být širší), řádkování 1,7. Seznamy s okrovou pomlčkou, informace jako dvousloupcová tabulka. **Privacy stránka:** Nunito, nadpisy tučně. Doto se na webu nepoužívá.
- **Screenshoty v terminálu:** rámečky telefonů (216×440 px) zmenšené na 50 % (na telefonu 70 %), okrové světélko, popisek pod každým; číslice na „displeji" v ukázkových screenshotech jsou v Doto.
- **Terminálové prvky:** tlačítko Google Play je obrysové s okrovým textem (v ostré verzi oficiální odznak podle pravidel Google), odkazy jsou okrově podtržené.

### Design tokeny (tmavé téma)

| Token | Hodnota |
|---|---|
| Pozadí | `#0D0B07` |
| Karta | `#15120B` |
| Okraje | `#2A2416` |
| Text | `#F1ECDF` |
| Doplňkový text | `#A39B87` |
| Slogan / nejtlumenější | `#7F785F` |
| Akcent (okra) | `#D9A441` |
| Akcentní text | `#E3B04B` |
| Tón pod štítky / panely | `#2B2416` |
| Text na akcentu | `#131313` |
| Záře | `rgba(217,164,65,.5)` |
| Hover pozadí | `#1C1810` |
| Čárkované okraje | `#5C5338` |

Zaoblení: karty 16 px, panely 20 px, tlačítka a štítky pilulka (9999 px), app ikony cca 24 % strany.

### Písma

| Použití | Písmo |
|---|---|
| Běžný text, nadpisy, popisky, tlačítka | **Nunito** (variabilní; nadpisy tloušťka 800) |
| Logo `pockio` (ASCII art) | **JetBrains Mono** (okrová, 14 px / na telefonu 13 px) |
| Displej v ukázkových screenshotech appek | **Doto** (dot-matrix, jen tam; lze vynechat) |
| Terminál na Domů, odkazy v patičce | **JetBrains Mono** (variabilní, monospace) |

Doto se na webu nepoužívá (jen číslice na displeji v screenshotech, jinak se vynechá). Fonty lokálně přes `@fontsource-variable/nunito`, `@fontsource-variable/jetbrains-mono` (a případně `@fontsource-variable/doto`), podmnožiny **latin + latin-ext** (nutné pro češtinu). Bez Google Fonts, bez GDPR starostí.

## 4. Tech stack

| Vrstva | Volba | Proč |
|---|---|---|
| Generátor webu | **Astro** (statický build, TypeScript strict) | Z Markdownu a šablon vyrobí statické HTML, skoro žádný JS v prohlížeči. Vestavěné i18n routování. |
| Obsah | **Markdown + content collections** (frontmatter se schématem) | Appka = složka s `.md` soubory. Chybějící nebo špatné pole zachytí build, ne návštěvník. |
| Šablona nové appky | Složka `src/content/apps/_template/` + skript `npm run new-app -- <slug>` | Zkopíruje šablonu, přepíše slug a vypíše, co vyplnit. Nová stránka appky bez psaní kódu. |
| Styl | Vlastní CSS s design tokeny (`tokens.css`) | Bez těžkého frameworku, drží se návrhu. |
| Terminál (celý web) | HTML + CSS + **malý vanilla TypeScript skript** (cca 2–3 KB) | **Každá stránka je vlastní HTML soubor** (Astro ji vygeneruje v rámu terminálu s hotovým výpisem), takže má vlastní URL, jde ji indexovat a poslat odkazem. Základ jsou obyčejné odkazy, web funguje i bez JS (progressive enhancement). Skript přidá šipky, Enter, Tab, skryté příkazy a navigaci bez načítání stránky (obsah se vymění a přes History API se změní URL). Bez frameworku. |
| Obrázky | Astro `<Image>` | Screenshoty se při buildu zmenší a převedou na WebP/AVIF. |
| Repo | **GitHub** (veřejné, `.env` nikdy do gitu) | Verzování + automatický deploy při `git push`. |
| Hosting | **GitHub Pages** (zdarma) přes GitHub Actions (`withastro/action`) | Vše na jednom místě, nulové náklady. |
| Doména | `pockio.eu`, DNS u registrátora, `public/CNAME` | HTTPS certifikát zdarma a automaticky. |
| Kontaktní formulář | Zatím `mailto:` odkaz (viz otevřená rozhodnutí) | Statický web nemá backend. |

### Levný server místo GitHub Pages?

Astro vyrobí obyčejnou složku `dist/` se statickými soubory, takže poběží kdekoli:

- **GitHub Pages** (teď): zdarma, nic nespravuješ. Doporučeno.
- **Cloudflare Pages**: zdarma, náhledy větví, soukromé repo.
- **Levný VPS / sdílený hosting** (cca 100–200 Kč měsíčně): stačí nahrát obsah `dist/` (např. přes `rsync` v GitHub Action) a obsluhovat ho nginx nebo Caddy. Dává smysl až kdyby na stejném serveru běželo ještě něco dalšího.

Přechod mezi nimi je jen změna kroku nasazení, obsah ani kód se nemění.

Proč ne jinak: WordPress je těžký a vyžaduje údržbu, Next.js je na tenhle web zbytečně velký, Hugo je rychlá alternativa, ale s hůř čitelnými šablonami.

**Váha stránek (odhad, změří se ve fázi 4):** HTML 10–30 KB, CSS 5–15 KB, JS cca 2–3 KB (jen terminál), fonty 30–100 KB. Cíl: celá stránka pod 500 KB. Největší položka budou screenshoty appek.

## 5. Struktura repa

```
pockio-web/
├─ astro.config.mjs
├─ package.json
├─ .gitignore                 # node_modules, dist, .env
├─ .env.example
├─ scripts/new-app.mjs        # vytvoří novou appku ze šablony
├─ public/                    # favicon sada, og-image, robots.txt, CNAME
├─ src/
│  ├─ content.config.ts       # schémata kolekcí (apps, pages)
│  ├─ content/
│  │  ├─ apps/
│  │  │  ├─ _template/        # šablona pro novou appku (kopíruje skript)
│  │  │  │  ├─ cs.md
│  │  │  │  ├─ en.md
│  │  │  │  ├─ privacy.cs.md
│  │  │  │  ├─ privacy.en.md
│  │  │  │  ├─ icon.png
│  │  │  │  └─ screenshots/
│  │  │  └─ attendance/      # Pockio Docházka (stejná struktura)
│  │  └─ pages/
│  │     ├─ home.cs.md   home.en.md
│  │     ├─ about.cs.md  about.en.md
│  │     ├─ contact.cs.md contact.en.md
│  │     └─ privacy.cs.md privacy.en.md   # privacy samotného webu
│  ├─ data/commands.ts        # příkazy terminálu (viditelné i skryté)
│  ├─ scripts/terminal.ts     # ovládání terminálu (šipky, Enter, Tab, výpis)
│  ├─ i18n/ui.ts              # texty menu, patičky, tlačítek (CS + EN)
│  ├─ components/             # TerminalShell (rám + logo + echo + vstup), Footer, LangMenu, Logo,
│  │                          # PhoneFrame (zmenšený), PlayButton…
│  ├─ layouts/Base.astro
│  ├─ pages/                  # EN na /, CS pod /cs/
│  │  ├─ index.astro          # terminál (home)
│  │  ├─ apps/index.astro     # výpis /apps (seznam appek)
│  │  ├─ about.astro          # výpis v terminálu
│  │  ├─ contact.astro        # výpis v terminálu
│  │  ├─ apps/[slug].astro    # výpis v terminálu
│  │  ├─ privacy/index.astro  # výpis v terminálu
│  │  ├─ privacy/[slug].astro # výpis v terminálu
│  │  └─ cs/…                 # o-studiu, kontakt, appky/[slug], privacy
│  └─ styles/tokens.css
```

## 6. Jak se edituje obsah

### Nová appka (ze šablony)

1. `npm run new-app -- nazev-appky` zkopíruje `_template` do `src/content/apps/nazev-appky/`.
2. Vyplníš frontmatter v `cs.md` a `en.md`, přidáš `icon.png` a screenshoty do `screenshots/`.
3. Upravíš `privacy.cs.md` a `privacy.en.md`.
4. `git push` → za cca minutu je web živý. Appka se objeví ve výpisu `/apps` (a jde napsat jako příkaz), vznikne stránka appky i její privacy stránka.

### Příklad `cs.md` (šablona appky)

```md
---
slug: dochazka            # URL appky v tomto jazyce (EN: attendance); také příkaz v terminálu
title: Pockio Docházka
tagline: Docházka na jedno klepnutí.
status: released          # released | soon
order: 1                  # pořadí v /apps
icon: ./icon.png
chips: [Android, Zdarma, Bez reklam]
playUrl: "[ODKAZ NA GOOGLE PLAY]"
features:
  - Příchod a odchod na jedno klepnutí
  - Týdenní a měsíční přehled hodin
  - Přesčasy a pauzy počítá sama
  - Export do CSV, všechno zůstává v telefonu
screenshots:
  - { file: ./screenshots/1.png, caption: Hlavní obrazovka }
  - { file: ./screenshots/2.png, caption: Týden }
details:
  version: "1.0.0"
  size: "[VELIKOST]"
  updated: "[DATUM]"
  requires: Android 8.0+
  price: Zdarma, volitelné Pro
whatsNew: První verze: příchody, odchody, týdenní a měsíční přehled, export do CSV.
---
Volný text v Markdownu: popis appky (sekce „O appce").
```

Pole, které chybí, zachytí build s jasnou chybou. Appka se stavem `released` se objeví ve výpisu `/apps` jako další řádek (příkaz = slug appky); stav `soon` se neukazuje jako příkaz, jen se započítá do šedého informačního řádku pod seznamem v `/apps`.

### Příkazy terminálu (`src/data/commands.ts`)

Čtyři příkazy na Domů (`home: true`) a skryté příkazy se píšou ručně. Appky se do výpisu `/apps` přidávají samy (z `src/content/apps/`) a jdou napsat i přímo (`/attendance`):

```ts
export const hiddenCommands = [
  // viditelné na Domů, v tomto pořadí:
  { name: 'apps',    type: 'link', href: '/apps/',    desc: 'our pocket-sized apps', home: true },
  { name: 'about',   type: 'link', href: '/about/',   desc: 'about the studio',      home: true },
  { name: 'privacy', type: 'link', href: '/privacy/', desc: 'privacy policy',        home: true },
  { name: 'contact', type: 'link', href: '/contact/', desc: 'get in touch',          home: true },
  // skryté (jen se napíšou, /help je vypíše):
  { name: 'email',   type: 'output', lines: ['Email: [YOUR EMAIL]'] },
];
```

`type: 'link'` přejde na stránku, `type: 'output'` vypíše řádky do terminálu. Vybrané příkazy mohou mít české aliasy (`/kontakt`). Telefon se nezveřejňuje, jen e-mail. Pozor: e-mail v textu se dostane do veřejného repa i do HTML a boti ho sbírají. Vhodná je zvláštní adresa jen pro web (např. `hello@pockio.eu`).

### Editovatelné stránky

| Stránka | Soubor |
|---|---|
| Domů (podtitul, popisy příkazů) | `src/content/pages/home.cs.md`, `home.en.md` |
| Skryté příkazy terminálu | `src/data/commands.ts` |
| O studiu | `about.cs.md`, `about.en.md` |
| Kontakt | `contact.cs.md`, `contact.en.md` |
| Privacy webu | `privacy.cs.md`, `privacy.en.md` |
| Texty menu, patičky | `src/i18n/ui.ts` |

Další stránka (např. Podmínky) = nový `.md` v `pages/` s frontmatterem (`title`, `slug`), bez zásahu do kódu. Editovat jde ve VS Code i přímo na GitHubu z mobilu („Edit this file" → commit → deploy).

## 7. Postup práce až do spuštění

Orientační čas při práci po večerech: cca 1–2 týdny.

**Aktuální stav (18. 11. 2026):** repo `pockio-web` na GitHubu běží s „coming soon" stránkou na větvi `main`, doména `pockio.eu` je napojená na GitHub Pages a HTTPS funguje. Astro web se vyvíjí na větvi `astro` a do `main` se sloučí, až bude hotový. Design je schválený (plátno, web i telefon, stav 20. 11. 2026).

**Fáze 0 – Příprava (ručně)**
- [ ] Nainstalovat Node.js LTS, nastavit Git, mít Claude Code
- [ ] Složka `pockio-web` s `pockio-mvp-plan.md`, `CLAUDE.md`, logy a `design/` (screenshoty artboardů)
- [ ] Spustit `claude` v té složce

**Fáze 1 – Základ**
- [ ] Větev `astro`, `.gitignore`, `.env.example`
- [ ] Inicializace Astra, ověřit `npm run dev`
- [ ] i18n routování (EN na `/`, CS pod `/cs/`)

**Fáze 2 – Design do kódu**
- [x] `tokens.css` (barvy, radiusy, stíny a záře)
- [x] Lokální fonty Nunito + JetBrains Mono (Doto jen pro screenshoty appek, nebo vynechat; latin + latin-ext), kontrola češtiny a ASCII loga
- [x] Komponenty: Logo, TerminalShell, Footer (jazyk + odkazy), LangMenu, PhoneFrame, PlayButton
- [x] Skript terminálu: šipky, Enter, Tab, Esc, výpis skrytých příkazů, navigace bez načítání (výměna obsahu + History API, tlačítko zpět v prohlížeči funguje), na dotykových zařízeních bez vstupního řádku
- [x] Layout `Base.astro` (meta, hreflang, favicon)

**Fáze 3 – Obsah, stránky a šablony**
- [x] Content collections + schémata (`apps`, `appPrivacy`, `pages`)
- [x] Domů (terminál), O studiu, Kontakt, Detail appky jako výpisy v terminálu; Privacy jako výpis v terminálu (EN + CS)
- [x] Šablona `_template` + skript `new-app`
- [x] Ukázková appka „Pockio Docházka" (placeholdery `[…]`, zástupné obrázky z `scripts/make-placeholders.mjs`)

**Fáze 4 – Kvalita**
- [x] Responzivita (telefon, tablet, desktop); screenshoty na telefonu ve dvou sloupcích, žádný horizontální scroll; logo se na úzkém displeji nesmí zvětšit přes okno
- [x] Přístupnost (kontrasty, focus, klávesnice, `alt` texty; terminál: výběr nespoléhá jen na barvu, výstup příkazů v `aria-live`, bez klávesové pasti); tlumený slogan zkontrolovat na kontrast
- [x] Respektovat `prefers-reduced-motion` (hover animace, blikající kurzor)
- [x] Lighthouse (cíl ≥ 95): 21. 11. 2026 nad buildem, mobil i desktop; Domů, O studiu, Appky, CS Domů, CS O studiu: Performance 98–100, Přístupnost / Best Practices / SEO 100
- [x] `sitemap.xml`, `robots.txt`, Open Graph obrázek, favicon sada (PNG ikona 512×512 pro Google Play zvlášť)

**Fáze 5 – Nasazení**
- [ ] (CC) `site: 'https://pockio.eu'`, `public/CNAME`, GitHub Action (`withastro/action`)
- [ ] (ty) Settings → Pages → Source: **GitHub Actions**
- [ ] (ty) Merge větve `astro` do `main`
- [ ] (ty) DNS u registrátora (A záznamy pro GitHub Pages, MX beze změny), custom domain `pockio.eu`, **Enforce HTTPS**
- [ ] Ověřit přesměrování `www` a e-mail
- [ ] Doplnit reálný obsah místo placeholderů

**Fáze 6 – Spuštění**
- [ ] Finální kontrola obou jazyků a odkazů
- [ ] Sitemap do Google Search Console
- [ ] URL privacy policy appky do Google Play Console
- [ ] Do detailu appky vložit **oficiální odznak „Get it on Google Play"** (podle pravidel Google, vlastní tlačítko z návrhu je jen zástupné)

## 8. Práce s Claude Code

Claude Code (CC) napíše skoro všechen kód. Ty zařídíš účty, klikání v cizích službách a kontrolu výsledku.

### Co si doinstalovat do PC

| Co | Proč |
|---|---|
| **Node.js (aktuální LTS)** | Na tom Astro běží. Součástí je `npm`, správce balíčků. |
| **Git** | Nastavit `git config user.name` a `user.email`. |
| **Claude Code** | Pokud už ho používáš, nic navíc. |
| **GitHub CLI (`gh`)**, volitelně | Po `gh auth login` umí CC rovnou pushnout. |
| **VS Code**, volitelně | Na ruční úpravy `.md`. |

Není potřeba Flutter, Python, databáze ani Docker.

### Kdo co dělá

| Fáze | Claude Code | Ty ručně |
|---|---|---|
| **0** | – | Instalace, složka s plánem, logy a `design/` |
| **1** | Astro projekt, i18n, `.gitignore`, první commit | Odsouhlasíš příkazy |
| **2** | `tokens.css`, fonty, komponenty, stránky | Koukneš na `localhost:4321` a řekneš, co upravit |
| **3** | Kolekce, šablona appky, skript `new-app`, privacy | Později reálné texty a screenshoty |
| **4** | Responzivita, přístupnost, Lighthouse, SEO | Test na telefonu (`--host`) |
| **5** | `astro.config`, `CNAME`, GitHub Action | Settings → Pages, merge, DNS, 2FA |
| **6** | Finální kontrola | Search Console, privacy URL do Play Console |

Vždy ručně: koupě domény, DNS, OAuth souhlasy, hesla, 2FA.

### Jak nastavit CC

1. `CLAUDE.md` v kořeni repa (hotový soubor je přiložený vedle plánu).
2. První zadání: „Přečti pockio-mvp-plan.md a design/. Udělej fázi 1 a 2. Nejdřív napiš krátký plán a počkej na mé OK."
3. Po fázích, ne vše naráz.

## 9. Otevřená rozhodnutí

1. **Kontakt (způsob):** stačí `mailto:` odkaz, nebo formulář přes externí službu (Web3Forms / Formspree)? Zatím se počítá s `mailto:`.
2. **Placeholdery:** e-mail, odkaz na vývojářský účet Google Play, cena, velikost a datum aktualizace u appky (texty „Pockio Docházka" i screenshoty jsou zatím ukázkové).
3. **Kam vede příkaz appky v terminálu:** na stránku appky (výchozí), nebo u jednoduchých appek rovnou na Google Play?
7. **Skryté příkazy:** čtyři viditelné jsou dané (`/apps`, `/about`, `/privacy`, `/contact`); které skryté přidat jako první (např. `/email`)? Pro e-mail zvolit zvláštní adresu jen pro web.
8. **Telefon:** rozhodnuto: vstupní řádek se schová, jen klikání (viz design, telefonní boardy). Detaily doladit při vývoji.
4. **Screenshoty:** v návrhu jsou nakreslené ukázky, do ostré verze přijdou skutečné screenshoty z telefonu.
5. **Design system „Pockio"** v artefaktech má pořád staré indigo tokeny. Přepsat na novou paletu a fonty?
6. **Hosting:** zůstat na GitHub Pages (doporučeno), nebo časem vlastní levný server?

Uzavřeno: jen tmavé téma (světlá varianta zrušena), barva okra, mint a DM Mono / IBM Plex Mono zamítnuty, Doto z webu pryč (logo je ASCII art v JetBrains Mono; nadpisy Nunito), web jako terminál (760 px, bez záře; stránky se vypisují v něm, obrazovka se při příkazu vyčistí, na konci výpisu `← /home`; na Domů čtyři příkazy `/apps`, `/about`, `/privacy`, `/contact` (appky v `/apps`), ovládání myší i klávesnicí, skryté příkazy později, `/help` je vypíše, kontakt jen e-mail; screenshoty appek v terminálu jako náhledy; privacy policy jako výpis v terminálu s vlastní URL a odkazem v patičce), EN jako výchozí jazyk, samostatná hlavička s odkazy zrušena, odkazy O studiu / Kontakt / Privacy a přepínač jazyka jen v patičce, plovoucí ikonky a wireframe pozadí zrušeny.

## 10. Bezpečnost a pravidla

- Žádná hesla, API klíče ani tokeny v gitu. Tajné hodnoty do `.env` (v `.gitignore`), vzor v `.env.example`.
- Repo je veřejné: patří do něj jen kód a obsah webu, nic soukromého.
- Statický web, žádná databáze ani přihlašování, malý útočný povrch.
- Bez cookies a trackerů → žádný cookie banner.
- Na webu nezmiňovat „zatím jen Android, iOS možná později".
- Neodvozovat vzhled od jiných webů 1:1: styl je inspirovaný, ale vlastní.

## 11. Definice „hotovo" pro MVP

- Web běží na `https://pockio.eu` v EN (výchozí) i CS
- Vypadá podle návrhu (tmavé téma, terminál na Domů, Nunito + JetBrains Mono, ASCII logo, okra), čeština se zobrazuje správně
- Nová appka se přidá příkazem `npm run new-app`, vyplněním `.md` a pushem
- Každá appka má vlastní stránku a privacy policy na vlastní URL
- Příkaz `/contact` a odkaz v patičce vedou na funkční kontakt (e-mail)
- Každá stránka a každá privacy policy má vlastní URL, privacy je čitelná bez JavaScriptu
- Lighthouse ≥ 95 ve všech kategoriích
