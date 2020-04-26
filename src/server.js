const express = require('express');
const http = require('http')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

function timeStamp() {
    // Create a date object with the current time
      var now = new Date();
    
    // Create an array with the current month, day and time
      var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
    
    // Create an array with the current hour, minute and second
      var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
    
    // Determine AM or PM suffix based on the hour
      var suffix = ( time[0] < 12 ) ? "AM" : "PM";
    
    // Convert hour from military time
      time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
    
    // If hour is 0, set it to 12
      time[0] = time[0] || 12;
    
    // If seconds and minutes are less than 10, add a zero
      for ( var i = 1; i < 3; i++ ) {
        if ( time[i] < 10 ) {
          time[i] = "0" + time[i];
        }
      }
    
    // Return the formatted string
      return "[" + date.join("/") + " " + time.join(":") + " " + suffix + "]";
}

function log(str) {
    console.log(timeStamp() + ' ' + str);
}

game_state = { 
    words : [['', '', '', ''], ['', '', '', '']],
    score : [[0, 0], [0, 0]],
    round_number : 0,
    rounds : []
}

io.on('connection', (socket) => {
    log('Client ' + socket.id +  ' connected from ' + socket.request.connection.remoteAddress);
    socket.on('game-state', () => { log('Client request a game state'); socket.emit('game-state', game_state );});
    socket.on('disconnect', () => {log('Client disconnected')});
});

server.listen(666, () => {log('Szyfrant server up listening at port 666.')});
