// Všechny příkazy terminálu na jednom místě.
// Viditelné příkazy = appky (ve fázi 3 se budou číst z content collection `apps`).
// Skryté příkazy se píšou ručně: type 'link' otevře stránku, type 'output' vypíše řádky.
import type { Lang } from '../i18n/ui';

export interface AppCommand {
  slug: string; // příkaz je `/slug`
  title: string;
  description: string;
  href: string;
}

export type HiddenCommand = {
  name: string;
  aliases?: string[];
  description: string;
} & (
  | { type: 'link'; href: string }
  | { type: 'output'; title: string; lines: string[] }
);

// DOČASNĚ: ve fázi 3 nahradí content collection `apps`.
const apps: Record<Lang, AppCommand[]> = {
  en: [
    {
      slug: 'attendance',
      title: 'Pockio Attendance',
      description: 'attendance in one tap',
      href: '/apps/attendance/',
    },
  ],
  cs: [
    {
      slug: 'dochazka',
      title: 'Pockio Docházka',
      description: 'docházka na jedno klepnutí',
      href: '/cs/appky/dochazka/',
    },
  ],
};

const hidden: Record<Lang, HiddenCommand[]> = {
  en: [
    { name: 'home', type: 'link', href: '/', description: 'back to the start' },
    { name: 'about', type: 'link', href: '/about/', description: 'who is behind this' },
    {
      name: 'contact',
      type: 'output',
      title: 'Contact',
      // Zástupný e-mail; před spuštěním doplnit skutečnou webovou adresu.
      lines: ['Email: [YOUR EMAIL]'],
      description: 'email',
    },
  ],
  cs: [
    { name: 'home', type: 'link', href: '/cs/', description: 'zpět na začátek' },
    {
      name: 'o-studiu',
      aliases: ['about'],
      type: 'link',
      href: '/cs/o-studiu/',
      description: 'kdo za tím stojí',
    },
    {
      name: 'kontakt',
      aliases: ['contact'],
      type: 'output',
      title: 'Kontakt',
      lines: ['E-mail: [TVŮJ E-MAIL]'],
      description: 'e-mail',
    },
  ],
};

export function getApps(lang: Lang): AppCommand[] {
  return apps[lang];
}

export function getHidden(lang: Lang): HiddenCommand[] {
  return hidden[lang];
}

/** Data pro skript terminálu (vloží se do stránky jako JSON). */
export function commandsForScript(lang: Lang) {
  return {
    apps: apps[lang],
    hidden: hidden[lang],
  };
}
