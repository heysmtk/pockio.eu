// Všechny příkazy terminálu na jednom místě.
// - `home: true` = příkaz je vidět na Domů (v tomto pořadí),
// - ostatní jsou skryté (jdou napsat, `/help` je vypíše),
// - `type: 'link'` přejde na stránku, `type: 'output'` vypíše text v terminálu.
// Appky (příkaz `/slug`) se berou z content collection `apps` a vypisují se v `/apps`.
import { appUrl, routes } from '../i18n/routes';
import type { Lang } from '../i18n/ui';
import { getImage } from 'astro:assets';
import { getReleasedApps } from './apps';

export interface AppCommand {
  slug: string; // příkaz je `/slug`
  title: string;
  description: string;
  href: string;
  /** adresa ikony appky (malá, 2×) */
  icon: string;
}

export type Command = {
  name: string;
  aliases?: string[];
  description: string;
  home?: boolean;
} & (
  | { type: 'link'; href: string }
  | { type: 'output'; title: string; lines: string[] }
);

const commands: Record<Lang, Command[]> = {
  en: [
    { name: 'apps', type: 'link', href: routes.apps.en, description: 'our pocket-sized apps', home: true },
    { name: 'about', type: 'link', href: routes.about.en, description: 'about the studio', home: true },
    { name: 'privacy', type: 'link', href: routes.privacy.en, description: 'privacy policy', home: true },
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
    { name: 'soukromi', aliases: ['privacy'], type: 'link', href: routes.privacy.cs, description: 'zásady ochrany soukromí', home: true },
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

export async function getApps(lang: Lang): Promise<AppCommand[]> {
  const entries = await getReleasedApps(lang);
  return Promise.all(
    entries.map(async (e) => ({
      slug: e.data.slug,
      title: e.data.title,
      description: e.data.tagline.replace(/\.$/, ''),
      href: appUrl(lang, e.data.slug),
      icon: (await getImage({ src: e.data.icon, width: 40, height: 40, format: 'webp' })).src,
    })),
  );
}

export function getCommands(lang: Lang): Command[] {
  return commands[lang];
}

/** Příkazy viditelné na Domů. */
export function getHomeCommands(lang: Lang): Command[] {
  return commands[lang].filter((c) => c.home);
}

/** Data pro skript terminálu (vloží se do stránky jako JSON). */
export async function commandsForScript(lang: Lang) {
  return { apps: await getApps(lang), commands: commands[lang] };
}
