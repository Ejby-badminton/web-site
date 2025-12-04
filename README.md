# Ejby IF Badminton Website

Statisk præsentationsside for Ejby IF Badminton bygget med [Jekyll](https://jekyllrb.com/) og hostet via Netlify/GitHub Pages. Repositoriet indeholder alt indhold, data, layouts og styling, så du kan køre siden lokalt og holde den opdateret i produktion.

## Forudsætninger

- Ruby 3.x (den version der evt. er angivet i `.ruby-version`, ellers din systems Ruby)
- [Bundler](https://bundler.io/) `gem install bundler`
- Valgfrit: [nvm](https://github.com/nvm-sh/nvm) eller Node.js, hvis du senere tilføjer ekstra CSS/JS tooling

## Kom godt i gang

```bash
# Klon repoet
git clone git@github.com:Ejby-badminton/web-site.git
cd web-site

# Installer gems
bundle install

# Kør lokalt med live reload
bundle exec jekyll serve --livereload
```

Åbn `http://localhost:4000` for at se ændringer. Stop serveren med `Ctrl+C`.

Til en produktionsbuild (den Netlify bruger) kører du `bundle exec jekyll build`. Output havner i `_site/`.

## Mappeoverblik

| Sti | Formål |
| ---- | ------ |
| `indhold/sider/*.md` | Alle sider som administratoren redigerer. Filnavnet matcher URL’en (fx `kontakt.md` → `/kontakt/`). Front matter styrer layout, titel og SEO. |
| `indhold/_tilbud/` | Jekyll-kollektion med én Markdown-fil per tilbud. Brug samme `slug` som i `indhold/data/tilbud.yml`. |
| `indhold/data/` | Struktureret YAML/JSON der driver navigation og dynamiske sektioner.<br>• `tilbud.yml` styrer rækkefølge og labels på forsiden.<br>• `bestyrelse.yml` viser bestyrelsen på `bestyrelsen.md`.<br>• `menuer.yml` definerer navigation og footer.<br>• `kontakt.yml`, `seo.yml`, `sociale_medier.json` samler metadata. |
| `_layouts/` | Sidernes skeletter, fx `home.html`, `page.html`, `service.html`. Markdown-filerne peger på dem via front matter. |
| `_includes/` | Genbrugte snippets (menuer, footer, call-to-action blokke). |
| `_sass/` + `assets/css` | SCSS-partials der bygger den samlede CSS. Tilpas typografi, farver og helper-klasser her. |
| `images/` & `assets/` | Logoer, ikoner og andre medier brugt på siderne. |
| `netlify.toml` | Build-kommando og publish-mappe til Netlify. |
| `.github/dependabot.yml` | Opsætning af automatiske dependency-opdateringer. |

## Redigering af indhold

### Opdater en eksisterende side
1. Åbn den relevante Markdown-fil under `indhold/sider/` (fx `indhold/sider/om-klubben.md`).
2. Justér front matter (titel, beskrivelse, layout) efter behov.
3. Redigér selve Markdown-indholdet. Du kan bruge almindelig Markdown samt de Liquid-tags der allerede er i brug.
4. Kør `bundle exec jekyll serve` lokalt for at tjekke resultatet inden commit.

### Tilføj eller redigér et tilbud
1. Opret/redigér filen under `indhold/_tilbud/`.
2. Sørg for at front matter indeholder `title`, `slug`, `weight` og andre felter som layoutet forventer.
3. Opdater `indhold/data/tilbud.yml`, så det nye `slug` dukker op i menuen og på forsiden.
4. Commit Markdown-filen og dataændringen samlet.

### Opdatér bestyrelsen
- Redigér `indhold/data/bestyrelse.yml` for at ændre navne, roller, telefonnumre eller mails. `bestyrelsen.md` viser automatisk data herfra.

### Navigation
- Justér `indhold/data/menuer.yml`. Elementer under `main` vises i både desktop- og mobilmenu. Peg enten på en URL (`/om-klubben/`) eller brug `dropdown: "tilbud"` for at vise tilbudslisten.

### Kontakt- og SEO-data
- `indhold/data/kontakt.yml` bruges i kontaktsektioner og footer.
- `indhold/data/seo.yml` gemmer globale metatags og sociale defaults. Ændr forsigtigt.
- `indhold/data/sociale_medier.json` styrer ikonerne i footer.

## Drift og vedligehold

- **Lokal verifikation:** kør `bundle exec jekyll build` før du pusher, så du ved siden bygger.
- **Dependabot:** ugentlige PR’er holder Bundler-gems og GitHub Actions opdateret. Gennemgå/merge dem for at være patch’et.
- **Deploy:** et push til `main` udløser deploy (Netlify eller GitHub Pages). Netlify bruger `bundle exec jekyll build` og uploader `_site/`.
- **CI:** GitHub Actions-workflowet `.github/workflows/ci.yml` kører både `bundle exec jekyll build` og `npx broken-link-checker` på hver push/PR mod `main`, så du kun skal committe og pushe.
- **Backups:** Indholdet ligger i Markdown/YAML, så så længe `main` er beskyttet og pushes til GitHub, er du dækket. Tag evt. en kopi af `indhold/data/`, hvis kontaktdata er kritiske.

## Tips og fejlsøgning

- Hvis du ser `Could not locate Gemfile or .bundle/ directory`, står du sandsynligvis ikke i repo-roden.
- Slet `_site/` og kør `bundle exec jekyll build` igen, hvis output virker forældet.
- Brug `bundle update` med omtanke – lad Dependabot lave PR’s, så ændringerne er overskuelige.
- Lad filnavne matche permalinks (fx `bestyrelsen.md` → `/bestyrelsen/`) for at undgå forvirring.

Har du idéer eller finder en fejl? Opret et issue eller en pull request, så holder vi klubbens website skarpt og opdateret.
