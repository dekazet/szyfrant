var szyfrant = require('./szyfrant');
const path = require('path');
const express = require('express');
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)
app.use(express.static(path.join(__dirname, 'build')));

function timeStamp() {
  var now = new Date();
  var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
  var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
  var suffix = ( time[0] < 12 ) ? "AM" : "PM";
  time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
  time[0] = time[0] || 12;
  for ( var i = 1; i < 3; i++ ) {
    if ( time[i] < 10 ) {
      time[i] = "0" + time[i];
    }
  }
  return "[" + date.join("/") + " " + time.join(":") + " " + suffix + "]";
}

function log(str) {
  console.log(timeStamp() + ' ' + str);
}

const TEAM_NONE = -1;
const TEAM_A = 0;
const TEAM_B = 1;

// Room-based game state: each room has its own game, team sets
var rooms = {};
var socketToRoom = {};
var socketToPlayer = {};

function getOrCreateRoom(roomId) {
  if (!rooms[roomId]) {
    log('Creating new room: ' + roomId);
    rooms[roomId] = {
      state: szyfrant.newGame(),
      team_a: new Set(),
      team_b: new Set(),
      playerTeams: {}
    };
  }
  return rooms[roomId];
}

function getRoomForSocket(socketId) {
  var roomId = socketToRoom[socketId];
  if (!roomId || !rooms[roomId]) {
    return null;
  }
  return rooms[roomId];
}

function teamFromClient(room, id) {
  if (room.team_a.has(id)) {
    return TEAM_A;
  }
  if (room.team_b.has(id)) {
    return TEAM_B;
  }
  return TEAM_NONE;
}

function filterStateForTeam(gameState, viewingTeam) {
  if (viewingTeam === TEAM_NONE) {
    return Object.assign({}, gameState, {team: TEAM_NONE});
  }

  var otherTeam = viewingTeam === TEAM_A ? TEAM_B : TEAM_A;

  var filteredRounds = gameState.rounds.map(function(round) {
    var ourTeamData = round.teams[viewingTeam];
    var otherTeamData = round.teams[otherTeam];

    // Redact opponent's drawn_number until our team has submitted a decode guess
    var filteredOtherTeam = Object.assign({}, otherTeamData);
    if (!ourTeamData.decoded_number) {
      filteredOtherTeam.drawn_number = 0;
    }

    var teams = [];
    teams[viewingTeam] = ourTeamData;
    teams[otherTeam] = filteredOtherTeam;

    return Object.assign({}, round, {teams: teams});
  });

  return Object.assign({}, gameState, {
    team: viewingTeam,
    rounds: filteredRounds,
    scores: szyfrant.computeScores(gameState)
  });
}

function sendState(room, socket) {

  let seenCaller = false;

  room.team_a.forEach((socketId) => {
    let game_state = filterStateForTeam(room.state, TEAM_A);
    io.to(socketId).emit('game-state', game_state);
    if (socketId == socket.id) {
      seenCaller = true;
    }
  });

  room.team_b.forEach((socketId) => {
    let game_state = filterStateForTeam(room.state, TEAM_B);
    io.to(socketId).emit('game-state', game_state);
    if (socketId == socket.id) {
      seenCaller = true;
    }
  });

  if (!seenCaller) {
    let game_state = filterStateForTeam(room.state, TEAM_NONE);
    socket.emit('game-state', game_state);
  }
}

io.on('connection', (socket) => {
    log('Client ' + socket.id +  ' connected from ' + socket.request.connection.remoteAddress);

    socket.on('game-join-room', (data) => {
      var roomId = (data && data.roomId) || 'default';
      var playerId = (data && data.playerId) || '';

      // Sanitize room ID: alphanumeric + hyphens, max 32 chars
      if (typeof roomId !== 'string') roomId = 'default';
      roomId = roomId.replace(/[^a-zA-Z0-9\-]/g, '').substring(0, 32) || 'default';

      // Sanitize player ID: alphanumeric + hyphens, max 36 chars
      if (typeof playerId !== 'string') playerId = '';
      playerId = playerId.replace(/[^a-zA-Z0-9\-]/g, '').substring(0, 36);

      log('Client ' + socket.id + ' (player ' + playerId + ') joining room: ' + roomId);

      // Leave previous room if any
      var prevRoom = getRoomForSocket(socket.id);
      if (prevRoom) {
        prevRoom.team_a.delete(socket.id);
        prevRoom.team_b.delete(socket.id);
      }

      socketToRoom[socket.id] = roomId;
      socketToPlayer[socket.id] = playerId;
      var room = getOrCreateRoom(roomId);

      // Restore team membership if player was previously in this room
      if (playerId && room.playerTeams[playerId] === TEAM_A) {
        log('Restoring player ' + playerId + ' to Team A');
        room.team_a.add(socket.id);
      } else if (playerId && room.playerTeams[playerId] === TEAM_B) {
        log('Restoring player ' + playerId + ' to Team B');
        room.team_b.add(socket.id);
      }

      sendState(room, socket);
    });

    socket.on('game-state', () => {
      var room = getRoomForSocket(socket.id);
      if (!room) return;
      sendState(room, socket);
    });

    socket.on('game-join-a', () => {
      var room = getRoomForSocket(socket.id);
      if (!room) return;
      log('team-join-a from ' + socket.id);
      room.team_a.add(socket.id);
      room.team_b.delete(socket.id);
      var playerId = socketToPlayer[socket.id];
      if (playerId) room.playerTeams[playerId] = TEAM_A;
      sendState(room, socket);
    });

    socket.on('game-join-b', () => {
      var room = getRoomForSocket(socket.id);
      if (!room) return;
      log('team-join-b from ' + socket.id);
      room.team_a.delete(socket.id);
      room.team_b.add(socket.id);
      var playerId = socketToPlayer[socket.id];
      if (playerId) room.playerTeams[playerId] = TEAM_B;
      sendState(room, socket);
    });

    socket.on('game-new', () => {
      var room = getRoomForSocket(socket.id);
      if (!room) return;
      log('game-new from ' + socket.id);
      if (teamFromClient(room, socket.id) == TEAM_NONE) {
        log('Rejected game-new from unjoined client');
        return;
      }
      room.state = szyfrant.newGame();
      sendState(room, socket);
    });

    socket.on('game-start-round', () => {
      var room = getRoomForSocket(socket.id);
      if (!room) return;
      log('game-start-round from ' + socket.id);
      if (teamFromClient(room, socket.id) == TEAM_NONE) {
        log('Rejected game-start-round from unjoined client');
        return;
      }
      room.state = szyfrant.startRound(room.state);
      sendState(room, socket);
    });

    socket.on('game-submit-codednumber', (codedNumber) => {
      var room = getRoomForSocket(socket.id);
      if (!room) return;
      log('game-submit-codednumber from ' + socket.id);
      const team = teamFromClient(room, socket.id);
      if (team == TEAM_NONE) {
        log('Unable to map client to a team');
      } else {
        room.state = szyfrant.submitCoded(room.state, team, codedNumber);
        sendState(room, socket);
      }
    });

    socket.on('game-submit-decodednumber', (number) => {
      var room = getRoomForSocket(socket.id);
      if (!room) return;
      log('game-submit-decodednumber from ' + socket.id);
      const team = teamFromClient(room, socket.id);
      if (team == TEAM_NONE) {
        log('Unable to map client to a team');
      } else {
        room.state = szyfrant.submitDecoded(room.state, team, number);
        sendState(room, socket);
      }
    });

    socket.on('disconnect', () => {
      log('Client ' + socket.id + ' disconnected');
      var room = getRoomForSocket(socket.id);
      if (room) {
        room.team_a.delete(socket.id);
        room.team_b.delete(socket.id);
      }
      delete socketToRoom[socket.id];
      delete socketToPlayer[socket.id];
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {log('Szyfrant server up listening at port ' + PORT + '.')});
