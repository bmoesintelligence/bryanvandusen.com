# Bryan Van Dusen — Children's Author Website

## Project overview

A **single-page** marketing site for **Bryan Van Dusen**, a children's picture-book
author. Domain: `bryanvandusen.com`. The site is intentionally simple: a warm,
storybook-feeling landing page that introduces the author and two forthcoming books,
and invites readers to follow along / get in touch.

Design source of truth: [src/assets/images/designs/Frame 34183.jpg](src/assets/images/designs/Frame%2034183.jpg)
(the full Figma comp). Build to match it.

## Tech stack

Built on the **CodeStitch Intermediate Website Kit (LESS)**:

- **Eleventy (11ty)** static site generator + **Nunjucks** templating
- **LESS** preprocessor (compiled → `public/assets/css/` by the build event in `.eleventy.js`)
- **esbuild** for JS bundling/minify
- **Sharp Images** plugin for build-time image optimization (`{% getUrl %}` shortcode)
- Decap CMS has been **removed** (no blog — this is a static brochure site)
- Demo content stripped to `scripts/deleted/`

### Commands

- `npm start` — dev server with hot reload (`ELEVENTY_ENV=DEV`)
- `npm run build` — production build, minified (`ELEVENTY_ENV=PROD`)
- `npm run preview` — production build + serve locally
- `npm run create-page -- "Name"` — scaffold a new page (not needed unless we go multi-page)

## Critical conventions

- **Edit `src/`, never `public/`.** `public/` is generated output and gets overwritten.
- **Single page:** all content lives in [src/index.html](src/index.html). No `content/pages/` work needed.
- **Where styles go:**
  - [src/assets/less/root.less](src/assets/less/root.less) — global tokens (`:root`), base elements,
    nav, footer, utilities. Site-wide stuff.
  - [src/assets/less/critical.less](src/assets/less/critical.less) — **above-the-fold** hero styles;
    loaded first/inline-critical for fast paint. The hero (`#hero-493`) lives here.
  - [src/assets/less/local.less](src/assets/less/local.less) — below-the-fold sections (About, Books,
    Contact), deferred. Put new section styles here.
- **CodeStitch stitch pattern:** sections come from the CodeStitch library and use `cs-`
  prefixed classes (`.cs-container`, `.cs-title`, `.cs-topper`, `.cs-text`, `.cs-button-solid`).
  When replacing a stitch, clear the default `.cs-button-solid/outline` styles as needed.
- **Fluid type pattern:** font sizes use `clamp(min, Xvw, max)` with a `/* MINpx - MAXpx */`
  comment above. Root is 16px (so 1rem = 16px). When changing a max, also bump the `vw`
  so the new max is actually reachable near the 1280px container width (e.g. `targetPx / 12.8 = vw`).
- **Images:** optimize via `{% getUrl %}` (Sharp plugin) → emits `<picture>` with AVIF/WebP/JPEG.
  Source images go in `src/assets/images/`, SVGs in `src/assets/svgs/`.

## Design system

Warm cream background with soft, blurred pastel "blobs" (sage / dusty pink / soft blue)
floating behind the content. Storybook elegance: a high-contrast display serif paired with
a casual handwritten accent.

### Color tokens (defined in [root.less](src/assets/less/root.less) `:root`)

| Token | Value | Use |
|---|---|---|
| `--primary` | `#F4ECDC` | cream background / button fill |
| `--primaryLight` | `#FAF4E5` | lighter cream |
| `--secondary` | `#EEE4CF` | alt section bg |
| `--headerColor` | `#3D3327` | dark brown ink for headings |
| `--bodyTextColor` | `#6E604F` | muted brown body text |
| `--accentColorDeepRose` | `#C08680` | emphasized italic words + underline accent |
| `--accentColorRose` | `#E0B5B0` | decorative pink blob / soft accents |
| `--accentColorGreen` | `#B5C5A4` | decorative sage blob |
| `--accentColorBlue` | `#A8C5D6` | decorative blue blob |
| `--handWrittenInk` | `#5D7D92` | teal handwritten accents (Caveat) |

### Fonts

- **Libre Caslon Text** (serif) — headings (`.cs-title`) and the italic sublines (`.cs-text`).
  Emphasis words are `<em>`/`.title-accent`: italic, `--accentColorDeepRose`, with a thin
  offset underline.
- **Quicksand** — toppers/eyebrows (`.cs-topper`): uppercase, letter-spaced, with flanking
  dot/line accents.
- **Caveat** (handwritten) — accent labels like "hello, hello!", "keep reading", margin notes,
  the contact button, and "& their grown-ups". Often in `--handWrittenInk` (teal) or rose.

## Page structure (single scroll)

1. **Header / nav** — left wordmark "Bryan Van Dusen · author"; right nav: About / Books / Contact
   (anchor links to sections). `position: fixed` (see root.less `#cs-navigation`).
2. **Hero** (`#hero-493`, styled in critical.less) — topper "CHILDREN'S AUTHOR";
   title "Stories for *brave* little humans."; italic subline; "keep reading ↓" handwritten link.
   *(Built / in progress.)*
3. **About the author** — oval portrait (left); "A storyteller raised among *forests, animals,*
   and a great deal of imagination."; bio paragraphs; handwritten margin note
   "a book, he hopes, can be a small, kind place to land".
4. **My books** — "Two stories on the way, *both arriving soon.*"; subline "both for ages 4 to 8";
   two cards:
   - **Sky's Got Glitter** — Ages 4–8, October 2027 — heartfelt picture book about a child learning
     to embrace self-expression. Note: "a book about being seen, and being shiny".
   - **The Cardboard Castle** — Ages 4–8, date TBA — imaginative picture book about a child turning
     cardboard into extraordinary adventures. Note: "imagination, but made it portable".
5. **Contact** — "Say hello. *or follow along.*"; blurb (news/studio glimpses; aimed at teachers,
   librarians, parents); "FOLLOW ON INSTAGRAM" button; "or write to hello@bryanvandusen.com".
6. **Footer** — wordmark + "© 2026 · All Rights Reserved".

## Status / TODO

- [x] Hero section (`#hero-493`) built in critical.less, matching the comp
- [ ] Header/nav wordmark + anchor links styled to comp
- [ ] About the author section (portrait, bio, margin note)
- [ ] My Books section (two cards)
- [ ] Contact section (Instagram button + email)
- [ ] Footer
- [ ] Decorative pastel blob background layer
- [ ] Real assets: author portrait + two book covers (currently placeholders, like the comp's gray boxes)
- [ ] Replace placeholder data in [src/_data/client.js](src/_data/client.js) (still "Code Stitch Web Designs")

## Open content questions

- Final book cover art + author portrait — not yet supplied; scaffold with placeholders.
- Instagram URL and confirmed contact email (`hello@bryanvandusen.com` per comp).

## Deployment / git notes

- Hosting target: Netlify (kit ships with `netlify.toml`).
- Repo is owned by the **`bmoesintelligence`** GitHub account (a separate personal account from
  `btothemoe`). Pushes must authenticate as `bmoesintelligence` — sign that account into VS Code's
  Accounts panel so its Git provider uses the right identity. `gh` CLI is not installed.
