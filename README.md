# Proud Cph website (host-klar)

Denne hjemmeside er gjort **klar til hosting** som statisk site.

## Filer i projektet
- `index.html`
- `shop.html`
- `funktioner.html`
- `om-os.html`
- `kontakt.html`
- `betalinger.html`
- `medarbejder.html`
- `styles.css`
- `script.js`
- `404.html`
- `robots.txt`
- `sitemap.xml`
- `netlify.toml`
- `vercel.json`
- `handelsbetingelser.html`
- `privatlivspolitik.html`
- `retur.html`
- `site.webmanifest`

## Hurtig deploy (uden kodeændringer)

### Netlify (nemmest)
1. Opret konto på Netlify.
2. Vælg **Add new site** → **Deploy manually**.
3. Upload hele mappen med disse filer.
4. Siden går live med det samme.

`netlify.toml` er inkluderet og sørger for:
- Korrekt publicering fra rodmappen (`publish = "."`)
- Pæne URL'er (`/shop`, `/kontakt` osv.)
- Basale sikkerhedsheaders

### Vercel
1. Opret konto på Vercel.
2. Importér repo/mappen.
3. Deploy.

`vercel.json` er inkluderet og sørger for:
- Rewrite fra pæne URL'er til `.html`
- Caching af CSS/JS

### GitHub Pages
1. Push projektet til GitHub.
2. Settings → Pages → Deploy from branch (`main`, root).
3. Åbn siden på din GitHub Pages URL.

> Bemærk: GitHub Pages bruger ikke `netlify.toml`/`vercel.json`, men siden virker stadig, da det er ren statisk HTML.

## Lokalt preview
```bash
python3 -m http.server 4173
```
Åbn derefter:
- http://localhost:4173/
- http://localhost:4173/shop.html

## Vigtigt før rigtig lancering
- Opdatér `sitemap.xml` med dit rigtige domæne.
- Opdatér `robots.txt` med samme domæne.
- Tilpas indholdet i `handelsbetingelser.html`, `privatlivspolitik.html` og `retur.html` til jeres juridiske setup.
- Erstat demo-tekster/produkter med rigtige produkter.
- Tilføj rigtig checkout/payment backend (nuværende betalingsmodul er frontend-demo via localStorage).


## Medarbejderportal (demo)
- URL: `/medarbejder` eller `/medarbejder.html`
- Demo-login: `staff@proudcph.com` / `Proud2026!`
- Portalen viser ordrer og simulerer udsendelse af ordremails via et internt mail-log i browseren.
