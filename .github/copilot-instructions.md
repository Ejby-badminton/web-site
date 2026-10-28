# Copilot instructions (ejby-badminton/web-site)

**Den fulde arbejdsgang står i [CLAUDE.md](../CLAUDE.md) i repo-roden. Læs den
først.** Denne fil gentager kun det vigtigste, så de to ikke kan komme ud af
sync — opdatér `CLAUDE.md`, hvis arbejdsgangen ændrer sig.

## Det korte

- Statisk Jekyll-site, hostet på GitHub Pages. Alt indhold er på **dansk**
  (`lang: da`) — det gælder også kodekommentarer.
- Kildekode: `indhold/` (sider + data), `_layouts/`, `_includes/`, `_sass/`.
  `_site/` er genereret: **redigér og commit den aldrig.**

## Test lokalt før du pusher

Ruby skal ikke installeres — alt kører i Docker:

```bash
./scripts/test.sh            # byg + SEO-tjek. Kør ALTID denne før commit.
./scripts/test.sh --links    # samme, plus link-tjek
./scripts/serve.sh           # live på http://127.0.0.1:4000
```

`scripts/check-seo.mjs` fanger de fejl, man ikke kan se i en browser: dubletter
i `<title>`, manglende meta description, ugyldig JSON-LD, urenderet Liquid,
billeder uden `alt` og fejl i `robots.txt`/`llms.txt`/`sitemap.xml`. Den kører
også i CI. Fejl skal rettes, ikke undertrykkes.

## Vigtigste konvention: data er source of truth

Hardkod **aldrig** adresse, telefon, mail eller priser i en side eller skabelon.
De står i `indhold/data/` og læses derfra af både HTML, JSON-LD og `llms.txt`.
Modstridende oplysninger skader placeringen i Google og i AI-svar.

- `kontakt.yml` — navn, adresse, telefon, mail, koordinater, åbningstider
- `tilbud.yml` — tilbud og priser. Hvert `slug` **skal** matche en fil i
  `indhold/sider/_tilbud/`, ellers forsvinder tilbuddet lydløst fra menuen.
- `faq.yml` — driver både FAQ'en på `/kontakt/` og `FAQPage`-markup
- `menuer.yml` — navigation og footer
- `seo.yml` — ID'er til Analytics og Search Console

`llms.txt`, `robots.txt` og JSON-LD genereres fra disse filer. Ret i data, ikke
i output.

## Nye sider

Front matter skal have `title`, en **unik** `description` på 120-155 tegn og
`permalink`. Én `<h1>` per side. Skriv selvbærende afsnit med konkrete tal og
stednavne — AI-assistenter citerer et afsnit uden den omkringstående tekst.

## CSS purging

Production builds run `scripts/optimize-css.sh` (PurgeCSS + clean-css), locally and in
the deploy. If you add a class that **only JavaScript applies**, add it to
`safelist.standard` in `purgecss.config.cjs` — PurgeCSS scans rendered HTML and cannot
see it, so the rule gets stripped and the behaviour breaks only in production.

## Deploy

PROD er det eneste miljø. Push til `main` deployer. Commit og push, med mindre
brugeren siger andet. Små, fokuserede commits. Tilføj ikke Jekyll-plugins
(`github-pages`-gemmet tillader kun en fast liste).
