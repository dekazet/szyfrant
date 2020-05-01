var szyfrant = require('./szyfrant');

const express = require('express');
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

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

state = szyfrant.newGame();
team_a = new Set();
team_b = new Set();

function teamFromClient(id) {
  if (team_a.has(id)) {
    log("Mapped client: " + id + " to Team A");
    return TEAM_A;
  }
  if (team_b.has(id)) {
    log("Mapped client: " + id + " to Team B");
    return TEAM_B;
  }
  log("Mapped client: " + id + " to Team None");
  return TEAM_NONE;
}

function sendState(socket) {

  let seenCaller = false;

  team_a.forEach((socketId) => {
    let game_state = Object.assign({}, state, {team : teamFromClient(socketId)});
    log('Sending state to client ' + socketId + " [Team A]");
    io.to(socketId).emit('game-state', game_state );
    //szyfrant.printGame(game_state);
    if (socketId == socket.id) {
      seenCaller = true;
    }
  });


  team_b.forEach((socketId) => {
    let game_state = Object.assign({}, state, {team : teamFromClient(socketId)});
    log('Sending state to client ' + socketId + " [Team B]");
    io.to(socketId).emit('game-state', game_state );
    //szyfrant.printGame(game_state);
    if (socketId == socket.id) {
      seenCaller = true;
    }
  });

  if (!seenCaller) {
    let game_state = Object.assign({}, state, {team : teamFromClient(socket.id)});
    log('Sending state to client  ' + socket.id + " [Team None?]");
    socket.emit('game-state', game_state );    
    //szyfrant.printGame(game_state);
  }
}

io.on('connection', (socket) => {
    log('Client ' + socket.id +  ' connected from ' + socket.request.connection.remoteAddress);

    socket.on('game-state', () => { 
      log('game-state from ' + socket.id);
      sendState(socket);
    });

    socket.on('game-join-a', () => { 
      log('team-join-a from ' + socket.id);
      team_a.add(socket.id);
      team_b.delete(socket.id);
      sendState(socket);
    });

    socket.on('game-join-b', () => { 
      log('team-join-b from ' + socket.id);
      team_a.delete(socket.id);
      team_b.add(socket.id);
      sendState(socket);
    });

    socket.on('game-new', () => { 
      log('game-new from ' + socket.id); 
      state = szyfrant.newGame(); 
      sendState(socket);
    });

    socket.on('game-start-round', () => { 
      log('game-start-round from ' + socket.id); 
      state = szyfrant.startRound(state); 
      sendState(socket);
    });

    socket.on('game-submit-codednumber', (codedNumber) => { 
      log('game-submit-codednumber from ' + socket.id);
      const team = teamFromClient(socket.id);
      if (team == TEAM_NONE) {
        log('Unable to map client to a team');
      } else {
        state = szyfrant.submitCoded(state, team, codedNumber); 
        sendState(socket);
      }
    });

    socket.on('game-submit-decodednumber', (number) => { 
      log('game-submit-decodednumber from ' + socket.id); 
      const team = teamFromClient(socket.id);
      if (team == TEAM_NONE) {
        log('Unable to map client to a team');  
      } else {
        state = szyfrant.submitDecoded(state, team, number); 
        sendState(socket);
      }
    });
    
    socket.on('disconnect', () => {
      log('Client ' + socket.id + ' disconnected');
      team_a.delete(socket.id);
      team_b.delete(socket.id);
    });
});

server.listen(666, () => {log('Szyfrant server up listening at port 666.')});
