<br/>
<p align="center">
  <h3 align="center">Bryan Van Dusen — Children's Author</h3>

  <p align="center">
    A single-page marketing site for children's picture-book author Bryan Van Dusen.
    Warm, storybook-feeling landing page: introduces the author and his forthcoming
    books, and invites readers to follow along and get in touch.
    <br/>
    <br/>
    <a href="https://bryanvandusen.netlify.app/">Live (staging)</a>
    ·
    <a href="https://www.bryanvandusen.com/">Live (production — pending DNS)</a>
  </p>
</p>

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Commands](#commands)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
  - [Edit `src/`, never `public/`](#edit-src-never-public)
  - [Where styles live](#where-styles-live)
  - [Images — always optimize](#images--always-optimize)
  - [`client.js` — single source of truth](#clientjs--single-source-of-truth)
  - [Layout, sitemap & robots](#layout-sitemap--robots)
- [Design System](#design-system)
- [Deployment](#deployment)
- [Pre-launch Status](#pre-launch-status)
- [Deeper Reference](#deeper-reference)
- [Credits](#credits)

<a name="overview"></a>

## Overview

This is a **single page** — all content lives in [`src/index.html`](src/index.html). It's a
warm, editorial landing page with a display serif + handwritten accent, a cream background,
soft pastel "blobs" drifting behind the content, and a faint paper texture.

The site is built on **CodeStitch's Intermediate Website Kit (LESS)**, but stripped down to
just what this project needs. The kit's Decap CMS, blog, dark mode, demo content, and
multi-page scaffolding have all been **removed** — this is a light-only, single-page site.
What remains is a lean Eleventy build with build-time image optimization, LESS compilation,
JS bundling, and automatic sitemap/robots generation.

<a name="tech-stack"></a>

## Tech Stack

- **[Eleventy (11ty)](https://www.11ty.dev/)** + **[Nunjucks](https://mozilla.github.io/nunjucks/)** templating
- **LESS** → compiled to `public/assets/css/` by a build event in [`.eleventy.js`](.eleventy.js)
  (PostCSS pipeline: autoprefixer + cssnano in production)
- **[esbuild](https://esbuild.github.io/)** for JS bundling/minification (globs `src/assets/js/**/*.js`)
- **[Sharp Images plugin](https://github.com/CodeStitchOfficial/eleventy-plugin-sharp-images)**
  for build-time image optimization via the `{% getUrl %}` shortcode
- **[Eleventy Sitemap](https://github.com/quasibit/eleventy-plugin-sitemap)** + HTML/CSS minification (production only)
- Deployed on **[Netlify](https://www.netlify.com/)**

<a name="commands"></a>

## Commands

| Command | What it does |
|---|---|
| `npm start` | Dev server with hot reload (`ELEVENTY_ENV=DEV`) |
| `npm run build` | Production build, minified (`ELEVENTY_ENV=PROD`) |
| `npm run preview` | Production build + serve locally |

A correct production build prints `Sharp Plugin: Saved N cache entries`. If it prints `0`,
nothing is being optimized — check your `{% getUrl %}` references.

<a name="project-structure"></a>

## Project Structure

```
.
├── design/                     # Figma comp (source of truth) — NOT deployed
├── src/
│   ├── _data/
│   │   └── client.js           # Global data: name, email, socials, domain
│   ├── _includes/
│   │   ├── components/
│   │   │   └── home-schema.html # JSON-LD (Person + WebSite)
│   │   ├── layouts/
│   │   │   └── base.html        # <head>, nav, blobs, footer — the page shell
│   │   └── sections/
│   │       ├── header.html      # Wordmark + nav
│   │       └── footer.html
│   ├── assets/
│   │   ├── favicons/            # icon-C-washes.* + webmanifest
│   │   ├── fonts/               # Self-hosted woff2 (Libre Caslon, Caveat, Quicksand)
│   │   ├── images/              # Source images (optimized at build via getUrl)
│   │   ├── js/                  # nav.js, smooth-scroll.js
│   │   └── less/                # root.less, critical.less, local.less
│   ├── config/                 # Eleventy filters / plugins / processors
│   ├── content/                # content.json (sitemap tag) + page template
│   ├── _redirects
│   ├── index.html              # THE PAGE — all site content
│   ├── robots.html             # → /robots.txt
│   └── sitemap.html            # → /sitemap.xml
├── .eleventy.js                # Eleventy config + LESS/JS build events
├── netlify.toml                # Netlify build + image cache plugin
└── package.json
```

<a name="how-it-works"></a>

## How It Works

<a name="edit-src-never-public"></a>

### Edit `src/`, never `public/`

`public/` is **generated and gitignored**. Netlify builds it fresh on every deploy, so stale
local artifacts never ship. Any change you make in `public/` is overwritten on the next build.

<a name="where-styles-live"></a>

### Where styles live

- [`root.less`](src/assets/less/root.less) — `:root` design tokens, base elements, nav, blobs, texture, utilities.
- [`critical.less`](src/assets/less/critical.less) — **above-the-fold hero only** (`#hero-493`), loaded first.
- [`local.less`](src/assets/less/local.less) — below-the-fold sections (About, Books, Contact, publishers, footer), deferred in production.

Breakpoints are `48rem` (768px, tablet) and `64rem` (1024px, desktop). **Mobile-first** — the
base `@media (min-width: 0)` block *is* the mobile layout. Fluid type uses
`clamp(min, Xvw, max)` with a `/* MINpx - MAXpx */` comment; root font size is 16px.

<a name="images--always-optimize"></a>

### Images — always optimize

Use the Sharp shortcode; it emits hashed, resized AVIF/WebP/JPEG variants at build time:

```njk
<source type="image/avif" srcset="{% getUrl "/assets/images/x.jpg" | resize({ width: 400 }) | avif %}">
<source type="image/webp" srcset="{% getUrl "/assets/images/x.jpg" | resize({ width: 400 }) | webp %}">
<img src="{% getUrl "/assets/images/x.jpg" | resize({ width: 400 }) | jpeg %}" alt="..." width="400" height="400">
```

Rules of thumb: size to how the image actually renders (×2 for retina), not the source
dimensions. **Flat-colour logos → PNG only** (lossy codecs *inflate* hard-edged graphics);
**photos/illustrations → AVIF/WebP** with a fallback. CSS-referenced images can't use `getUrl`
(it's a template shortcode) — hand-optimize those.

<a name="clientjs--single-source-of-truth"></a>

### `client.js` — single source of truth

[`src/_data/client.js`](src/_data/client.js) holds the author's name, email, socials, and
domain. It's global data: templates read `{{ client.email }}`, `{{ client.domain }}`, etc. The
contact `mailto`, the JSON-LD schema, the canonical/OG tags, and the sitemap URL all derive
from this one file. Change the email or domain here and it updates everywhere.

<a name="layout-sitemap--robots"></a>

### Layout, sitemap & robots

`index.html` extends [`_includes/layouts/base.html`](src/_includes/layouts/base.html), which
supplies the `<head>` (meta/OG/favicons/preloads from `client.js` + page front matter), the
nav, the decorative blob layer, and the footer.

`robots.html` and `sitemap.html` are HTML templates with a `permalink` that outputs
`/robots.txt` and `/sitemap.xml` — both pull the live domain from `client.js`, so they stay
correct automatically. The sitemap includes every page tagged `sitemap` (via
`content/content.json`); `index.html` opts in through its own front matter.

<a name="design-system"></a>

## Design System

Cream background, soft pastel abstract blobs, faint paper texture. Storybook elegance: display
serif + handwritten accent. Full token table and hard-won layout gotchas live in
[`CLAUDE.md`](CLAUDE.md) — the short version:

**Colors** (`:root` in `root.less`): `--primary` `#F4ECDC` cream · `--secondary` `#EEE4CF`
tinted band · `--headerColor` `#3D3327` brown headings · `--bodyTextColor` `#6E604F` body ·
`--accentColorDeepRose` `#C08680` emphasis · rose/green/blue washes for the blobs ·
`--handWrittenInk` `#5D7D92` teal.

**Fonts** (self-hosted woff2): **Libre Caslon Text** (headings + italic sublines) · **Caveat**
(handwritten accents, hero notes, book badges) · **Quicksand** (toppers, book meta, nav links,
footer). `--bodyFont`/`--headerFont` both fall back to Libre Caslon — set a family deliberately
on any new element.

<a name="deployment"></a>

## Deployment

Hosted on **Netlify**. [`netlify.toml`](netlify.toml) sets the publish directory to `public/`,
the build command to `npm run build`, and adds an image-cache plugin so processed images are
reused between builds. `public/` is gitignored, so Netlify always builds fresh.

> **Repo ownership:** this repository is owned by the **`bmoesintelligence`** GitHub account
> (separate from `btothemoe`). Pushes must authenticate as `bmoesintelligence` — sign that
> account into VS Code's Accounts panel.

**To point the custom domain:** the site currently serves at `bryanvandusen.netlify.app`.
Once `bryanvandusen.com` DNS is pointed at Netlify, update nothing in code — `client.domain`
is already set to `https://www.bryanvandusen.com` (drives canonical, OG, and sitemap URLs).

<a name="pre-launch-status"></a>

## Pre-launch Status

The living launch checklist (what's done, what's blocking) lives in [`CLAUDE.md`](CLAUDE.md).
Highlights still open:

- 🔴 **`hello@bryanvandusen.com` mailbox** must exist before launch — the address is printed on
  the page and in the schema, so contact mail bounces silently until a mailbox or forwarder is set up.
- 🔴 **DNS** not yet pointed at Netlify.
- 🟡 On-domain checks (Lighthouse, PageSpeed, BrowserStack, Search Console) run once the real
  domain is live.
- 🟡 Book publication dates (Cardboard Castle is "Date TBA") — book entries stay out of the
  schema until firm.
- ⚪ Analytics deliberately skipped for launch.

Already verified: HTML validates clean (0 errors/warnings), internal link check clean,
Person + WebSite schema, images optimized, favicons + sitemap + robots in place.

<a name="deeper-reference"></a>

## Deeper Reference

[`CLAUDE.md`](CLAUDE.md) is the deep source of truth: the full design-token table, the
page-structure breakdown, and the **architecture gotchas** (why cream lives on `html` not
`body`, how the blobs are sized/animated in `em`, why `filter: url()` broke Safari, the
one-page-texture rule, why dark mode was removed, etc.). Read it before touching layout.

<a name="credits"></a>

## Credits

Built on the [CodeStitch Intermediate Website Kit (LESS)](https://github.com/CodeStitchOfficial/Intermediate-Website-Kit-LESS).
See [`LICENSE.md`](LICENSE.md) for the kit's original license.
