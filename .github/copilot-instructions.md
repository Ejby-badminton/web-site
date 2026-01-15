# Copilot instructions (ejby-badminton/web-site)

## Project overview
- This repo is a Jekyll static site (Ruby/Bundler) with source content under [indhold/](../indhold/) and generated output under [_site/](../_site/). Do not edit generated files in `_site/`.
- Content language is Danish (`lang: da`). Prefer Danish copy in pages and UI text.
- Hosting is GitHub Pages. Response headers (e.g. `Cache-Control` TTL) are controlled by GitHub Pages and cannot be changed from this repo; performance work should focus on reducing bytes and using versioned assets (or use an external CDN like Cloudflare if long-lived caching is required).

## Key structure (source of truth)
- Pages: [indhold/sider/](../indhold/sider/) (Markdown with front matter). URLs are usually pinned via `permalink` (see [indhold/sider/om-klubben.md](../indhold/sider/om-klubben.md)).
- Data: [indhold/data/](../indhold/data/) (YAML/JSON). Navigation and “dynamic” sections are driven from here.
- “Tilbud” (offers) collection: [indhold/sider/_tilbud/](../indhold/sider/_tilbud/) (one Markdown file per offer).
- Layouts and includes: [_layouts/](../_layouts/) and [_includes/](../_includes/) (Liquid templates).

## Content/data wiring conventions (important)
- The main menu is driven by [indhold/data/menuer.yml](../indhold/data/menuer.yml) and rendered via [_includes/main-menu.html](../_includes/main-menu.html).
- The “Tilbud” dropdown is data-driven:
  - Ordering/labels come from [indhold/data/tilbud.yml](../indhold/data/tilbud.yml).
  - Each entry’s `slug` must match a corresponding collection item in [indhold/sider/_tilbud/](../indhold/sider/_tilbud/) (front matter `slug: ...`). The menu template does `site.tilbud | where: "slug", offer.slug | first`.
- Home page uses the `tilbud` collection directly (see [_layouts/home.html](../_layouts/home.html)); [_config.yml](../_config.yml) sets `home.limit_services`.

## Styling conventions
- Primary SCSS entrypoint is [assets/css/style.scss](../assets/css/style.scss) (has Jekyll front matter so Jekyll compiles it).
- SCSS partials live in [_sass/](../_sass/); Bootstrap 5.3.2 is imported selectively and customized via [_sass/_bootstrap-variables.scss](../_sass/_bootstrap-variables.scss).
- Keep changes in existing tokens/variables; avoid introducing new design primitives unless the repo already has a pattern for it.

## Build/CI workflow (match existing automation)
- Local dev: `bundle install` then `bundle exec jekyll serve --livereload` (see [README.md](../README.md)).
- Production build: `bundle exec jekyll build` (outputs to `_site/`).
- CI (see [workflows/ci.yml](workflows/ci.yml)):
  - Ruby 3.1 + Bundler; runs `bundle exec jekyll build`.
  - Starts `jekyll serve` and runs `npx broken-link-checker ...` (Node 20). When changing URLs/permalinks, update links accordingly.

## Deploy workflow (important)
- PROD is the only remote environment and is where changes are validated.
- Unless the user explicitly says otherwise, agents should **commit and push** changes to trigger CD/deploy to PROD.
- Prefer small, focused commits; keep the site building (`bundle exec jekyll build`) and avoid breaking links (CI runs a link checker).

## Repo-specific “don’ts”
- Don’t edit `_site/` or check in generated artifacts.
- Don’t add arbitrary Jekyll plugins: this repo uses `github-pages` (see [Gemfile](../Gemfile)), so plugin availability is constrained.
