#!/usr/bin/env bash
# Shared helper: run a command inside a Ruby container with the repo mounted.
#
# Hvorfor Docker: repoet bygger med github-pages-gemmet, som kræver en
# specifik Ruby-version (3.2 pga. nokogiri). Docker giver samme version som
# CI uden at installere Ruby på maskinen. Gems caches i en navngivet volume,
# så kun første kørsel er langsom.
set -euo pipefail

RUBY_IMAGE="${RUBY_IMAGE:-ruby:3.2}"
GEM_VOLUME="${GEM_VOLUME:-ejby-badminton-gems}"
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if ! docker info >/dev/null 2>&1; then
  echo "FEJL: Docker kører ikke. Start Docker og prøv igen." >&2
  echo "      (Alternativ: installer Ruby 3.2 + 'bundle install' og kør jekyll direkte.)" >&2
  exit 1
fi

docker volume create "$GEM_VOLUME" >/dev/null

# $1 = extra docker args (word-split intentionally), resten = kommando
docker_run() {
  local extra="$1"; shift
  # shellcheck disable=SC2086
  docker run --rm -t \
    -v "$REPO_ROOT:/srv/site" \
    -v "$GEM_VOLUME:/usr/local/bundle" \
    -w /srv/site \
    -e BUNDLE_GEMFILE=/srv/site/Gemfile \
    -e JEKYLL_ENV="${JEKYLL_ENV:-development}" \
    -u "$(id -u):$(id -g)" \
    -e HOME=/tmp \
    $extra \
    "$RUBY_IMAGE" \
    bash -lc "$*"
}

bundle_install() {
  echo "==> Installerer gems (caches i Docker-volume '$GEM_VOLUME')"
  docker_run "-u 0:0" "bundle install --jobs 4 --retry 3 --quiet && chmod -R a+rX,a+w /usr/local/bundle"
}
