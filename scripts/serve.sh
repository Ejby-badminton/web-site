#!/usr/bin/env bash
# Start sitet lokalt på http://127.0.0.1:4000 med live reload.
set -euo pipefail
source "$(dirname "${BASH_SOURCE[0]}")/_docker.sh"

PORT="${PORT:-4000}"
bundle_install
echo "==> Sitet kører på http://127.0.0.1:${PORT}  (Ctrl+C for at stoppe)"
docker_run "-i -p ${PORT}:${PORT}" \
  "bundle exec jekyll serve --host 0.0.0.0 --port ${PORT} --baseurl '' --livereload --livereload-port 35729 --force_polling"
