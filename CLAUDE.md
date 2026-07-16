# Bryan Van Dusen — Children's Author Website

## Project overview

A **single-page** marketing site for **Bryan Van Dusen**, a children's picture-book
author. Domain: `bryanvandusen.com` (not yet pointed at Netlify — currently live at
`bryanvandusen.netlify.app`). Warm, storybook-feeling landing page: introduces the
author and his forthcoming books, and invites readers to follow along / get in touch.

Design source of truth: [design/Frame 34183.jpg](design/Frame%2034183.jpg) (the full
Figma comp). **Keep it in `design/`, never `src/assets/`** — anything under
`src/assets/` is passthrough-copied and would deploy the 4.3MB comp to production.

## Tech stack

Built on the **CodeStitch Intermediate Website Kit (LESS)**:

- **Eleventy (11ty)** + **Nunjucks**
- **LESS** → compiled to `public/assets/css/` by the build event in `.eleventy.js`
- **esbuild** for JS bundling/minify (globs `src/assets/js/**/*.js` — new files are picked up automatically)
- **Sharp Images** plugin for build-time image optimization (`{% getUrl %}`) — **use it** (see below)
- Decap CMS **removed** (no blog). Demo content **removed**. Dark mode **removed** (see gotchas).

### Commands

- `npm start` — dev server, hot reload (`ELEVENTY_ENV=DEV`)
- `npm run build` — production build, minified (`ELEVENTY_ENV=PROD`)
- `npm run preview` — production build + serve

## Critical conventions

- **Edit `src/`, never `public/`.** `public/` is generated *and gitignored*.
- **Single page:** all content lives in [src/index.html](src/index.html).
- **Where styles go:**
  - [root.less](src/assets/less/root.less) — `:root` tokens, base elements, nav, blobs, texture, utilities.
  - [critical.less](src/assets/less/critical.less) — **above-the-fold hero only** (`#hero-493`).
  - [local.less](src/assets/less/local.less) — below-the-fold sections (About, Books, Contact, publishers, footer).
- **Breakpoints:** `48rem` (768px, tablet) and `64rem` (1024px, desktop). Mobile-first —
  the base `@media (min-width: 0)` block *is* the mobile layout.
- **Fluid type:** `clamp(min, Xvw, max)` with a `/* MINpx - MAXpx */` comment. Root = 16px.
  When raising a max, also raise the `vw` so the max is reachable near the 1280px container
  (`targetPx / 12.8 = vw`).

### Images — always optimize

Use the Sharp shortcode; it emits hashed, resized variants at build time:

```njk
<source type="image/avif" srcset="{% getUrl "/assets/images/x.jpg" | resize({ width: 1000 }) | avif %}">
<source type="image/webp" srcset="{% getUrl "/assets/images/x.jpg" | resize({ width: 1000 }) | webp %}">
<img src="{% getUrl "/assets/images/x.jpg" | resize({ width: 1000 }) | jpeg %}" alt="..." width="1000" height="1245">
```

Rules learned the hard way:
- **Size to how it actually renders** (×2 for retina), not the source dimensions. Originals were 3–6× oversized.
- **Flat-colour logos: PNG only, no AVIF/WebP.** Lossy codecs *inflate* hard-edged graphics
  (`publisher_1`: PNG 17K vs AVIF 33K). `<picture>` picks the first supported source, so adding
  AVIF there makes it worse. Photos → AVIF/WebP; flat logos → PNG.
- **Transparency → PNG fallback**, never JPEG.
- **CSS-referenced images can't use `getUrl`** (it's a template shortcode). `book_texture.webp`
  was hand-optimized (3000px JPEG 299K → 1400px WebP 54K).
- A correct build prints `Sharp Plugin: Saved N cache entries`. **`0` means nothing is being optimized.**

## Design system

Cream background, soft pastel abstract "blobs" drifting behind everything, faint paper
texture. Storybook elegance: display serif + handwritten accent.

### Color tokens ([root.less](src/assets/less/root.less) `:root`)

| Token | Value | Use |
|---|---|---|
| `--primary` | `#F4ECDC` | cream (lives on `html`) |
| `--secondary` | `#EEE4CF` | tinted band (Books section) |
| `--headerColor` | `#3D3327` | dark brown headings |
| `--bodyTextColor` | `#6E604F` | muted brown body |
| `--accentColorDeepRose` | `#C08680` | emphasized italic words, badges |
| `--accentColorRose` / `Green` / `Blue` | `#E0B5B0` / `#B5C5A4` / `#A8C5D6` | blobs, washes |
| `--handWrittenInk` | `#5D7D92` | teal handwritten accents |

### Fonts (self-hosted woff2 in `src/assets/fonts/`)

- **Libre Caslon Text** — `.cs-title` headings + italic sublines. Emphasis = `.title-accent`
  (italic, deep rose, offset underline).
- **Caveat** — handwritten accents: global `.cs-topper`, "keep reading", margin notes, book badges.
- **Quicksand** — the hero topper override + book meta (uppercase, letter-spaced).

## Architecture gotchas (hard-won — read before touching layout)

- **Cream lives on `html`, NOT `body`.** The page-wide paper texture is a fixed
  `body::before` at `z-index: -1`; if `body` also had a background it would paint *over* it.
- **One page-wide texture**, not per-section. Per-section `.cs-background` images caused
  visible seams at section boundaries (each `cover`-fit to its own box). All removed.
- **Blobs** ([base.html](src/_includes/layouts/base.html) `.cs-blobs`): inline SVGs at
  `z-index: -1` inside `#main`, which has `isolation: isolate` so the negative z-index stays
  *inside* main instead of slipping behind the cream.
  - **Size:** widths are in `em`; `.cs-blobs { font-size }` is the master scale
    (1rem desktop / 0.72 tablet / 0.5 phone). One knob scales all 12.
  - **Movement:** keyframe `translate()` is in `em` too, so drift scales with the blobs.
    `rotate`/`scale` are ratios — already size-independent.
  - **Softening:** a single native `filter: blur(0.7em)` on `.cs-blob`. In `em`, so it scales
    with the blobs automatically — one knob, no per-breakpoint swaps.
- **⚠️ Do NOT use `filter: url(#svg-filter)` on the blobs.** We tried an SVG `feMorphology`
  dilate to "spread" the colour and it caused two separate bugs:
  1. **Safari squared them off** — WebKit clips `filter: url()` output to the element's **box**
     and ignores a widened filter region. The blob paths run to ±92 in a 200-unit viewBox
     (~8 units of margin), so the filter's ~22px expansion overflowed and got sliced into a
     rectangle. Chrome grows the paint area; Safari doesn't. (Removing `will-change: transform`
     did *not* help — the animation creates the layer regardless.)
  2. **`feMorphology` dilates with a SQUARE brush at a fixed px radius**, so it flattened convex
     points — proportionally worse on the shrunken mobile blobs.
  Native `blur()` sidesteps both (browsers inflate the paint area correctly for it, and there's
  no square kernel). If you ever need the crisp "spread" back, the only safe route is giving each
  SVG internal margin (`viewBox="-50 -50 300 300"` + ×1.5 widths + position compensation) so the
  filter never overflows its box.
- **Tinting a section without hiding the blobs:** paint the color in a `::before` at
  `z-index: -2` (below the blob layer) — see `#reviews-353`. A plain `background-color`
  would cover them.
- **Hero handwritten notes:** each SVG's CSS `width` = its own `viewBox` width → renders 1:1,
  which makes the `<text>` `font-size` a *literal pixel size* (no ratio math).
- **`<svg>` is a replaced element** — `left`+`right` won't stretch it. Use explicit `width`/`height`.
- **Smooth scroll:** [smooth-scroll.js](src/assets/js/smooth-scroll.js) — eased anchor scrolling.
  The `GAP` constant is the landing-offset knob (currently `-100`).
- **Dark mode was removed** because `dark.js` auto-applied `body.dark-mode` from
  `prefers-color-scheme`, turning the whole site navy (`--dark: #082032`) for anyone on a dark OS.
  Don't reintroduce it — this is a light-only design.
- **LESS media nesting:** nested `@media only screen and (...)` inside the outer
  `@media only screen (...)` compiles to *invalid* `and only screen and`. Omit `only screen`
  on nested queries.

## Page structure (single scroll)

1. **Header** (`#cs-navigation`) — wordmark "Bryan Van Dusen *Author*"; nav anchors → sections.
   **Not sticky** (`position: fixed` is deliberately commented out) — it scrolls away.
   Desktop is `background-color: transparent` so the texture/blobs flow through it and it reads
   as the top of the hero (matches the comp); mobile keeps cream + a drop shadow. Don't add an
   opaque background on desktop — it paints over the texture layer and looks like a dead strip.
2. **Hero** (`#hero-493`, critical.less) — topper "CHILDREN'S AUTHOR" with flanking rules;
   "Stories for *brave* little humans." (hard `<br>`s to lock the 3-line wrap at all widths);
   italic subline; "keep reading" + hand-drawn arrow; two floating Caveat notes (desktop only, ≥64rem).
3. **About** (`#sbs-677`) — oval portrait; "A storyteller raised among *forests, animals,*…"
   with a hand-drawn SVG oval; bio; handwritten margin note.
4. **Books** (`#reviews-353`) — `--secondary` tinted band; two book cards (cover placeholder +
   title/meta/description/note). Cards stack full-width until `64rem`.
5. **Publishers** (`#faq-2490`) — "in good company with" + 3 logos.
6. **Contact** (`#contact-493`) — "Say hello, *or follow along.*"; Instagram button; mailto.
7. **Footer** (`#cs-footer-108`) — wordmark + copyright.

## Status / open questions

- [x] All sections built + responsive (mobile/tablet/desktop)
- [x] Blobs, texture, smooth scroll, favicons (`icon-C-washes`), OG image, image optimization
- [ ] **Book title conflict — needs a decision.** His bio says the books are *Sky's Got Glitter*
      and ***A Wish for a Weed***, but the Books section still says ***The Cardboard Castle***.
- [ ] **Real book cover art** — currently CSS gradient placeholders with a "coming soon!" badge.
- [ ] **Real email** — `client.js` has `vandusenbryan@gmail.com`; the page shows
      `hello@bryanvandusen.com`. Neither confirmed.
- [ ] **Domain** — `client.domain` drives canonical/og:url/sitemap. Update when DNS is pointed.
- [ ] **Designed OG image** — current one is just the mark on cream; a Figma export with the
      wordmark would share far better. Drop in at `src/assets/images/og-image.jpg`.
- [ ] Consider using his full bio ("advocate for inclusion", "Washington, London, Los Angeles")
      in the About section.

## Deployment / git

- Netlify (`netlify.toml`: publish `public/`, `npm run build`, image cache plugin). `public/` is gitignored,
  so Netlify builds fresh — stale local artifacts never ship.
- Repo owned by the **`bmoesintelligence`** GitHub account (separate from `btothemoe`). Pushes must
  authenticate as `bmoesintelligence` — sign that account into VS Code's Accounts panel. `gh` CLI not installed.
