# Epistemy Oral Exam Demo

Socratic oral examination with live EDS scoring.
Powered by Claude claude-sonnet-4-20250514. Deployed on Vercel.

---

## Project structure

```
epistemy-demo/
├── api/
│   └── chat.js          Vercel edge function — proxies Anthropic API
├── src/
│   ├── main.jsx         React entry point
│   └── EpistemyOralExamDemo.jsx
├── public/
│   └── index.html
├── dev-server.js        Local dev proxy (mirrors Vercel edge fn)
├── .env.example         Copy to .env.local with real values
├── package.json
├── vite.config.js
└── vercel.json
```

---

## Deploy to Vercel (5 minutes)

### Option A: Vercel CLI

```bash
npm install
npm i -g vercel
vercel

# Prompts:
#   Link to existing project? → N
#   Project name → epistemy-demo
#   Framework → Vite
#   Build command → npm run build
#   Output directory → dist
```

After first deploy, set environment variables:

```bash
vercel env add ANTHROPIC_API_KEY
vercel env add DEMO_TOKEN
vercel --prod
```

### Option B: GitHub + Vercel dashboard (recommended for ongoing use)

1. Push this repo to a **private** GitHub repository
2. Go to vercel.com → New Project → Import from GitHub
3. Framework: Vite | Build: `npm run build` | Output: `dist`
4. Add env vars in Settings → Environment Variables:
   - `ANTHROPIC_API_KEY` = your Anthropic key
   - `DEMO_TOKEN` = `epistemy-demo-2026`
5. Deploy

Every `git push` to main triggers an automatic redeploy.

---

## Local development

```bash
cp .env.example .env.local
# fill in ANTHROPIC_API_KEY and DEMO_TOKEN

npm install

# Terminal 1 — API proxy
node dev-server.js

# Terminal 2 — Vite dev server
npm run dev
```

Open http://localhost:5173

---

## Security notes

- `ANTHROPIC_API_KEY` lives only in Vercel env vars — never in the browser bundle
- `DEMO_TOKEN` is a simple shared secret to prevent public abuse of the proxy
- The `api/chat.js` edge function validates the token on every request
- `.env.local` is gitignored — never committed

---

## Customization

- To change the demo token: update `DEMO_TOKEN` in Vercel env vars
  and `DEMO_TOKEN` constant in `src/EpistemyOralExamDemo.jsx`
- To add disciplines: extend the `DISCIPLINES` array in the JSX
- To adjust probe depth: modify `DEPTH_LABELS` and the EDS scoring formula

---

UC Berkeley SkyDeck · PAD-13
