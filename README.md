# Ejby IF Badminton Website

Statisk præsentationsside for Ejby IF Badminton bygget med [Jekyll](https://jekyllrb.com/) og hostet via GitHub Pages. Repositoriet indeholder alt indhold, data, layouts og styling, så du kan køre siden lokalt og holde den opdateret i produktion.

## Forudsætninger

Du har brug for **én** af to ting:

- **Docker** (anbefalet) — så skal der intet andet installeres. Scripts i
  `scripts/` kører Jekyll i en container med samme Ruby-version som CI.
- **Ruby 3.2 + Bundler** hvis du foretrækker at køre direkte på maskinen.
  Ruby 3.2 er påkrævet; nokogiri bygger ikke på ældre versioner.

Node.js bruges til SEO- og link-tjek.

## Kom godt i gang

```bash
git clone git@github.com:Ejby-badminton/web-site.git
cd web-site

# Kør lokalt med live reload på http://127.0.0.1:4000
./scripts/serve.sh
```

### Test før du pusher

```bash
./scripts/test.sh            # byg + SEO-tjek. Kør altid denne før commit.
./scripts/test.sh --links    # samme, plus link-tjek (kræver netværk)
```

`scripts/test.sh` kører de samme kontroller som CI, så du opdager fejl inden
push. `scripts/check-seo.mjs` fanger problemer man ikke kan se i en browser:
dubletter i sidetitler, manglende meta-beskrivelser, ugyldige strukturerede
data (JSON-LD), urenderet Liquid i output og fejl i `robots.txt`, `llms.txt`
eller `sitemap.xml`.

Uden Docker kan du i stedet køre `bundle install` og
`bundle exec jekyll serve --livereload`. Produktionsbuild:
`JEKYLL_ENV=production bundle exec jekyll build` → output i `_site/`.

## Mappeoverblik

| Sti | Formål |
| ---- | ------ |
| `indhold/sider/*.md` | Alle sider som administratoren redigerer. Filnavnet matcher URL’en (fx `kontakt.md` → `/kontakt/`). Front matter styrer layout, titel og SEO. |
| `indhold/sider/_tilbud/` | Jekyll-kollektion med én Markdown-fil per tilbud. Brug samme `slug` som i `indhold/data/tilbud.yml`. |
| `indhold/data/` | Struktureret YAML/JSON der driver navigation og dynamiske sektioner.<br>• `tilbud.yml` styrer rækkefølge og labels på forsiden.<br>• `bestyrelse.yml` viser bestyrelsen på `bestyrelsen.md`.<br>• `menuer.yml` definerer navigation og footer.<br>• `kontakt.yml` er source of truth for adresse, telefon og mail.<br>• `faq.yml` driver FAQ'en på `/kontakt/` og de strukturerede data.<br>• `seo.yml` holder ID'er til statistik.<br>• `sociale_medier.json` styrer ikonerne i footer. |
| `_layouts/` | Sidernes skeletter, fx `home.html`, `page.html`, `service.html`. Markdown-filerne peger på dem via front matter. |
| `_includes/` | Genbrugte snippets (menuer, footer, call-to-action blokke). |
| `_sass/` + `assets/css` | SCSS-partials der bygger den samlede CSS. Tilpas typografi, farver og helper-klasser her. |
| `images/` & `assets/` | Logoer, ikoner og andre medier brugt på siderne. |
| `scripts/` | Hjælpescripts til lokalt build, test, SEO-tjek og link-tjek. |
| `llms.txt` | Genereret resumé af sitet til AI-assistenter (`/llms.txt`). Ret i `indhold/data/`. |
| `robots.txt` | Genereret. Styrer hvilke søge- og AI-crawlere der må læse sitet. |
| `CLAUDE.md` | Arbejdsgang og konventioner — læs den før større ændringer. |
| `.github/dependabot.yml` | Opsætning af automatiske dependency-opdateringer. |

## Redigering af indhold

### Opdater en eksisterende side
1. Åbn den relevante Markdown-fil under `indhold/sider/` (fx `indhold/sider/om-klubben.md`).
2. Justér front matter (titel, beskrivelse, layout) efter behov.
3. Redigér selve Markdown-indholdet. Du kan bruge almindelig Markdown samt de Liquid-tags der allerede er i brug.
4. Kør `bundle exec jekyll serve` lokalt for at tjekke resultatet inden commit.

### Tilføj eller redigér et tilbud
1. Opret/redigér filen under `indhold/sider/_tilbud/`.
2. Sørg for at front matter indeholder `title`, `slug`, `weight` og andre felter som layoutet forventer.
3. Opdater `indhold/data/tilbud.yml`, så det nye `slug` dukker op i menuen og på forsiden.
4. Commit Markdown-filen og dataændringen samlet.

### Opdatér bestyrelsen
- Redigér `indhold/data/bestyrelse.yml` for at ændre navne, roller, telefonnumre eller mails. `bestyrelsen.md` viser automatisk data herfra.

### Navigation
- Justér `indhold/data/menuer.yml`. Elementer under `main` vises i både desktop- og mobilmenu. Peg enten på en URL (`/om-klubben/`) eller brug `dropdown: "tilbud"` for at vise tilbudslisten.

### Kontakt- og SEO-data
- `indhold/data/kontakt.yml` er **source of truth** for klubbens navn, adresse,
  telefon og mail. Værdierne bruges i kontaktboksen, i de strukturerede data
  (JSON-LD) og i `llms.txt`. Hardkod derfor aldrig kontaktoplysninger i en side.
- `indhold/data/faq.yml` driver både den synlige FAQ på `/kontakt/` og
  `FAQPage`-markup, som Google og AI-assistenter læser.
- `indhold/data/seo.yml` indeholder ID'er til Google Analytics, Google Search
  Console og Bing. Filen har trin-for-trin vejledning til at oprette dem.
- `indhold/data/sociale_medier.json` styrer ikonerne i footer.

### Se hvor mange besøg sitet får

Statistik er slået fra, indtil ID'erne udfyldes i `indhold/data/seo.yml`:

- **Google Analytics 4** (`google_analytics_id`) viser antal besøgende og hvilke
  sider de læser. Opret gratis på <https://analytics.google.com>.
- **Google Search Console** (`google_site_verification`) viser hvad folk søgte
  på, før de fandt sitet, samt visninger og klik. Opret gratis på
  <https://search.google.com/search-console>, og indsend `/sitemap.xml`.

Statistik indsamles kun på det rigtige site (`JEKYLL_ENV=production`), så lokal
udvikling forurener ikke tallene.

## Drift og vedligehold

- **Lokal verifikation:** kør `./scripts/test.sh` før du pusher. Den bygger
  sitet og kører de samme kontroller som CI.
- **Dependabot:** ugentlige PR’er holder Bundler-gems og GitHub Actions opdateret. Gennemgå/merge dem for at være patch’et.
- **Deploy:** et push til `main` udløser deploy til GitHub Pages via
  `.github/workflows/pages.yml`, som bygger, renser CSS og uploader `_site/`.
- **CI:** `.github/workflows/ci.yml` kører build, SEO-tjek
  (`node scripts/check-seo.mjs`) og link-tjek på hver push/PR mod `main`.
- **Backups:** Indholdet ligger i Markdown/YAML, så så længe `main` er beskyttet og pushes til GitHub, er du dækket. Tag evt. en kopi af `indhold/data/`, hvis kontaktdata er kritiske.

## Tips og fejlsøgning

- Hvis du ser `Could not locate Gemfile or .bundle/ directory`, står du sandsynligvis ikke i repo-roden.
- Slet `_site/` og kør `bundle exec jekyll build` igen, hvis output virker forældet.
- Brug `bundle update` med omtanke – lad Dependabot lave PR’s, så ændringerne er overskuelige.
- Lad filnavne matche permalinks (fx `bestyrelsen.md` → `/bestyrelsen/`) for at undgå forvirring.

Skal du lave større ændringer — eller er du en AI-agent — så læs
[CLAUDE.md](CLAUDE.md), som beskriver konventionerne i repoet.

Har du idéer eller finder en fejl? Opret et issue eller en pull request, så
holder vi klubbens website skarpt og opdateret.
