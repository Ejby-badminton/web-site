#!/usr/bin/env bash
# Kør ALT lokalt, før du pusher. Samme kontroller som CI, plus SEO-tjek.
#
#   ./scripts/test.sh              # build + SEO-tjek (hurtigt, ingen netværk)
#   ./scripts/test.sh --links      # tilføj link-tjek (kræver netværk, langsomt)
#
# Afslutter med kode 1 hvis noget fejler.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

CHECK_LINKS=0
for arg in "$@"; do
  case "$arg" in
    --links) CHECK_LINKS=1 ;;
    *) echo "Ukendt flag: $arg" >&2; exit 2 ;;
  esac
done

echo "=============================================="
echo " 1/3  Bygger sitet (som i produktion)"
echo "=============================================="
JEKYLL_ENV=production ./scripts/build.sh

echo
echo "=============================================="
echo " 2/3  Tjekker SEO og strukturerede data"
echo "=============================================="
node scripts/check-seo.mjs

if [ "$CHECK_LINKS" -eq 1 ]; then
  echo
  echo "=============================================="
  echo " 3/3  Tjekker links (samme som CI)"
  echo "=============================================="
  ./scripts/check-links.sh
else
  echo
  echo " 3/3  Link-tjek sprunget over. Kør med --links for at inkludere det."
fi

echo
echo "Alt OK — klar til commit og push."
