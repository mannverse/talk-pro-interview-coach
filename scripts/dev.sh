#!/usr/bin/env bash
# Run the app locally with your API key injected.
# Usage: bash scripts/dev.sh

set -e

# Load key from .env.local if it exists
if [ -f ".env.local" ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌  GEMINI_API_KEY not set."
  echo "    Create a .env.local file with: GEMINI_API_KEY=AIzaSy..."
  exit 1
fi

# Inject key into a temp file (never committed)
sed "s/__GEMINI_API_KEY__/$GEMINI_API_KEY/g" index.html > .index.dev.html

echo "✅  Key injected. Starting server at http://localhost:3000"

python3 - <<'EOF'
import http.server, os, signal, sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path in ('/', '/index.html'):
            self.path = '/.index.dev.html'
        super().do_GET()
    def log_message(self, fmt, *args):
        pass  # silence request logs

server = http.server.HTTPServer(('', 3000), Handler)
signal.signal(signal.SIGINT, lambda *_: (server.shutdown(), sys.exit(0)))
server.serve_forever()
EOF
