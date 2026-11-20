// sitemap.xml bez extra knihovny: projde stránky a appky a ke každé přidá EN/CS alternativy.
import type { APIRoute } from 'astro';
import { getAppAlternates, getReleasedApps, appKey } from '../data/apps';
import { appPrivacyUrl, routes } from '../i18n/routes';
import { langs, type Lang } from '../i18n/ui';

type Group = Record<Lang, string>;

export const GET: APIRoute = async ({ site }) => {
  const groups: Group[] = Object.values(routes);
  for (const entry of await getReleasedApps('en')) {
    groups.push(await getAppAlternates(appKey(entry)));
  }
  for (const entry of await getReleasedApps('en')) {
    const cs = (await getReleasedApps('cs')).find((e) => appKey(e) === appKey(entry));
    if (cs) groups.push({ en: appPrivacyUrl('en', entry.data.slug), cs: appPrivacyUrl('cs', cs.data.slug) });
  }
  const abs = (p: string) => new URL(p, site).href;
  const urls = groups.flatMap((g) =>
    langs.map(
      (l) =>
        `  <url>\n    <loc>${abs(g[l])}</loc>\n` +
        langs.map((a) => `    <xhtml:link rel="alternate" hreflang="${a}" href="${abs(g[a])}"/>`).join('\n') +
        `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(g.en)}"/>\n  </url>`,
    ),
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
