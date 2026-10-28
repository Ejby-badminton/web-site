# Arbejdsgang for Ejby IF Badminton (web-site)

Statisk Jekyll-site for en frivilligt drevet badmintonklub. Hostet på **GitHub
Pages**. Alt indhold er på **dansk** (`lang: da`) — skriv dansk i sider, UI-tekst
og datafiler. Kodekommentarer er også dansk i dette repo.

> Denne fil er den primære kilde for agenter. `.github/copilot-instructions.md`
> peger herpå. Opdatér begge, hvis arbejdsgangen ændrer sig.

## 1. Test lokalt før du pusher

Der skal **ikke** installeres Ruby. Alt kører i Docker via scripts i `scripts/`.

```bash
./scripts/test.sh            # byg + SEO-tjek. Kør ALTID denne før commit.
./scripts/test.sh --links    # samme, plus link-tjek (kræver netværk)
./scripts/serve.sh           # live på http://127.0.0.1:4000
./scripts/build.sh           # kun build → _site/
./scripts/check-seo.mjs      # kun SEO-tjek (kræver et build først)
./scripts/check-links.sh     # kun link-tjek (kræver et build først)
```

Første kørsel henter `ruby:3.2` og installerer gems i en Docker-volume
(`ejby-badminton-gems`); derefter tager et build ca. 8 sekunder.

`scripts/check-seo.mjs` er et regressionsnet mod de fejl, man **ikke** kan se i
en browser: manglende eller duplikerede `<title>`, manglende meta description,
ugyldig JSON-LD, `@id`-referencer der ikke kan opløses, urenderet Liquid i
output, billeder uden `alt`, huller i brødkrummer, samt fejl i `robots.txt`,
`llms.txt` og `sitemap.xml`. Den kører også i CI. **Fejl skal rettes — ikke
undertrykkes.** Advarsler er vejledende.

Ruby-versionen er pinnet til **3.2** i `ci.yml`, `pages.yml` og
`scripts/_docker.sh` (nokogiri kræver det). Ændres én, skal alle fire ændres.

## 2. Hvor indholdet bor

| Sti | Formål |
| --- | --- |
| `indhold/sider/*.md` | Sider. URL styres af `permalink`. |
| `indhold/sider/_tilbud/` | Kollektion: én fil per tilbud. |
| `indhold/data/` | YAML/JSON der driver menuer og dynamiske sektioner. |
| `_layouts/`, `_includes/` | Liquid-skabeloner. |
| `_sass/`, `assets/css/style.scss` | SCSS. Bootstrap 5.3.2 importeres selektivt. |
| `_site/` | **Genereret. Redigér aldrig. Commit aldrig.** |

## 3. Data er source of truth — hardkod ikke fakta

Dette er den vigtigste regel i repoet. Klubbens fakta står **ét** sted og læses
derfra af sider, strukturerede data og `llms.txt`. Skriver du en adresse, et
telefonnummer eller en pris direkte i en side eller skabelon, opstår der før
eller siden uenighed mellem HTML og JSON-LD — og modstridende oplysninger
skader placeringen i både Google og AI-svar.

| Fil | Indeholder | Læses af |
| --- | --- | --- |
| `kontakt.yml` | Navn, adresse, telefon, mail, koordinater, åbningstider, områder, CVR | `call.html`, `structured-data.html`, `llms.txt`, `kontakt.md`, `tilbud.md` |
| `tilbud.yml` | Tilbud: titel, priser, tider, kontaktpersoner | Forside, menuer, `tilbud.md`, JSON-LD, `llms.txt` |
| `faq.yml` | Spørgsmål og svar | `/kontakt/` **og** `FAQPage`-markup |
| `bestyrelse.yml` | Bestyrelsen | `/bestyrelsen/`, `llms.txt` |
| `menuer.yml` | Navigation og footer | Begge menu-includes, footer |
| `seo.yml` | Analytics- og verifikations-ID'er | `google-analytics.html`, `<head>` |

To koblinger må ikke brydes:

- Hvert `slug` i `tilbud.yml` **skal** matche `slug` i en fil under
  `indhold/sider/_tilbud/`. Skabelonerne slår op med
  `site.tilbud | where: "slug", offer.slug | first`. Uden match forsvinder
  tilbuddet lydløst fra menu og forside.
- `price_min` / `price_max` i `tilbud.yml` er maskinlæsbare priser i DKK til
  JSON-LD. De skal stemme med den menneskelige tekst i `pricing`.

## 4. Regler for søgemaskiner og AI-assistenter

Formålet er, at klubben bliver fundet — både i Google og når en AI-assistent
bliver spurgt "hvor kan man spille badminton i Køge?".

**Hver ny side skal have** i front matter:

```yaml
title: Kort sidenavn            # bliver <h1>
meta_title: "..."               # valgfri; fuld <title>, ellers "title | Ejby Badminton"
description: >-                 # 120-155 tegn, nævn sted og konkrete fakta
  ...
permalink: "/min-side/"
```

- **Én `<h1>` per side.** Layoutet `page.html` udskriver selv `page.title` som
  `<h1>` — start derfor *ikke* indholdet med `#` i de layouts.
- **`description` skal være unik** og 120-155 tegn. Tjekket fanger duplikater.
- Skriv **selvbærende** svar og afsnit. AI-assistenter citerer et afsnit uden
  den omkringstående tekst, så skriv "i Ejbyhallen" fremfor "hos os".
- Nævn konkrete tal, dage, priser og stednavne (Lille Skensved, Køge, Ejby).
  Vage formuleringer som "kontakt os for pris" kan ikke citeres.
- Sæt `noindex: true` + `sitemap: false` på sider der ikke skal i søgeresultater.
- Sæt `show_faq: true` for at vise FAQ fra `faq.yml` **og** udsende
  `FAQPage`-markup. Synlig tekst og markup skal altid være identisk — Google
  straffer markup, der beskriver indhold brugeren ikke kan se.

**Genererede filer** (redigér aldrig output — ret i datafilerne):

- `llms.txt` → `/llms.txt`. Maskinlæsbart resumé for AI-assistenter efter
  konventionen på llmstxt.org. Bygges helt fra `indhold/data/`.
- `robots.txt` → genereres med en Liquid-løkke. **Vigtigt:** en navngiven
  crawler arver ikke regler fra `User-agent: *`, så hver gruppe skal selv
  gentage sine `Disallow`-linjer. Løkken sikrer det; tilføj nye crawlere i
  listen `agent_list`, ikke som en løs blok.
- `_includes/structured-data.html` → ét JSON-LD `@graph` per side med noderne
  `SportsClub`, `Place`/`SportsActivityLocation`, `WebSite`, `WebPage`,
  `BreadcrumbList` og — hvor relevant — `FAQPage` og `Service`. Noderne kobles
  med `@id`. Tilføjer du en node, så kontrollér at hver `@id`-reference peger på
  en node i samme graf; ellers ignorerer Google den.
- Udelukkede stier skal holdes i sync tre steder: `robots.txt` (`disallow`),
  `_config.yml` (`sitemap: false` for `assets/docs`) og `check-seo.mjs`.
  PDF-referater holdes ude, fordi de indeholder medlemsnavne.

## 5. Statistik: hvor mange besøg får sitet?

Begge værktøjer er gratis og slået **fra** indtil ID'erne er udfyldt i
`indhold/data/seo.yml` (filen indeholder trin-for-trin vejledning):

- `google_analytics_id` (`G-XXXXXXXXXX`) → Google Analytics 4: antal besøg og
  hvilke sider der læses. Indlæses kun ved `JEKYLL_ENV=production`, så lokal
  udvikling ikke forurener statistikken.
- `google_site_verification` → Google Search Console: hvad folk **søgte på**,
  før de fandt sitet, plus visninger og klik. Det vigtigste værktøj til at
  vurdere, om SEO-arbejdet virker. Husk at indsende `/sitemap.xml` der.
- `bing_site_verification` → Bing Webmaster Tools. Bing leverer også data til
  ChatGPT-søgning.

## 6. Commit og deploy

- PROD er det eneste miljø. **Commit og push** til `main` udløser deploy, med
  mindre brugeren siger andet.
- Kør `./scripts/test.sh` først. Små, fokuserede commits.
- `ci.yml`: build → `check-seo.mjs` → link-tjek. `pages.yml`: build → purgecss →
  minify → deploy.
- Link-tjekket udelader `https://ejbyif-badminton.dk`, fordi hver sides
  canonical peger på produktion. Uden den undtagelse ville **enhver ny side**
  fejle i CI, indtil den var deployet.
- Tilføjer du en ny CSS-klasse i et layout eller en include, så kontrollér
  `purgecss.config.cjs`: klasser der kun optræder i JavaScript, kan blive
  fjernet i produktionsbuildet.

## 7. Årligt: ny sæson

1. Ret `season`, `times`, `pricing`, `price_min`, `price_max` og `signup` i
   `indhold/data/tilbud.yml`.
2. Ret de samme tal i brødteksten under `indhold/sider/_tilbud/`.
3. Ret priser og datoer i svarene i `indhold/data/faq.yml`.
4. Ret sæsontal i `description`/`meta_title` på de berørte sider.
5. Kør `./scripts/test.sh`. `llms.txt`, JSON-LD og `/tilbud/` opdaterer sig selv.

Forkerte priser er værre end ingen priser: de bliver citeret som fakta af
AI-assistenter længe efter, de er ændret.

## 8. Lad være med

- Redigér eller commit `_site/`.
- Tilføj Jekyll-plugins. Repoet bruger `github-pages`-gemmet, som kun tillader
  en fast liste. `jekyll-sitemap` er den eneste aktive.
- Hardkod adresse, telefon, mail eller priser i sider eller skabeloner.
- Skriv i `llms.txt` eller `robots.txt` som om de var statiske filer.
- Introducér nye design-primitiver. Brug de eksisterende tokens i
  `_sass/_bootstrap-variables.scss`.
- Ændr `Cache-Control` o.l. — GitHub Pages styrer response headers.
  Performance-arbejde skal reducere bytes.
