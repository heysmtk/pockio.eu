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
    selectApp: 'Select an app:',
    moreSoon: 'More pocket-sized helpers on the way',
    inputPlaceholder: 'type / for commands…',
    inputLabel: 'Type a command',
    hintHelp: '? help',
    hintTab: 'tab complete',
    notFound: 'command not found:',
    back: '← /home',
    footer: { about: 'about', contact: 'contact', privacy: 'privacy' },
    copyright: '© 2026 Pockio · pockio.eu · Made in the evenings, in Czechia.',
    langMenuLabel: 'Language',
    footerNavLabel: 'Site',
    helpTitle: 'Commands',
    helpTip: 'Tip: ↑ ↓ to move, Enter to open, Tab to complete.',
    privacyTitle: 'Privacy policy',
  },
  cs: {
    htmlLang: 'cs',
    langName: 'Čeština',
    langShort: 'CS',
    siteTitle: 'Pockio',
    description: 'Kapesní pomocníci: malé, jednoduché appky od studia Pockio.',
    tagline: 'Kapesní pomocníci · pockio.eu',
    selectApp: 'Vyber appku:',
    moreSoon: 'Další kapesní pomocníci na cestě',
    inputPlaceholder: 'napiš / pro příkazy…',
    inputLabel: 'Napiš příkaz',
    hintHelp: '? nápověda',
    hintTab: 'tab doplnit',
    notFound: 'příkaz nenalezen:',
    back: '← /home',
    footer: { about: 'o studiu', contact: 'kontakt', privacy: 'soukromí' },
    copyright: '© 2026 Pockio · pockio.eu · Vyrobeno po večerech v Česku.',
    langMenuLabel: 'Jazyk',
    footerNavLabel: 'Web',
    helpTitle: 'Příkazy',
    helpTip: 'Tip: ↑ ↓ pohyb, Enter otevře, Tab doplní.',
    privacyTitle: 'Zásady ochrany soukromí',
  },
} as const;

export function t(lang: Lang) {
  return ui[lang];
}

/** Adresa domovské stránky jazyka. */
export function homeUrl(lang: Lang): string {
  return lang === 'en' ? '/' : '/cs/';
}
