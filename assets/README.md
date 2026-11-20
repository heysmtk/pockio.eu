# Favicon Pockio

Vše patří do `public/` (kořen webu). Zdroj je `favicon.svg` (tečka v "p" a tlustší tah, aby se "p" četlo i v 16 px).

Do `<head>` v `Base.astro`:

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
```

`public/site.webmanifest`:

```json
{
  "name": "Pockio",
  "icons": [
    { "src": "/favicon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/favicon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "theme_color": "#0D0B07",
  "background_color": "#0D0B07",
  "display": "browser"
}
```

Poznámky: `apple-touch-icon.png` a `icon-maskable-512.png` jsou čtverec bez zaoblení (iOS/Android si zaoblí sami). Ikona pro Google Play (512 px) se dělá zvlášť.
