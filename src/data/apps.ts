// Čtení kolekce `apps` (stránky appek z Markdownu). Složka appky je klíč, který spojí EN a CS verzi.
import { getCollection, type CollectionEntry } from 'astro:content';
import { appUrl, type Alternates } from '../i18n/routes';
import type { Lang } from '../i18n/ui';

export type AppEntry = CollectionEntry<'apps'>;

/** Klíč appky = název složky (`attendance`). */
export const appKey = (e: { id: string }) => e.id.split('/')[0] ?? e.id;
const langOf = (e: { id: string }) => e.id.split('/').pop()?.split('.').pop();

/** Vydané appky v jazyce, seřazené podle `order`. */
export async function getReleasedApps(lang: Lang): Promise<AppEntry[]> {
  const all = await getCollection('apps', (e) => langOf(e) === lang && e.data.status === 'released');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/** URL EN a CS verze appky (pro hreflang a přepínač jazyka). */
export async function getAppAlternates(key: string): Promise<Alternates> {
  const all = await getCollection('apps', (e) => appKey(e) === key);
  const pick = (lang: Lang) => {
    const e = all.find((x) => langOf(x) === lang);
    if (!e) throw new Error(`Appka „${key}“ nemá ${lang}.md`);
    return appUrl(lang, e.data.slug);
  };
  return { en: pick('en'), cs: pick('cs') };
}
