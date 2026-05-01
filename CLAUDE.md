# CLAUDE.md — Ejby IF Badminton Website

Static presentation site for Ejby IF Badminton built with Jekyll and hosted on GitHub Pages. All source content lives in this repo; `_site/` is generated output — never edit it directly.

## Project overview

- **Stack:** Jekyll (via `github-pages` gem), Bootstrap 5.3, SCSS, vanilla JS
- **Language:** Danish (`lang: da`). All page copy and UI text should be in Danish.
- **Hosting:** GitHub Pages (CNAME: `ejbyif-badminton.dk`). Cache-Control headers are managed by GitHub Pages and cannot be changed from this repo — performance work should focus on reducing bytes and using versioned assets.
- **Plugin constraint:** Only gems bundled with `github-pages` are available. Do not add arbitrary Jekyll plugins.

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

## Content/data wiring

- **Navigation** — driven by `indhold/data/menuer.yml`, rendered via `_includes/main-menu.html` (desktop) and `_includes/main-menu-mobile.html`.
- **Tilbud (offers)** — dual-sourced:
  - `indhold/data/tilbud.yml` — ordering, labels, pricing, contact metadata.
  - `indhold/sider/_tilbud/*.md` — detailed page content (rendered at `/tilbud/<slug>/`).
  - The `slug` field must match between the two. Menu template does `site.tilbud | where: "slug", offer.slug | first`.
- **Home page** — uses the `tilbud` collection directly (`_layouts/home.html`); `_config.yml` sets `home.limit_services`.
- **Board** — `indhold/data/bestyrelse.yml` auto-renders into `indhold/sider/bestyrelsen.md`.
- **SEO/contact** — `indhold/data/seo.yml`, `indhold/data/kontakt.yml`, `indhold/data/sociale_medier.json`.

## Local development

```bash
bundle install
bundle exec jekyll serve --livereload   # http://localhost:4000
```

Production build (runs in CI):
```bash
bundle exec jekyll build                # outputs to _site/
npx purgecss --config purgecss.config.cjs   # remove unused CSS
npx clean-css-cli -o _site/assets/css/style.css _site/assets/css/style.css
```

## CI/CD

- **CI** (`.github/workflows/ci.yml`) — runs on every push/PR to `main`: builds the site and runs `npx broken-link-checker` recursively. When changing URLs or permalinks, update all links accordingly.
- **Deploy** (`.github/workflows/pages.yml`) — runs on push to `main`: builds, purges CSS, minifies, deploys to GitHub Pages.
- **Dependabot** — opens weekly PRs for Bundler gems and GitHub Actions. Review and merge to stay patched.

## Commit and deploy conventions

- Changes pushed to `main` automatically trigger CI and deploy to production.
- Prefer small, focused commits.
- Always ensure `bundle exec jekyll build` passes before pushing.
- Never commit anything under `_site/` or generated artifacts.

## Styling conventions

- Keep changes within existing SCSS tokens/variables (`_sass/_bootstrap-variables.scss`).
- Avoid introducing new design primitives unless there is already a pattern in the repo for it.
- PurgeCSS safelist is in `purgecss.config.cjs` — add dynamic/JS-toggled class patterns there if needed.

## Don'ts

- Don't edit `_site/` or commit generated artifacts.
- Don't add Jekyll plugins not included in the `github-pages` gem bundle.
- Don't touch `_config.yml` `sass.style` — it is set to `compressed` for production.
