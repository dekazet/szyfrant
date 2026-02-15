# Szyfrant

A real-time multiplayer web game for two teams — a cipher/code-cracking party game inspired by Decrypto. Teams encode and decode 3-digit numbers using word-based clues across up to 8 rounds. All UI text is in Polish.

## Setup

```bash
npm install
```

## Development

Run both the frontend dev server and the backend simultaneously (two terminals):

```bash
npm run server     # Backend Express/Socket.IO server on port 666
npm start          # Frontend Webpack dev server on port 3000 (proxies Socket.IO to backend)
```

Then open http://localhost:3000 in your browser. Open multiple tabs/browsers to simulate two teams.

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Webpack dev server on port 3000 with hot reload |
| `npm run server` | Backend Express + Socket.IO server on port 666 |
| `npm run build` | Production build to `./build/` |
| `npm test` | Runs server-side game logic tests |

## Production Deployment

```bash
npm run build
bash scripts/deploy.sh
```

This copies the server files and the built frontend into `./deployment/`. In production, only the backend process is needed — it serves the static React build via Express on port 666.

```bash
sudo node deployment/server.js
```

## Tech Stack

- **Frontend:** React 16 (class components), Socket.IO Client 2.3
- **Backend:** Express 4 + Socket.IO 2.3 (Node.js)
- **Build:** Ejected Create React App (Webpack 4, Babel 7)
- **Tests:** Custom assertion-based test runner (server-side game logic)

## How It Works

Each team has 4 secret words visible only to them. Each round, the team's encoder draws a 3-digit number (digits 1-4, no repeats) and gives one-word clues that hint at the corresponding secret words. The opposing team sees the clues and tries to guess the number.

The server filters game state per team so that the opponent's drawn number is hidden until your team submits a guess. All submissions are validated server-side (clue format, number validity, double-submit prevention).
