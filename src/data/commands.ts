// Všechny příkazy terminálu na jednom místě.
// - `home: true` = příkaz je vidět na Domů (v tomto pořadí),
// - ostatní jsou skryté (jdou napsat, `/help` je vypíše),
// - `type: 'link'` přejde na stránku, `type: 'output'` vypíše text v terminálu.
// Appky (příkaz `/slug`) se vypisují v `/apps`; ve fázi 3 je nahradí content collection `apps`.
import { routes } from '../i18n/routes';
import type { Lang } from '../i18n/ui';

export interface AppCommand {
  slug: string; // příkaz je `/slug`
  title: string;
  description: string;
  href: string;
}

export type Command = {
  name: string;
  aliases?: string[];
  description: string;
  home?: boolean;
} & (
  | { type: 'link'; href: string }
  | {
      type: 'output';
      title: string;
      lines: string[];
      /** odkaz pod výpisem (např. na plnou stránku) */
      more?: { label: string; href: string };
      /** adresa, kam vede řádek v seznamu bez JS */
      href?: string;
    }
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

const commands: Record<Lang, Command[]> = {
  en: [
    { name: 'apps', type: 'link', href: routes.apps.en, description: 'our pocket-sized apps', home: true },
    { name: 'about', type: 'link', href: routes.about.en, description: 'about the studio', home: true },
    {
      name: 'privacy',
      type: 'output',
      title: 'Privacy policy',
      // Zástupné shrnutí; před spuštěním zkontrolovat.
      lines: [
        'This website uses no cookies and no trackers.',
        'The apps keep your data on your phone.',
      ],
      more: { label: 'Read the full privacy policy →', href: routes.privacy.en },
      href: routes.privacy.en,
      description: 'privacy policy',
      home: true,
    },
    { name: 'contact', type: 'link', href: routes.contact.en, description: 'get in touch', home: true },
    { name: 'home', type: 'link', href: routes.home.en, description: 'back to the start' },
    {
      name: 'email',
      type: 'output',
      title: 'Email',
      // Zástupný e-mail; před spuštěním doplnit skutečnou webovou adresu.
      lines: ['Email: [YOUR EMAIL]'],
      description: 'email address',
    },
  ],
  cs: [
    { name: 'appky', aliases: ['apps'], type: 'link', href: routes.apps.cs, description: 'naše kapesní appky', home: true },
    { name: 'o-studiu', aliases: ['about'], type: 'link', href: routes.about.cs, description: 'o studiu', home: true },
    {
      name: 'soukromi',
      aliases: ['privacy'],
      type: 'output',
      title: 'Zásady ochrany soukromí',
      lines: [
        'Tento web nepoužívá cookies ani trackery.',
        'Appky drží tvoje data v telefonu.',
      ],
      more: { label: 'Přečíst celé zásady ochrany soukromí →', href: routes.privacy.cs },
      href: routes.privacy.cs,
      description: 'zásady ochrany soukromí',
      home: true,
    },
    { name: 'kontakt', aliases: ['contact'], type: 'link', href: routes.contact.cs, description: 'napiš mi', home: true },
    { name: 'home', type: 'link', href: routes.home.cs, description: 'zpět na začátek' },
    {
      name: 'email',
      type: 'output',
      title: 'E-mail',
      lines: ['E-mail: [TVŮJ E-MAIL]'],
      description: 'e-mailová adresa',
    },
  ],
};

export function getApps(lang: Lang): AppCommand[] {
  return apps[lang];
}

export function getCommands(lang: Lang): Command[] {
  return commands[lang];
}

/** Příkazy viditelné na Domů. */
export function getHomeCommands(lang: Lang): Command[] {
  return commands[lang].filter((c) => c.home);
}

/** Data pro skript terminálu (vloží se do stránky jako JSON). */
export function commandsForScript(lang: Lang) {
  return { apps: apps[lang], commands: commands[lang] };
}
