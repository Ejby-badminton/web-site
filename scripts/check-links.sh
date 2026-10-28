#!/usr/bin/env bash
# Tjekker for døde links — samme kontrol som CI kører.
# Serverer _site/ statisk og lader broken-link-checker gennemgå det.
set -euo pipefail
cd "$(dirname "${BASH_SOURCE[0]}")/.."

PORT="${PORT:-4001}"

if [ ! -d _site ]; then
  echo "FEJL: _site/ findes ikke. Kør ./scripts/build.sh først." >&2
  exit 1
fi

# -c-1 slår cache fra: ellers kan tjekket køre mod gammel CSS/JS fra en
# tidligere kørsel og give et misvisende resultat.
npx --yes http-server _site -p "$PORT" -s -c-1 >/tmp/ejby-http-server.log 2>&1 &
SERVER_PID=$!
trap 'kill $SERVER_PID 2>/dev/null || true' EXIT

echo "Venter på at serveren starter..."
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/"; then
    echo "Serveren er klar efter ${i}s"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "Serveren startede ikke. Log:" >&2
    cat /tmp/ejby-http-server.log >&2
    exit 1
  fi
  sleep 1
done

# Eksterne domæner der blokerer automatiserede kald udelades — de ville give
# falske fejl. Holdes i sync med .github/workflows/ci.yml.
# Sitets eget domæne udelades: siderne tjekkes allerede lokalt, og
# canonical-linket peger på produktion. Uden denne undtagelse fejler
# link-tjekket for ENHVER ny side, indtil den er deployet.
npx --yes broken-link-checker "http://127.0.0.1:${PORT}" --recursive --filter-level 3 \
  --exclude "https://ejbyif-badminton.dk" \
  --exclude "https://www.google.com/maps" \
  --exclude "https://maps.google.com" \
  --exclude "https://www.dgi.dk/badminton" \
  --exclude "https://www.dgi.dk/idr%C3%A6t/badminton" \
  --exclude "https://badmintondenmark.tournamentsoftware.com"
