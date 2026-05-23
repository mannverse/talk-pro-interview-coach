# Talk Pro Interview Coach

AI-powered mock interview practice for students and young professionals in India.
Built for the **Talk Pro with Aman** creator brand.

## Run locally

```bash
# 1. Copy env template and add your key
cp .env.example .env.local
# Edit .env.local → paste your Gemini key

# 2. Start dev server (key is injected automatically)
bash scripts/dev.sh
# → open http://localhost:3000
```

Get a free Gemini API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

## Branch strategy

| Branch | Purpose | Auto-deploy |
|--------|---------|-------------|
| `develop` | Active development | CI validation only |
| `main` | Production | → GitHub Pages |

Always work on `develop`. Merge to `main` only when ready to ship.

## Deploy to production

1. Add `GEMINI_API_KEY` to **GitHub → Settings → Secrets → Actions**
2. Enable **GitHub Pages** (Settings → Pages → Source: GitHub Actions)
3. Merge `develop` → `main` — the workflow handles the rest

## Tech stack

- Vanilla HTML + React 18 (CDN) — no build step
- Babel standalone for JSX
- Tailwind CSS Play CDN
- Google Gemini 2.0 Flash API
- PDF.js for CV parsing
