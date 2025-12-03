# Ejby IF Badminton Website

Static marketing site for Ejby IF Badminton built with [Jekyll](https://jekyllrb.com/) and deployed via Netlify/GitHub Pages. The repo contains all content, data, layouts, and styling needed to run the site locally or keep production up to date.

## Prerequisites

- Ruby 3.x (the version used in `.ruby-version` if present, or the one that ships with your OS)
- [Bundler](https://bundler.io/) `gem install bundler`
- Optional: [nvm](https://github.com/nvm-sh/nvm) or Node.js if you add tooling for CSS/JS in the future

## Getting Started

```bash
# Clone
 git clone git@github.com:Ejby-badminton/web-site.git
 cd web-site

# Install gems
 bundle install

# Run locally with live reload
 bundle exec jekyll serve --livereload
```

Open `http://localhost:4000` to preview changes. Stop the server with `Ctrl+C`.

To run a production build (used by Netlify), execute `bundle exec jekyll build`. This writes the compiled site to `_site/`.

## Repository Layout

| Path | Purpose |
| ---- | ------- |
| `index.md`, `about.md`, `contact.md`, `bestyrelse.md` | Top-level pages written in Markdown. Front matter controls layout, titles, and SEO. |
| `_tilbud/` | Jekyll collection containing one Markdown file per tilbud (offer). Use the same `slug` as referenced in `_data/offers.yml`. |
| `_data/` | Structured YAML/JSON data powering navigation and dynamic sections.<br>• `offers.yml` controls the order, labels, and highlights used on the home page.<br>• `board.yml` lists bestyrelsesmedlemmer shown on `bestyrelse.md`.<br>• `menus.yml` drives the global navigation and footer links.<br>• `contact.yml`, `seo.yml`, `social.json` centralize reusable metadata. |
| `_layouts/` | Page skeletons. For example `home.html`, `page.html`, `service.html`. Markdown files point to these via front matter. |
| `_includes/` | Reusable snippets (navigation, footer, call-to-action blocks). |
| `_sass/` + `assets/css` | Stylesheets built from SCSS partials. Customize typography, colors, or layout helpers here. |
| `images/` & `assets/` | Logos, icons, and other media referenced by layouts or Markdown content. |
| `netlify.toml` | Build command and publish directory for Netlify deploys. |
| `.github/dependabot.yml` | Automated dependency update configuration. |

## Editing Content

### Update an existing page
1. Open the Markdown file (e.g., `about.md`).
2. Adjust front matter fields (title, description, layout) if necessary.
3. Edit the Markdown body. Use standard Markdown plus any Jekyll Liquid tags already in use.
4. Run `bundle exec jekyll serve` locally to preview before committing.

### Add or modify a tilbud
1. Create/modify a Markdown file under `_tilbud/`.
2. Ensure the front matter contains `title`, `slug`, `weight`, and any custom fields used by the layout.
3. Update `_data/offers.yml` so the new `slug` appears in menus and on the landing page.
4. Commit both the Markdown file and data entry together.

### Update bestyrelsen
- Edit `_data/board.yml` to change member names, roles, phone numbers, or emails. The `bestyrelse.md` page automatically renders the list.

### Navigation changes
- Modify `_data/menus.yml`. Items under `main` appear in the desktop and mobile menus. You can point to a URL (`/about/`) or attach a dropdown by setting `dropdown: "offers"`.

### Contact and SEO metadata
- `_data/contact.yml` feeds contact blocks and footer info.
- `_data/seo.yml` contains global meta tags, social share defaults, etc. Adjust with care.

## Maintenance & Deployment

- **Local verification:** run `bundle exec jekyll build` to ensure the site compiles before pushing.
- **Dependabot:** Weekly pull requests keep Bundler gems and GitHub Actions up to date. Review/merge them to stay patched.
- **Deployment:** Pushing to `main` triggers the live deploy (via Netlify or GitHub Pages, depending on hosting). Netlify uses the `netlify.toml` command `bundle exec jekyll build` and publishes `_site/`.
- **Backups:** Because content lives in Markdown and YAML, keeping `main` protected and regularly pushed to GitHub is usually enough. Export `_data/` if you store critical contacts there.

## Tips & Troubleshooting

- If you see `Could not locate Gemfile or .bundle/ directory`, ensure you are inside the repo root where `Gemfile` lives.
- Delete `_site/` and rerun `bundle exec jekyll build` if you suspect stale output.
- Use `bundle update` sparingly; rely on Dependabot PRs so changes stay reviewable.
- Keep filenames aligned with their permalinks (e.g., `bestyrelse.md` → `/bestyrelse/`) to reduce confusion when editing.

Have ideas or find a bug? Open an issue or PR so we can keep the club site fast and accurate.
