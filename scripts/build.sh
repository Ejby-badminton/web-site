#!/usr/bin/env bash
# Byg sitet til _site/ — samme kommando som CI kører.
#   ./scripts/build.sh            # development
#   JEKYLL_ENV=production ./scripts/build.sh
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_docker.sh"

bundle_install
echo "==> jekyll build (JEKYLL_ENV=${JEKYLL_ENV:-development})"
docker_run "" "bundle exec jekyll build"

# Kun ved produktionsbuild, så lokal udvikling ikke venter på npx. Det betyder
# også, at ./scripts/test.sh tjekker præcis den CSS, der bliver udgivet.
if [ "${JEKYLL_ENV:-development}" = "production" ]; then
  echo "==> Optimerer CSS"
  "$(dirname "${BASH_SOURCE[0]}")/optimize-css.sh"
fi

echo "==> Færdig: _site/"
