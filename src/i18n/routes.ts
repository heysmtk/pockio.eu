// URL stránek v obou jazycích na jednom místě.
import type { Lang } from './ui';

export type PageKey = 'home' | 'apps' | 'about' | 'contact' | 'privacy';

export const routes: Record<PageKey, Record<Lang, string>> = {
  home: { en: '/', cs: '/cs/' },
  apps: { en: '/apps/', cs: '/cs/appky/' },
  about: { en: '/about/', cs: '/cs/o-studiu/' },
  contact: { en: '/contact/', cs: '/cs/kontakt/' },
  privacy: { en: '/privacy/', cs: '/cs/privacy/' },
};

/** URL detailu appky v daném jazyce (slug je v každém jazyce jiný). */
export const appUrl = (lang: Lang, slug: string) => (lang === 'en' ? `/apps/${slug}/` : `/cs/appky/${slug}/`);
/** URL privacy policy appky. */
export const appPrivacyUrl = (lang: Lang, slug: string) => (lang === 'en' ? `/privacy/${slug}/` : `/cs/privacy/${slug}/`);

export type Alternates = Record<Lang, string>;

export function alternatesFor(key: PageKey): Alternates {
  return routes[key];
}
