# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Szyfrant is a real-time multiplayer web game for two teams (a cipher/code-cracking party game). Teams encode and decode 3-digit numbers using word-based clues across up to 8 rounds. All UI text is in Polish.

## Tech Stack

- **Frontend:** React 16 (class components), Socket.IO Client 2.3
- **Backend:** Express 4 + Socket.IO 2.3 (Node.js)
- **Build:** Ejected Create React App (Webpack 4, Babel 7)
- **Tests:** Jest (client), custom test runner (server)

## Commands

```bash
npm start          # Dev server on port 3000 (proxies Socket.IO to backend)
npm run server     # Backend Express/Socket.IO server on port 666
npm run build      # Production build to ./build/
npm test           # Runs server-side szyfrant_test.js (bypasses Jest via TEST_HACK_ON flag)
```

For development, run both `npm start` (frontend) and `npm run server` (backend) simultaneously.

Deployment: `bash scripts/deploy.sh` copies server files + build output to `./deployment/`.

## Architecture

### Client (`src/client/`)

Single-file React app in `App.js` with all components defined inline as class components:
- **App** — Root component. Manages Socket.IO connection, game state, and timer. Connects to `http://localhost:3000`.
- **GameBoard** — Renders 8 round cards in a 2×4 grid.
- **RoundCard** — Displays encoded words and decoded numbers for one round.
- **HintsBoard / GameBoardKyes** — Shows opponent hint history organized by key number (1-4).
- **CodeEntryForm** — 3 text inputs for encoding (submitting clue words).
- **NumberEntryForm** — Single input for decoding (guessing the number).
- **CodeButton** — Double-click to reveal drawn number (auto-hides after 2s).
- **RadzioTimer** — Countdown timer shown when opposing team has submitted but your team hasn't.

### Server (`src/server/`)

- **server.js** — Express + Socket.IO server. Manages team membership via in-memory Sets (socket IDs). Broadcasts filtered game state per team.
- **szyfrant.js** — Pure game logic module. Exports: `newGame()`, `startRound(game)`, `submitCoded(game, team, encoded)`, `submitDecoded(game, team, decoded)`, `printGame(game)`.

### Game State Structure

```
{
  words: [[4 words team A], [4 words team B]],
  rounds: [{
    teams: [{
      drawn_number,        // 3-digit number (digits 1-4, no repeats)
      encoded_number,      // array of 3 clue strings
      decoded_number,      // opponent's guess
      encoded_number_tick  // timestamp for timer
    }, ...]
  }, ...]
}
```

### Socket.IO Events

Client emits: `game-state`, `game-join-a`, `game-join-b`, `game-new`, `game-start-round`, `game-submit-codednumber`, `game-submit-decodednumber`

Server broadcasts: `game-state` (with team field injected per recipient)

## Key Conventions

- Team constants: `TEAM_NONE = -1`, `TEAM_A = 0`, `TEAM_B = 1` (duplicated in both client and server)
- Game state is in-memory only — lost on server restart
- Number pool: 24 permutations of digits 1-4 without repeats (e.g., 123, 412)
- Word pool: 500+ Polish nouns in `szyfrant.js`
- CSS uses `class` attribute (not `className`) throughout JSX
