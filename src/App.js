import React, {Component} from 'react';
import './App.css';
import io from 'socket.io-client'
var szyfrant = require('./szyfrant');

var gameSample = 
{
  state: 2,
  round: 
  {
    state: 11,
    teams: [
      {
        drawn_number: 411,
        encoded_number: '',
        decoded_number: 0,
        oponnents_number: 0
      },
      {
        drawn_number: 234,
        encoded_number: '',
        decoded_number: 0,
        oponnents_number: 0
      }
    ]
  },
  words: [
    [ 'ZMYWACZ', 'RĘKAWICA', 'SIŁA', 'MIEDŹ' ],
    [ 'FENIKS', 'ZWOJE', 'OLIMP', 'TANIEC' ]
  ],
  tokens: [ [ 0, 0 ], [ 0, 0 ] ],
  round_number: 0,
  past_rounds: []
}

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

class RoundCard extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
    <div class="game-card">
      <div class="game-card-header">
        <div class='game-card-round'>Round {this.props.roundNumber}</div>
        <div class='game-card-guess'>?</div>
        <div class='game-card-number'>$</div>   
      </div>
      <div class="game-card-row">
      <div class='game-card-word'>Kaszanka</div>
        <div class='game-card-guess'>3</div>
        <div class='game-card-number'>4</div>   
      </div>
      <div class="game-card-row">
      <div class='game-card-word'>Zajac</div>
        <div class='game-card-guess'>6</div>
        <div class='game-card-number'>7</div>   
      </div>
      <div class="game-card-row">
      <div class='game-card-word'>Jaja</div>
        <div class='game-card-guess'>6</div>
        <div class='game-card-number'>5</div>   
      </div>
    </div>)
  }
}


class GameBoardKyes extends React.Component {
  constructor(props) {
    super(props)
  }  

  render() {
    const generateHints = this.props.hints.map((hint) => {
      return (<div class="game-board-keys-hint">{hint}</div>);
    });

    return (
    <div class="game-board-keys">
      <div class="game-board-keys-header">{this.props.name}</div>
      {generateHints}
    </div>);
  }
}

class GameBoard extends React.Component {
  constructor(props) {
    super(props)
  }  

  render() {
    return (
    <div class="game-board-with-keys">
      <div class="game-board">
        <RoundCard roundNumber="1"/>
        <RoundCard roundNumber="2"/>
        <RoundCard roundNumber="3"/>
        <RoundCard roundNumber="4"/>
        <RoundCard roundNumber="5"/>
        <RoundCard roundNumber="6"/>
        <RoundCard roundNumber="7"/>
        <RoundCard roundNumber="8"/>
      </div>
      <div class="game-board-hints-row">
        <GameBoardKyes name="#1" hints={["krowa", "jadzia", "maslak"]}/>
        <GameBoardKyes name="#2" hints={["krowa", "jadzia", "maslak"]}/>
        <GameBoardKyes name="#3" hints={["madzia", "jadzia", "maslak"]}/>
        <GameBoardKyes name="#4" hints={["jadzia", "maslak"]}/>
      </div>
    </div>
    );
  }
}

class EncodingForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {codes: ['', '', '']};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(index, event) {
    let codes = this.state.codes.slice();
    codes[index] = event.target.value;
    this.setState({codes : codes})
  }


  handleSubmit(event) {
    log('A code was submitted: ' + this.state.codes);
    event.preventDefault();
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <input type="text" value={this.state.codes[0]} onChange={(event) => {this.handleChange(0, event)}} />
        <input type="text" value={this.state.codes[1]} onChange={(event) => {this.handleChange(1, event)}} />
        <input type="text" value={this.state.codes[2]} onChange={(event) => {this.handleChange(2, event)}} />
        <input type="submit" value="Wyslij wiadomosc" />
       </form>
    );
  }
}

const TEAM_NONE = -1;
const TEAM_A = 0;
const TEAM_B = 1;


class App extends Component {
  constructor() {
    super();
    this.state = {
      connected : false,
      socket : null,
      game_state : null
    }

    this.refreshGameState = this.refreshGameState.bind(this); 
    this.newGame = this.newGame.bind(this); 
    this.startRound = this.startRound.bind(this); 
    this.joinTeamA = this.joinTeamA.bind(this); 
    this.joinTeamB = this.joinTeamB.bind(this); 
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
      this.state.socket.emit('game-state');
    })

    socket.on('game-state', (game_state) => { 
      log('Received game state ' + game_state);
      this.setState({game_state : game_state}); 
    });

    log('Created socket');
    this.setState({socket : socket});
  }

    refreshGameState() {
      this.state.socket.emit('game-state');
    }

    newGame() {
      this.state.socket.emit('game-new');     
    }

    startRound() {
      this.state.socket.emit('game-start-round');     
    }

    joinTeamA() {
      this.state.socket.emit('game-join-a');     
    }

    joinTeamB() {
      this.state.socket.emit('game-join-b');     
    }
//        <div className="sampleEntry">
//         <CodeEntryForm />
//      </div>

  showGameBoard() {
    if (!this.state.connected) {
      return false;
    }

    if (this.state.game_state == null) {
      return false;
    }

    if (this.state.game_state.team == TEAM_NONE) {
      return false;
    }

    return true;
  }

  genGameHeader() {
    log('Rendering game header');

    if (!this.state.connected) {
      return(<div>Connecting...</div>);
    }

    if (this.state.game_state == null) {
      return(<div>Refreshing game state...</div>);
    }

    if (this.state.game_state.team == TEAM_NONE) {
      return(
        <div>
          <button onClick={this.joinTeamA}>Join team A</button>
          <button onClick={this.joinTeamB}>Join team B</button>
        </div>
      );
    }
    let team = "TeamA";
    if (this.state.game_state.team == TEAM_B) {
      team = "TeamB";
    }
    
    return (
    <div class="game-statusbar">
      <div>{team}</div>
      <button onClick={this.newGame}>Start new game</button>
      <button onClick={this.refreshGameState}>Refresh game state</button>
      <button onClick={this.startRound}>Start the round</button>     
      <div>Round: {this.state.game_state.round_number + 1}</div>
    </div>);
  }

  genWordsBar() {
    if (  !this.state.game_state 
          || this.state.game_state.team == -1){
      return (<div></div>);
    }
    const words = this.state.game_state.words[this.state.game_state.team].map((word, index) => {
      return (<div class="game-wordsbar-word">{index + 1}: {word}</div>);
    });
  return (<div class="game-wordsbar">{words}</div>);
  }

  render() {
    log('Rendering app');

    const gameHeader = this.genGameHeader();
    const wordsBar = this.genWordsBar();

    if (this.showGameBoard()) {
      return (
        <div class="game-main">
          {gameHeader}
          {wordsBar}
          <GameBoard />
        </div>
      );
    } else {
      return (
        <div class="game-main">
          {gameHeader}
        </div>);
    }

    const showEncodingForm = true;
    
    return (
      <div>
        <div> {showEncodingForm ? <EncodingForm /> : null }</div>
      </div>
    );
  }
}

export default App;
