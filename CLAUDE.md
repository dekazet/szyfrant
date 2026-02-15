# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Szyfrant is a real-time multiplayer web game for two teams (a cipher/code-cracking party game). Teams encode and decode 3-digit numbers using word-based clues across up to 8 rounds. All UI text is in Polish.

## Tech Stack

- **Frontend:** React 16 (class components), Socket.IO Client 2.3
- **Backend:** Express 4 + Socket.IO 2.3 (Node.js)
- **Build:** Ejected Create React App (Webpack 4, Babel 7)
- **Tests:** Custom assertion-based test runner (server)
- **Docker:** Multi-stage build with Node 18 Alpine

## Commands

```bash
npm start          # Dev server on port 3000 (proxies Socket.IO to backend)
npm run server     # Backend Express/Socket.IO server (default port 3001, configurable via PORT env var)
npm run build      # Production build to ./build/
npm test           # Runs server-side szyfrant_test.js (bypasses Jest via TEST_HACK_ON flag)
docker compose up  # Build and run with Docker on port 3001
```

For development, run both `npm start` (frontend) and `npm run server` (backend) simultaneously.

Deployment: `bash scripts/deploy.sh` copies server files + build output to `./deployment/`.

## Architecture

### Client (`src/client/`)

Single-file React app in `App.js` with all components defined inline as class components:
- **App** — Root component. Manages Socket.IO connection, game state, timer, and room/player identity. Connects to `window.location.origin` (auto-detects server URL). Generates a persistent player ID in localStorage for reconnection. Reads room ID from URL hash.
- **GameBoard** — Renders 8 round cards in a 2x4 grid.
- **RoundCard** — Displays encoded words and decoded numbers for one round.
- **HintsBoard / GameBoardKyes** — Shows opponent hint history organized by key number (1-4).
- **CodeEntryForm** — 3 text inputs for encoding (submitting clue words).
- **NumberEntryForm** — Single input for decoding (guessing the number).
- **CodeButton** — Double-click to reveal drawn number (auto-hides after 2s).
- **RadzioTimer** — Countdown timer shown when opposing team has submitted but your team hasn't. Timer interval is properly cleaned up when no longer needed.

### Server (`src/server/`)

- **server.js** — Express + Socket.IO server with room-based game isolation. Each room has its own game state, team sets, and player-to-team mapping. Uses `filterStateForTeam()` to redact opponent's `drawn_number` before broadcasting — each team only sees the opponent's secret number after submitting their own decode guess. Scores are computed via `computeScores()` and included in the filtered state. Game-control events (`game-new`, `game-start-round`) require the client to have joined a team. Player IDs (from client localStorage) are tracked per room for reconnection support.
- **szyfrant.js** — Pure game logic module. All state transitions (`startRound`, `submitCoded`, `submitDecoded`) return new objects (immutable updates via `Object.assign`). Validates inputs: encoded clues must be exactly 3 non-empty strings, decoded numbers must be valid permutations from the number pool, and double-submissions per round are rejected. `computeScores()` tallies correct decode guesses per team across all rounds.
- **szyfrant_test.js** — Assertion-based tests covering game creation, drawn number validity, round limits, encode/decode with validation, double-submit prevention, state immutability, scoring, and full multi-round game flow. Exits with code 1 on failure.

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
  }, ...],
  scores: [teamA_score, teamB_score]  // computed server-side, included in filtered state
}
```

### Room Structure (server-side)

```
rooms[roomId] = {
  state,              // game state from szyfrant.js
  team_a: Set,        // socket IDs of Team A members
  team_b: Set,        // socket IDs of Team B members
  playerTeams: {}     // playerId -> TEAM_A/TEAM_B (persists across reconnects)
}
```

### Socket.IO Events

Client emits: `game-join-room` (with `{roomId, playerId}`), `game-state`, `game-join-a`, `game-join-b`, `game-new`, `game-start-round`, `game-submit-codednumber`, `game-submit-decodednumber`

Server broadcasts: `game-state` (filtered per team — opponent's `drawn_number` redacted until decode guess submitted, scores included)

## Key Conventions

- Team constants: `TEAM_NONE = -1`, `TEAM_A = 0`, `TEAM_B = 1` (duplicated in both client and server)
- Game state is in-memory only — lost on server restart
- Room ID from URL hash (e.g., `/#myroom`), sanitized to alphanumeric + hyphens, max 32 chars
- Player ID generated client-side, stored in localStorage as `szyfrant-player-id`
- Number pool: 24 permutations of digits 1-4 without repeats (e.g., 123, 412)
- Word pool: 500+ Polish nouns in `szyfrant.js`
- CSS uses `class` attribute (not `className`) throughout JSX
- CSS is responsive with a mobile breakpoint at 480px
- Server port configurable via `PORT` env var (default 3001)
