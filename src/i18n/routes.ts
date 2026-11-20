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

export type Alternates = Record<Lang, string>;

export function alternatesFor(key: PageKey): Alternates {
  return routes[key];
}
