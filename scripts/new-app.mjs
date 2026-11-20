// Vytvoří novou appku ze šablony: npm run new-app -- <slug>
// Zkopíruje src/content/apps/_template/ do src/content/apps/<slug>/ a vloží slug do en.md a cs.md.
// Používá jen vestavěné moduly Node (bez knihoven).
import { cpSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const slug = process.argv[2];
if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error('Použití: npm run new-app -- <slug>   (malá písmena, čísla a pomlčky, např. "my-app")');
  process.exit(1);
}

const apps = join('src', 'content', 'apps');
const from = join(apps, '_template');
const to = join(apps, slug);
if (!existsSync(from)) {
  console.error(`Chybí šablona ${from}`);
  process.exit(1);
}
if (existsSync(to)) {
  console.error(`Složka ${to} už existuje, nic jsem nepřepsal.`);
  process.exit(1);
}

cpSync(from, to, { recursive: true });
for (const lang of ['en', 'cs']) {
  const file = join(to, `${lang}.md`);
  writeFileSync(file, readFileSync(file, 'utf8').replace('__SLUG__', slug));
}

console.log(`Hotovo: ${to}

Co dál:
  1. ${join(to, 'en.md')} a ${join(to, 'cs.md')}: vyplň pole (v češtině změň slug na český tvar).
  2. Přidej ${join(to, 'icon.png')} a screenshoty do ${join(to, 'screenshots')}/.
  3. Uprav privacy.en.md a privacy.cs.md.
  4. Nastav status: released, ať se appka objeví v /apps.
  5. npm run build, pak git push.`);
