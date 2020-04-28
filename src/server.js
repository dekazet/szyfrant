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

state = szyfrant.newGame();
team_a = new Set();
team_b = new Set();

function teamFromClient(id) {
  if (team_a.has(id)) {
    return 0;
  }
  if (team_b.has(id)) {
    return 1;
  }
  return -1;
}

function sendState(socket) {
  let game_state = Object.assign({}, state, {team : teamFromClient(socket.id)});  
  socket.emit('game-state', game_state );
  log('Sending state to client ' + socket.id);
  szyfrant.printGame(game_state);
}

io.on('connection', (socket) => {
    log('Client ' + socket.id +  ' connected from ' + socket.request.connection.remoteAddress);

    socket.on('game-state', () => { 
      log('game-state from ' + socket.id);
      sendState(socket);
    });

    socket.on('game-join-a', () => { 
      log('team-join-a from' + socket.id);
      team_a.add(socket.id);
      team_b.delete(socket.id);
      sendState(socket);
    });

    socket.on('game-join-b', () => { 
      log('team-join-b from' + socket.id);
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

    socket.on('game-submit-codednumber', (team, codedNumber) => { 
      log('game-submit-codednumber from ' + socket.id); 
      state = szyfrant.submitCoded(state, team, codedNumber); 
      sendState(socket);
    });

    socket.on('game-submit-decodednumber', (team, number) => { 
      log('game-submit-decodednumber from ' + socket.id); 
      state = szyfrant.submitDecoded(state, team, number); 
      sendState(socket);
    });
    
    socket.on("*",function(event,data) {
      log('catch-all from ' + socket.id); 
      log(event); 
      log(data); 
  });

    socket.on('disconnect', () => {
      log('Client ' + socket.id + ' disconnected');
    });
});

server.listen(666, () => {log('Szyfrant server up listening at port 666.')});
