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

game_state = szyfrant.newGame();

io.on('connection', (socket) => {
    log('Client ' + socket.id +  ' connected from ' + socket.request.connection.remoteAddress);
    socket.emit('game-state', game_state );
    socket.on('game-state', () => { log('game-state from ' + socket.id); socket.emit('game-state', game_state );});
    socket.on('game-new', () => { log('game-new from ' + socket.id); game_state = szyfrant.newGame(); socket.emit('game-state', game_state );});
    socket.on('game-start-round', () => { log('game-start-round from ' + socket.id); game_state = szyfrant.startRound(game_state); socket.emit('game-state', game_state );});
    socket.on('disconnect', () => {log('Client ' + socket.id + ' disconnected')});
});

server.listen(666, () => {log('Szyfrant server up listening at port 666.')});
