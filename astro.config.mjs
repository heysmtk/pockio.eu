// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://pockio.eu',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'cs'],
    // EN na /, CS pod /cs/
    routing: { prefixDefaultLocale: false },
  },
});
