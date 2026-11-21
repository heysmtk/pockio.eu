# design/

Screenshoty schváleného návrhu (plátno „Pockio.eu – website"), vždy EN a CS, jen tmavé téma. Desktop (okno prohlížeče 1280 px, terminál 760 px) (`*-en.png`, `*-cs.png`), telefon 390 px (`*-telefon.png`).

| Soubor | Co ukazuje |
|---|---|
| `01-home-*` | Domů: terminál se čtyřmi příkazy `/apps`, `/about`, `/privacy`, `/contact` |
| `02-apps-*` | Výpis `/apps`: seznam appek + šedý řádek „More pocket-sized helpers on the way" |
| `03-o-studiu-*` | O studiu jako výpis `/about` |
| `04-detail-appky-*` | Detail appky jako výpis `/attendance` (zpět `← /apps`) |
| `05-kontakt-*` | Kontakt jako výpis `/contact` |
| `06-privacy-*` | Privacy: starší návrh jako samostatná stránka; teď se privacy vypisuje v terminálu (jako ostatní stránky) |
| `terminal-demo-vypisovani.html` | Klikací ukázka vypisování po slovech (starší, appky ještě přímo na Domů; chování výpisu platí). |

Poznámky:
- Na telefonu nejde psát: vstupní řádek a nápověda se schovají, jen klikání. ASCII logo je na telefonu 13 px, screenshoty appky jsou ve 2 sloupcích bez horizontálního scrollu.
- Výpisy jsou ve finálním stavu (po dokončení vypisování).
- Texty v `[…]` jsou zástupné (e-mail, odkaz na Google Play, velikost, datum). Screenshoty appky jsou nakreslené ukázky.
- Tlačítko Google Play je zástupné, v ostré verzi oficiální odznak podle pravidel Google.
- Logo na webu je ASCII art (JetBrains Mono, okrová, 14 px / na telefonu 13 px); dlaždice `../logo/pockio-logo-dark.svg` zůstává jen jako favicon a ikona.
- Screeny aktualizovány: ASCII logo, menší písmo výpisů (12 px; nadpis 14 px).
