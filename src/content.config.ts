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

const appId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, ''); // id = "attendance/en"

// Stránka appky: src/content/apps/<složka>/<jazyk>.md (šablona _template se vynechá)
const apps = defineCollection({
  loader: glob({ pattern: ['*/{en,cs}.md', '!_template/**'], base: './src/content/apps', generateId: appId }),
  schema: ({ image }) =>
    z.strictObject({
      slug: z.string().regex(/^[a-z0-9-]+$/), // URL appky v tomto jazyce
      title: z.string(),
      tagline: z.string(),
      status: z.enum(['released', 'soon']), // `soon` se nezobrazí jako příkaz
      order: z.number(),
      icon: image(),
      chips: z.array(z.string()),
      playUrl: z.string(),
      features: z.array(z.string()).min(1),
      screenshots: z.array(z.strictObject({ file: image(), caption: z.string() })),
      details: z.strictObject({
        version: z.string(),
        size: z.string(),
        updated: z.string(),
        requires: z.string(),
        price: z.string(),
      }),
      whatsNew: z.string(),
    }),
});

// Privacy policy appky: src/content/apps/<složka>/privacy.<jazyk>.md
const appPrivacy = defineCollection({
  loader: glob({ pattern: ['*/privacy.{en,cs}.md', '!_template/**'], base: './src/content/apps', generateId: appId }),
  schema: z.strictObject({ title: z.string(), description: z.string() }),
});

export const collections = { pages, apps, appPrivacy };
