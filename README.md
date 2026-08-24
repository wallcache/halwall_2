# halwall.me — Recto / Verso

A rebuild of halwall.me. Next 16, App Router, React 19.

## The idea

A *verso* is the left-hand page of an open book, a *recto* the right. The site is one spread: the engineer on the verso, the founder of a literature app on the recto, and a gutter between them.

One number owns the whole art direction:

```
--gutter   0 = the recto has the page   (founder)
         0.5 = the spread               (idle)
           1 = the verso has the page   (engineer)
```

**The navigation is the switch.** Hovering *or focusing* a nav link commits the entire page to that link's world before you click it, so the split is found by using the site normally rather than by discovering a hidden control. Dragging the seam works too, with real release velocity and overshoot, but nothing depends on you finding it.

The split persists in a cookie. `/work` opens verso, `/canon` opens recto, and returning restores the side you were last reading. That is what stops it being a hero widget.

### Two rules that keep it fast

1. `--gutter` is written straight to `document.documentElement` — **never React state on pointermove**. React only sees the coarse `mode`, which changes once per gesture.
2. Everything animated is `transform`, `opacity`, `clip-path` or `filter`. Nothing forces layout.

## Structure

```
app/                routes
components/         UI. Nav, Spread, Gallery, Lightbox, Ledger, Footer
content/            ALL copy and data. Nothing hardcoded in components.
lib/gutter.tsx      the gutter state machine
lib/tween.ts        forty-line rAF tween (see Colophon for why no GSAP)
lib/gated.ts        HMAC access control for the locked gallery
public/media/       61MB of optimised WebP (from 267MB of source)
private-media/      the gated gallery. NOT under public/, deliberately.
scripts/            asset migration + validation
```

## Running it

```bash
npm install
cp .env.example .env.local     # then fill in the two gallery vars
npm run dev
```

## Verification

```bash
npm run build
node scripts/validate-media.mjs   # every content media path resolves (550 of them)
npx tsc --noEmit
```

Manual passes worth repeating before any deploy:

- Walk every route at 1440px and 390px.
- Keyboard only: tab to each nav link and confirm the gutter commits on focus exactly as on hover.
- Turn on OS reduced-motion: the gutter should *cut* rather than travel, and nothing should move positionally.
- Confirm `/api/gated/vw-harrods/...` returns 404 without a valid cookie.

## What changed from the old site

- **Navigation.** The old site had ~20 URLs and a homepage that opened onto almost none of them, behind a single "More" dropdown plus a desktop-only sidebar. There is now one persistent nav and every page is reachable.
- **`/writing` is gone.** It was deleted in `d62a855` but still advertised in `sitemap.ts` at priority 0.8, so the sitemap served a 404. The sitemap is now derived from content and cannot drift.
- **The gated gallery is actually gated.** It compared a plaintext password inside the client bundle, and the images were fetchable straight from `public/` regardless. The files now live outside `public/` and are served through a route handler that verifies an HMAC cookie on every request.
- **`educationData` is rendered.** It existed in the old data layer and appeared on no page.
- **Assets.** 267MB → 61MB. Filenames slugified, so no URL needs percent-encoding.
- **Redirects.** Every legacy URL 308s to its new home.

## Still to do

- The portrait. See `PHOTOGRAPHER_BRIEF.md` — the current frame is an interim stand-in and is captioned as such.
- The three case studies on `/work` are **drafted and need Hal's review**; they infer some architectural detail the CV only implies. Marked `needsReview` in `content/case-studies.ts`.
- Confirm The Daily Canon's real download figure. `content/projects.ts` uses 6,000+, per the design brief.
