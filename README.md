# Szyfrant

A real-time multiplayer web game for two teams — a cipher/code-cracking party game inspired by Decrypto. Teams encode and decode 3-digit numbers using word-based clues across up to 8 rounds. All UI text is in Polish.

## Quick Start (Docker)

```bash
docker compose up
```

Open http://localhost:3001 in your browser. Share the same URL with other players — use a URL hash to create a private room (e.g., `http://localhost:3001/#my-room`).

## Setup (without Docker)

```bash
npm install
```

## Development

Run both the frontend dev server and the backend simultaneously (two terminals):

```bash
npm run server     # Backend Express/Socket.IO server on port 3001
npm start          # Frontend Webpack dev server on port 3000 (proxies Socket.IO to backend)
```

Then open http://localhost:3000 in your browser. Open multiple tabs/browsers to simulate two teams.

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Webpack dev server on port 3000 with hot reload |
| `npm run server` | Backend Express + Socket.IO server (default port 3001, configurable via `PORT` env var) |
| `npm run build` | Production build to `./build/` |
| `npm test` | Runs server-side game logic tests |

## Production Deployment

### With Docker

```bash
docker compose up -d
```

### Without Docker

```bash
npm run build
bash scripts/deploy.sh
node deployment/server.js
```

This copies the server files and the built frontend into `./deployment/`. In production, only the backend process is needed — it serves the static React build via Express.

Set the port with `PORT=8080 node deployment/server.js`.

## Features

- **Game rooms** — Multiple groups can play independently using different URL hashes (e.g., `/#room1`, `/#friends`). Default room is used when no hash is provided.
- **Reconnection** — Players get a persistent ID stored in localStorage. Refreshing the page or reconnecting automatically restores team membership.
- **Scoring** — Tracks correct decode guesses per team. A team scores a point when they correctly guess the opponent's drawn number. Displayed as "Wynik: X - Y".
- **Server-side security** — Opponent's drawn number is hidden until your team submits a guess. All inputs are validated (clue format, number validity, double-submit prevention). Game-control events require team membership.
- **Responsive UI** — Works on desktop and mobile with a 480px breakpoint.

## Tech Stack

- **Frontend:** React 16 (class components), Socket.IO Client 2.3
- **Backend:** Express 4 + Socket.IO 2.3 (Node.js)
- **Build:** Ejected Create React App (Webpack 4, Babel 7)
- **Tests:** Custom assertion-based test runner (server-side game logic)
- **Docker:** Multi-stage build with Node 18 Alpine

## How It Works

Each team has 4 secret words visible only to them. Each round, the team's encoder draws a 3-digit number (digits 1-4, no repeats) and gives one-word clues that hint at the corresponding secret words. The opposing team sees the clues and tries to guess the number. If they guess correctly, they score a point.
