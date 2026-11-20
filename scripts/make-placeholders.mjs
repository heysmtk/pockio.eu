// Vygeneruje zástupné obrázky pro appku (ikona + 4 screenshoty 216×440 @2x).
// Použití: node scripts/make-placeholders.mjs <složka-appky> [popisek1,popisek2,...]
// Skutečné obrázky pak jen přepiš (stejné názvy souborů). Používá `sharp` (je součástí Astra).
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
if (!dir) {
  console.error('Použití: node scripts/make-placeholders.mjs <složka-appky> [popisky]');
  process.exit(1);
}
const labels = (process.argv[3] ?? 'Main screen,Week,Month,Export').split(',');
mkdirSync(join(dir, 'screenshots'), { recursive: true });

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="512" height="512">
<rect x="6" y="6" width="88" height="88" rx="24" fill="#D9A441"/>
<g fill="none" stroke="#131313" stroke-width="8" stroke-linecap="round"><path d="M36 30 V72"/><circle cx="52" cy="46" r="16"/></g>
<circle cx="52" cy="46" r="4" fill="#131313"/></svg>`;
await sharp(Buffer.from(icon)).png().toFile(join(dir, 'icon.png'));

for (const [i, label] of labels.entries()) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="432" height="880" viewBox="0 0 432 880">
<rect width="432" height="880" fill="#0A0907"/>
<text x="40" y="80" font-family="monospace" font-size="22" fill="#7F785F" letter-spacing="3">${label.toUpperCase()}</text>
<text x="216" y="450" font-family="monospace" font-size="64" fill="#D9A441" text-anchor="middle">${i + 1}</text>
<text x="216" y="500" font-family="monospace" font-size="22" fill="#A39B87" text-anchor="middle">placeholder</text></svg>`;
  await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(join(dir, 'screenshots', `${i + 1}.png`));
}
console.log(`Hotovo: ${dir}/icon.png a ${labels.length} screenshotů`);
