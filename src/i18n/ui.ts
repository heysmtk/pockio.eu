// Texty rozhraní (EN + CS). Obsah stránek je v .md (fáze 3), tady jen UI.
export type Lang = 'en' | 'cs';

export const langs: Lang[] = ['en', 'cs'];

export const ui = {
  en: {
    htmlLang: 'en',
    langName: 'English',
    langShort: 'EN',
    siteTitle: 'Pockio',
    description: 'Pocket-sized helpers: small, simple apps by the Pockio studio.',
    tagline: 'Pocket-sized helpers · pockio.eu',
    selectCommand: 'Select a command:',
    selectApp: 'Select an app:',
    moreSoon: 'More pocket-sized helpers on the way',
    inputPlaceholder: 'type / for commands…',
    inputLabel: 'Type a command',
    hintHelp: '? help',
    hintTab: 'tab complete',
    notFound: 'command not found:',
    back: '← /home',
    backApps: '← /apps',
    footer: { about: 'about', contact: 'contact', privacy: 'privacy' },
    copyright: '© 2026 Pockio · pockio.eu · Made in the evenings, in Czechia.',
    langMenuLabel: 'Language',
    footerNavLabel: 'Site',
    helpTitle: 'Commands',
    helpTip: 'Tip: ↑ ↓ to move, Enter to open, Tab to complete.',
    privacyTitle: 'Privacy policy',
    app: {
      playLabel: 'Get it on Google Play',
      screenshots: 'Screenshots',
      about: 'About the app',
      features: 'What it does',
      information: 'Information',
      whatsNew: 'What’s new',
      privacy: 'Privacy policy:',
      readIt: 'Read it →',
      developer: 'Developer',
      detail: { version: 'Version', size: 'Size', updated: 'Updated', requires: 'Requires', price: 'Price' },
    },
  },
  cs: {
    htmlLang: 'cs',
    langName: 'Čeština',
    langShort: 'CS',
    siteTitle: 'Pockio',
    description: 'Kapesní pomocníci: malé, jednoduché appky od studia Pockio.',
    tagline: 'Kapesní pomocníci · pockio.eu',
    selectCommand: 'Vyber příkaz:',
    selectApp: 'Vyber appku:',
    moreSoon: 'Další kapesní pomocníci na cestě',
    inputPlaceholder: 'napiš / pro příkazy…',
    inputLabel: 'Napiš příkaz',
    hintHelp: '? nápověda',
    hintTab: 'tab doplnit',
    notFound: 'příkaz nenalezen:',
    back: '← /home',
    backApps: '← /appky',
    footer: { about: 'o studiu', contact: 'kontakt', privacy: 'soukromí' },
    copyright: '© 2026 Pockio · pockio.eu · Vyrobeno po večerech v Česku.',
    langMenuLabel: 'Jazyk',
    footerNavLabel: 'Web',
    helpTitle: 'Příkazy',
    helpTip: 'Tip: ↑ ↓ pohyb, Enter otevře, Tab doplní.',
    privacyTitle: 'Zásady ochrany soukromí',
    app: {
      playLabel: 'Stáhnout z Google Play',
      screenshots: 'Screenshoty',
      about: 'O appce',
      features: 'Co umí',
      information: 'Informace',
      whatsNew: 'Co je nového',
      privacy: 'Zásady ochrany soukromí:',
      readIt: 'Přečíst →',
      developer: 'Vývojář',
      detail: { version: 'Verze', size: 'Velikost', updated: 'Aktualizováno', requires: 'Vyžaduje', price: 'Cena' },
    },
  },
} as const;

export function t(lang: Lang) {
  return ui[lang];
}

/** Adresa domovské stránky jazyka. */
export function homeUrl(lang: Lang): string {
  return lang === 'en' ? '/' : '/cs/';
}
