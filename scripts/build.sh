#!/usr/bin/env bash
# Byg sitet til _site/ — samme kommando som CI kører.
#   ./scripts/build.sh            # development
#   JEKYLL_ENV=production ./scripts/build.sh
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_docker.sh"

bundle_install
echo "==> jekyll build (JEKYLL_ENV=${JEKYLL_ENV:-development})"
docker_run "" "bundle exec jekyll build"
echo "==> Færdig: _site/"
