// Schémata kolekcí. Chybějící nebo špatné pole zachytí build.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Textové stránky webu: about / contact / privacy, soubory `<klíč>.<jazyk>.md`
const pages = defineCollection({
  loader: glob({
    pattern: '*.md',
    base: './src/content/pages',
    generateId: ({ entry }) => entry.replace(/\.md$/, ''), // id = "about.en"
  }),
  schema: z.strictObject({
    title: z.string(),
    description: z.string(),
    command: z.string(), // zobrazený příkaz v echu, např. "/about"
  }),
});

export const collections = { pages };
