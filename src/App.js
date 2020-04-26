import React, {Component} from 'react';
import './App.css';
import io from 'socket.io-client'
var szyfrant = require('./szyfrant');

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

class EntryForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {codes: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(event) {
    this.setState({codes : event.target.value})
  }


  handleSubmit(event) {
    log('A code was submitted: ' + this.state.codes);
    event.preventDefault();
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.codes} onChange={(event) => {this.handleChange(event)}} />
        <input type="submit" value="Nadaj kod" />
       </form>
    );
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      connected : false,
      socket : null,
      game_state : null,
      team : 0
    }

    this.refreshGameState = this.refreshGameState.bind(this); 
    this.newGame = this.newGame.bind(this); 
    this.startRound = this.startRound.bind(this); 
  }

  componentDidMount = () => {
      const socket = io('http://localhost:3000', {
        forceNew : true,
        reconnectionDelay: 1000,
        reconnection: true,
        reconnectionAttemps: 10,
        transports: ['websocket'],
        agent: false,
        upgrade: false,
        rejectUnauthorized: false
      });

    socket.on('disconnect', () => {
        log('Disconnected from the server');
        this.setState({connected : false});
      })

    socket.on('connect', () => {
      log('Connected to the server');
      this.setState({connected : true});
    })

    socket.on('game-state', (game_state) => { 
      log('Received game state ' + game_state);
      this.setState({game_state : game_state}); 
    });

    log('Created socket');
    this.setState({socket : socket});
  }

    refreshGameState() {
      log('Requesting game state');
      this.state.socket.emit('game-state');
    }

    newGame() {
      log('Requesting new game');
      this.state.socket.emit('game-new');     
    }

    startRound() {
      log('Requesting round start');
      this.state.socket.emit('game-start-round');     
    }

//        <div className="sampleEntry">
//         <CodeEntryForm />
//      </div>

  render() {
    log('Rendering app');
    
    if (!this.state.connected) {
      return(<div>Connecting...</div>);
    }

    if (this.state.game_state == null) {
      return(<div>Refreshing game state...</div>);
    }

    const words1 = this.state.game_state.words[0].map((word) => {
        return (<li>{word}</li>);
    }
    );

    const words2 = this.state.game_state.words[1].map((word) => {
      return (<li>{word}</li>);
    }
    );


    return (
      <div>
        <button onClick={this.newGame}>Start new game</button>
        <button onClick={this.refreshGameState}>Refresh game state</button>
        <div><ol>{words1}</ol></div>
        <div><ol>{words2}</ol></div>
        <button onClick={this.startRound}>Start the round</button>
      </div>
    );
  }
}

export default App;
