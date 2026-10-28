#!/usr/bin/env bash
# Fjerner ubrugt CSS og minificerer. Kører både lokalt (via scripts/build.sh ved
# JEKYLL_ENV=production) og i deploy-workflowet, så de to ikke kan komme ud af sync.
#
# Hvorfor kontrollerne nedenfor: indtil oktober 2026 kørte deployet
# "npx purgecss --config purgecss.config.cjs", som afsluttede med kode 0 uden at
# skrive noget. Resultatet var, at den udgivne CSS i månedsvis var 156 KB med
# ubrugt Bootstrap i. Scriptet fejler derfor nu, hvis CSS'en ikke bliver mindre
# (= purge gjorde intet), eller hvis kendte selektorer forsvinder (= purge tog
# for meget). Begge fejl er usynlige i en browser, indtil nogen opdager dem.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

CSS="_site/assets/css/style.css"

if [ ! -f "$CSS" ]; then
  echo "FEJL: $CSS findes ikke. Byg sitet først." >&2
  exit 1
fi

# Selektorer der SKAL overleve. De tilføjes af JavaScript eller bruges i
# komponenter, hvor en fjernelse først opdages som ødelagt layout i produktion.
REQUIRED_SELECTORS=(
  ".lock-scroll"
  ".hamburger"
  ".main-menu__dropdown"
  ".offer-grid"
  ".offer-card__meta"
  ".board-card"
  ".title"
)

before=$(wc -c < "$CSS")

# --css og --output angives eksplicit: CLI'en respekterer ikke "output" fra
# config-filen. Config-filen leverer fortsat content-stier og safelist.
npx --yes purgecss@6 \
  --config purgecss.config.cjs \
  --css "$CSS" \
  --output "$(dirname "$CSS")"

npx --yes clean-css-cli@5 -o "$CSS" "$CSS"

after=$(wc -c < "$CSS")

echo "CSS: ${before} -> ${after} bytes ($(( (before - after) * 100 / before ))% mindre)"

if [ "$after" -ge "$before" ]; then
  echo "FEJL: CSS blev ikke mindre. PurgeCSS gjorde formentlig ingenting." >&2
  echo "      Tjek at purgecss.config.cjs peger på de rigtige content-stier." >&2
  exit 1
fi

missing=()
for selector in "${REQUIRED_SELECTORS[@]}"; do
  grep -qF "$selector" "$CSS" || missing+=("$selector")
done

if [ ${#missing[@]} -gt 0 ]; then
  echo "FEJL: PurgeCSS fjernede selektorer der skal bruges: ${missing[*]}" >&2
  echo "      Tilføj dem til safelist i purgecss.config.cjs." >&2
  exit 1
fi

echo "Alle påkrævede selektorer er bevaret."
