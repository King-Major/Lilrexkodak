# Lil Rex Kodak — official site

Mobile-first artist site built with **React + Vite**. Black and white, with the dino green kept for the things that matter: the rex, the main buttons and the focus ring.

What is on the page, top to bottom: a halftone planet hero with the rex in orbit, a ticker of track names, the latest release on a spinning record, the full music list, a press kit, a booking form, the Kodak Club sign-up, and merch and tour placeholders.

## Run it

You need Node 20.19 or newer (22 is fine).

```bash
npm install
npm run dev        # opens a local copy with live reload
npm run build      # makes the finished site in dist/
npm run preview    # serves dist/ so you can check the real build
```

## Before you launch

1. **Copy `.env.example` to `.env`** and fill it in:
   - `VITE_SITE_URL` is your live address, for example `https://lilrexkodak.com`. It powers the share image and canonical link.
   - `VITE_BOOKING_ENDPOINT` is where the booking form posts. A free [Formspree](https://formspree.io) form works: create a form, paste its URL (`https://formspree.io/f/xxxxxxxx`).
   - `VITE_CLUB_ENDPOINT` is the same idea for the Kodak Club sign-up. Make a second Formspree form, or point it at a Mailchimp or ConvertKit endpoint that accepts a JSON POST.

   Rebuild after you change `.env`. If these two are left empty, the live site shows "not switched on yet" under the forms instead of pretending to send. In `npm run dev` the forms run in a demo mode so you can try the design.

2. **Press kit files.** Put the real files in `public/press/`, then open `src/data/site.js`, find `downloads` and set each `file`, for example `file: 'press/lil-rex-kodak-bio.pdf'`. Until a file is set, that row says "Request" and takes the visitor to the booking form with a note filled in.

3. **Replace the bio.** The press kit bio in `src/data/site.js` was written from the facts in the project brief. Swap in the artist's own words.

4. **Share image and icons.** `public/og-image.png` (1200×630) is what shows when the link is shared. The one included is a placeholder render of the hero, so replace it with cover art or a press photo when you have one. The app icons in `public/` are the rex on black.

5. **Track links.** Every track currently opens a "Listen on" sheet that links to the artist profile on each platform. To send a track straight to its own page, add `links` to that release in `src/data/site.js`:

   ```js
   { id: 'zombie', title: 'Zombie', type: 'Single', feat: 'Boi_Zema Dtb', latest: true, world: 'rex',
     links: { spotify: 'https://open.spotify.com/track/…', apple: 'https://music.apple.com/…' } }
   ```

## Editing the content

Everything the artist's team will change lives in **`src/data/site.js`**: the bio, streaming links, nav, releases, tabs and press kit rows. No other file needs to change to add a release.

- **Add a release:** add a line to `releases`. `type` is `'EP'`, `'Single'` or `'Collab'`. `world` is `'ink'` (black and white planet) or `'rex'` (green planet). Each release gets its own planet drawn from its `id`, so it looks the same on every visit.
- **Change the latest release:** move `latest: true` to another release. The hero button, the record and the sticky "Stream" button follow it.
- **Colours:** the tokens at the top of `src/styles/base.css` (`--rex` is the green).
- **Fonts:** Bricolage Grotesque, loaded from Google Fonts in `index.html`. To self-host it instead, install `@fontsource-variable/bricolage-grotesque`, import it in `src/main.jsx` and delete the three Google Fonts lines in `index.html`.
- **Social links:** the brief only listed the four streaming profiles, so there are no social icons. Add them to `platforms` if you want them in the menu and sheet.

## Put it online

`npm run build` produces a plain static site in `dist/`. It uses relative paths, so it works on any static host: Netlify, Vercel, Cloudflare Pages, GitHub Pages, or a folder on your own server. Upload the contents of `dist/`, or connect the repo and set the build command to `npm run build` and the output folder to `dist`.

## Phase 2 (from the brief)

The merch store and tour dates are placeholders in the Kodak Club section, ready to be swapped for a Shopify or Printify link and a Bandsintown widget when those exist.

## How it behaves

- **Mobile first.** Designed at 360px wide and scaled up. Large tap targets, safe-area padding for notched phones, a full-screen menu, and a sticky "Stream" button after the hero.
- **Light.** About 75 KB of code once compressed, no UI library, and no images on the page (the planets are drawn in code). The Spotify player loads only when someone taps "Play on this page", so mobile data is not spent until it is wanted.
- **Respects "reduce motion".** The starfield, orbit and spinning record hold still for visitors who ask for that.
- **Accessible.** Skip link, visible focus, labelled form errors, keyboard-friendly listen sheet (Esc closes it).
- **Titles never break.** Long release names shrink to fit their column instead of spilling off the screen.

## Project map

```
index.html              page title, share tags, fonts, structured data for search
vite.config.js          fills in your site address at build time
public/                 favicon, app icons, share image, robots.txt, press/ files
src/data/site.js        all content and links (edit this)
src/styles/base.css     colours, type and shared styles
src/components/         Hero, LatestRelease, Discography, PressKit, Booking, KodakClub, ...
src/lib/                form sending, validation, planet drawing
```
