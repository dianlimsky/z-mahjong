# Z Mahjong

A lightweight, mobile-first Mahjong **win tracker**. Z Mahjong tracks who won each game — not points, scores, or hands.

## Features

- Record a complete Mahjong game in a few taps
- Reuse the last four-player table instantly
- Browse previous player groups (order-independent)
- Exactly four unique players per game
- Automatic leaderboard, win rate, games played, and last win
- Idempotent winner endpoint prevents duplicate wins from double-taps/retries
- Player add, rename, and confirmed removal
- Chronological game history
- Dark, red-accented, touch-friendly mobile UI
- Persistent Netlify Blobs storage

## Local development

### Frontend only

```bash
npm install
npm run dev
```

This starts Vite at `http://localhost:5173`. The UI will show empty/error states until the API is running.

### Full app with Netlify Functions

Install the Netlify CLI if needed:

```bash
npm install -g netlify-cli
```

Then run:

```bash
npm run dev:netlify
```

Netlify Dev serves the Vite app and Functions together. Netlify Blobs uses the local Netlify development environment for local persistence. In a deployed site, Blobs persists automatically through the linked Netlify site.

## Tests and production build

```bash
npm run test
npm run build
```

## Netlify deployment

1. Push this project to a Git provider.
2. In Netlify, choose **Add new site → Import an existing project**.
3. Use these settings (already configured in `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
4. Deploy. Netlify automatically provides Blobs access to the Functions runtime.
5. Run a smoke test: add four players, start a game, select a winner, and refresh the page to verify persistence.

No API keys or environment variables are required for the standard Netlify Blobs setup. If using an external/local Netlify environment, follow the Netlify Blobs CLI configuration instructions.

## Architecture

- `src/` contains the React + TypeScript client, using React Context and a small `fetch()` API client.
- `netlify/functions/` contains one lightweight serverless endpoint per resource.
- `netlify/functions/lib/storage.mjs` is the only storage access layer. It reads and writes JSON collections in Netlify Blobs.
- Statistics and previous tables are derived from game history; they are not duplicated counters.
- A completed game cannot be completed again, making winner submission idempotent.

## Known limitations

- No authentication or multi-group separation in v1.
- Netlify Blobs is the production persistence target; local data is separate from deployed data.
- Concurrent writes from multiple devices are not synchronized in real time.
- There are no Mahjong points, scoring rules, or game-engine features by design.
