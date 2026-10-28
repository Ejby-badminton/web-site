# CLAUDE.md — Ejby IF Badminton Website

Static presentation site for Ejby IF Badminton built with Jekyll and hosted on GitHub Pages. All source content lives in this repo; `_site/` is generated output — never edit it directly.

## Project overview

- **Stack:** Jekyll (via `github-pages` gem), Bootstrap 5.3, SCSS, vanilla JS
- **Language:** Danish (`lang: da`). All page copy and UI text should be in Danish. Comments in content and data files are Danish too; this file and the scripts are English.
- **Hosting:** GitHub Pages (CNAME: `ejbyif-badminton.dk`). Cache-Control headers are managed by GitHub Pages and cannot be changed from this repo — performance work should focus on reducing bytes and using versioned assets.
- **Plugin constraint:** Only gems bundled with `github-pages` are available. Do not add arbitrary Jekyll plugins. `jekyll-sitemap` is the only one enabled.

## Key structure

| Path | Purpose |
|---|---|
| `indhold/sider/*.md` | Pages (Markdown + front matter). Filename → URL unless `permalink` overrides. |
| `indhold/sider/_tilbud/` | Jekyll collection — one Markdown file per offer (`slug` in front matter must match `tilbud.yml`). |
| `indhold/data/` | YAML/JSON driving navigation and dynamic sections (see wiring below). |
| `_layouts/` | Liquid page templates (`default`, `home`, `page`, `service`, `contact`, `services`). |
| `_includes/` | Reusable snippets (header, footer, menus, CTA, structured data). |
| `_sass/` | SCSS partials. Bootstrap 5 is imported selectively and customized via `_sass/_bootstrap-variables.scss`. |
| `assets/css/style.scss` | Primary SCSS entrypoint (Jekyll front matter triggers compilation). |
| `assets/js/scripts.js` | Minimal vanilla JS (hamburger toggle, etc.). |
| `images/` | Logos, favicons, sponsor images. |
| `scripts/` | Local build, serve, SEO check and link check. See **Local development**. |
| `llms.txt`, `robots.txt` | Generated from `indhold/data/` — see **SEO and AI discoverability**. |

## Content/data wiring

**Data files are the source of truth. Never hardcode club facts in a page or template.** Address, phone, email, opening hours and prices live in `indhold/data/` and are read from there by the page HTML, the JSON-LD structured data *and* `llms.txt`. Writing a phone number or price directly into a page means HTML and markup eventually disagree, and contradictory club details hurt ranking in both Google and AI answers.

| File | Holds | Read by |
|---|---|---|
| `kontakt.yml` | Name, address, phone, email, coordinates, opening hours, areas served, CVR | `call.html`, `structured-data.html`, `llms.txt`, `kontakt.md`, `tilbud.md` |
| `tilbud.yml` | Offers: title, season, times, pricing, contacts | Home page, menus, `tilbud.md`, JSON-LD, `llms.txt` |
| `faq.yml` | Questions and answers | `/kontakt/` **and** `FAQPage` markup |
| `bestyrelse.yml` | Board members | `/bestyrelsen/`, `llms.txt` |
| `menuer.yml` | Navigation and footer | Both menu includes, footer |
| `seo.yml` | Analytics and verification IDs | `google-analytics.html`, `<head>` |
| `sociale_medier.json` | Footer social icons | `social.html` |

Two couplings must not break:

- **Tilbud (offers) are dual-sourced.** Every `slug` in `tilbud.yml` must match the `slug` in a file under `indhold/sider/_tilbud/`. Templates look it up with `site.tilbud | where: "slug", offer.slug | first`. Without a match the offer disappears silently from the menu and home page.
- **`price_min` / `price_max`** in `tilbud.yml` are machine-readable DKK prices used only for JSON-LD `Offer`. They must agree with the human-readable `pricing` text.
- **Home page** uses the `tilbud` collection directly (`_layouts/home.html`); `_config.yml` sets `home.limit_services`.
- **Board** — `bestyrelse.yml` auto-renders into `indhold/sider/bestyrelsen.md`.

## Local development

No Ruby install needed — the scripts run Jekyll in Docker on the same Ruby version as CI:

```bash
./scripts/test.sh            # build + SEO check. ALWAYS run before committing.
./scripts/test.sh --links    # same, plus link check (needs network)
./scripts/serve.sh           # live reload on http://127.0.0.1:4000
./scripts/build.sh           # build only → _site/
node scripts/check-seo.mjs   # SEO check only (needs an existing build)
./scripts/check-links.sh     # link check only (needs an existing build)
```

The first run pulls `ruby:3.2` and caches gems in a Docker volume (`ejby-badminton-gems`); after that a build takes about 8 seconds.

`scripts/check-seo.mjs` is a regression net for the failures you **cannot** see in a browser: missing or duplicate `<title>`, missing or duplicate meta descriptions, invalid JSON-LD, unresolvable `@id` references, unrendered Liquid in the output, images without `alt`, gaps in breadcrumb positions, and errors in `robots.txt`, `llms.txt` and `sitemap.xml`. It also runs in CI. **Fix the errors — do not suppress them.** Warnings are advisory.

Ruby is pinned to **3.2** in `ci.yml`, `pages.yml` and `scripts/_docker.sh` (nokogiri requires it). Change one, change all three.

### CSS is purged on production builds

`scripts/optimize-css.sh` runs PurgeCSS and clean-css, and is called both by `scripts/build.sh` (only when `JEKYLL_ENV=production`, which `scripts/test.sh` sets) and by the deploy workflow — so what you test locally is what ships. It takes the stylesheet from ~156 KB to ~53 KB.

**If you add a class that only JavaScript applies, add it to `safelist.standard` in `purgecss.config.cjs`** — PurgeCSS scans the rendered HTML and cannot see it. `lock-scroll`, `is-active` and `is-closed` are there for this reason; `lock-scroll` was missing and would have silently broken the mobile menu's scroll lock the moment purging started working.

The script fails the build if the CSS did not shrink (the purge step silently did nothing for months before October 2026) or if a known-needed selector disappeared. Extend `REQUIRED_SELECTORS` when you add a component that depends on a JS-applied class.

Without Docker you can still use `bundle install` and `bundle exec jekyll serve --livereload`. Production build:

```bash
JEKYLL_ENV=production bundle exec jekyll build
npx purgecss --config purgecss.config.cjs
npx clean-css-cli -o _site/assets/css/style.css _site/assets/css/style.css
```

## SEO and AI discoverability

The goal is that the club gets found — both in Google and when someone asks an AI assistant "where can I play badminton near Køge?".

**Every new page needs** in its front matter:

```yaml
title: Short page name          # becomes the <h1>
meta_title: "..."               # optional; full <title>, else "title | Ejby Badminton"
description: >-                 # unique, 120-155 chars, name the place and concrete facts
  ...
permalink: "/my-page/"
```

- **One `<h1>` per page.** The `page.html` and `service.html` layouts already output `page.title` as the `<h1>`, so do **not** start the content with `#` in those layouts.
- **`description` must be unique** and 120-155 characters. The check catches duplicates and lengths.
- Write **self-contained** paragraphs and answers. An AI assistant quotes a paragraph without its surrounding text, so write "i Ejbyhallen" rather than "hos os".
- Name concrete numbers, days, prices and places (Lille Skensved, Køge, Ejby). Vague copy like "contact us for prices" cannot be quoted.
- Set `noindex: true` and `sitemap: false` on pages that should stay out of search results.
- Set `show_faq: true` to render the FAQ from `faq.yml` **and** emit `FAQPage` markup. Visible text and markup must stay identical — Google penalises markup describing content the user cannot see.

**Generated output — edit the data, never the output:**

- `llms.txt` → `/llms.txt`. Machine-readable summary for AI assistants following the llmstxt.org convention. Built entirely from `indhold/data/`.
- `robots.txt` → generated with a Liquid loop. **A named crawler does not inherit rules from `User-agent: *`**, so every group must repeat its own `Disallow` lines. The loop guarantees that; add new crawlers to the `agent_list` capture, not as a loose block.
- `_includes/structured-data.html` → one JSON-LD `@graph` per page with `SportsClub`, `Place`/`SportsActivityLocation`, `WebSite`, `WebPage` and `BreadcrumbList`, plus `FAQPage` and `Service` where relevant. Nodes are linked by `@id`; if you add a node, make sure every `@id` reference resolves to a node in the same graph or Google ignores it.
- Excluded paths must stay in sync in three places: `robots.txt` (`disallow`), `_config.yml` (`sitemap: false` for `assets/docs`) and `check-seo.mjs`. The general-assembly PDFs are excluded because they contain members' names.

## Analytics — how the club sees its traffic

Both tools are free and stay **off** until the IDs are filled into `indhold/data/seo.yml`, which contains step-by-step instructions:

- `google_analytics_id` (`G-XXXXXXXXXX`) → Google Analytics 4: how many visits and which pages get read. Only loaded when `JEKYLL_ENV=production`, so local development does not pollute the statistics.
- `google_site_verification` → Google Search Console: what people **searched for** before finding the site, plus impressions and clicks. The most useful tool for judging whether SEO work pays off. Submit `/sitemap.xml` there.
- `bing_site_verification` → Bing Webmaster Tools. Bing also feeds ChatGPT search.

## Yearly: new season

1. Update `season`, `times`, `pricing`, `price_min`, `price_max`, `signup` and `contacts` in `indhold/data/tilbud.yml`.
2. Update the same figures in the body copy under `indhold/sider/_tilbud/`.
3. Update prices and dates in the answers in `indhold/data/faq.yml`.
4. Update season figures in `description` / `meta_title` on the affected pages.
5. Run `./scripts/test.sh`. `llms.txt`, the JSON-LD and `/tilbud/` update themselves.

Wrong prices are worse than no prices: AI assistants quote them as fact long after they change.

## CI/CD

- **CI** (`.github/workflows/ci.yml`) — on every push/PR to `main`: build, then `node scripts/check-seo.mjs`, then `npx broken-link-checker` recursively. When changing URLs or permalinks, update all links accordingly.
- The link checker excludes `https://ejbyif-badminton.dk`, because every page's canonical points at production. Without that exclusion **any new page** fails CI until it is deployed.
- **Deploy** (`.github/workflows/pages.yml`) — on push to `main`: builds, purges CSS, minifies, deploys to GitHub Pages.
- **Dependabot** — opens weekly PRs for Bundler gems and GitHub Actions. Review and merge to stay patched.

## Commit and deploy conventions

- Changes pushed to `main` automatically trigger CI and deploy to production.
- Prefer small, focused commits.
- Always run `./scripts/test.sh` before pushing.
- Never commit anything under `_site/` or generated artifacts.

## Styling conventions

- Keep changes within existing SCSS tokens/variables (`_sass/_bootstrap-variables.scss`).
- Avoid introducing new design primitives unless there is already a pattern in the repo for it.
- PurgeCSS safelist is in `purgecss.config.cjs` — add dynamic/JS-toggled class patterns there if needed, or they get stripped from the production build.

## Don'ts

- Don't edit `_site/` or commit generated artifacts.
- Don't add Jekyll plugins not included in the `github-pages` gem bundle.
- Don't hardcode address, phone, email or prices in pages or templates — use `indhold/data/`.
- Don't hand-edit `llms.txt` or `robots.txt` as if they were static files; they are Liquid templates.
- Don't add a JS-toggled class without safelisting it in `purgecss.config.cjs`.
- Don't touch `_config.yml` `sass.style` — it is set to `compressed` for production.
