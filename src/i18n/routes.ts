// URL stránek v obou jazycích na jednom místě.
import type { Lang } from './ui';

export type PageKey = 'home' | 'about' | 'contact' | 'privacy';

export const routes: Record<PageKey, Record<Lang, string>> = {
  home: { en: '/', cs: '/cs/' },
  about: { en: '/about/', cs: '/cs/o-studiu/' },
  contact: { en: '/contact/', cs: '/cs/kontakt/' },
  privacy: { en: '/privacy/', cs: '/cs/privacy/' },
};

export type Alternates = Record<Lang, string>;

export function alternatesFor(key: PageKey): Alternates {
  return routes[key];
}
