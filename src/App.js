import React from 'react';
import './App.css';
import io from 'socket.io-client'

const TEAM_NONE = -1;
const TEAM_A = 0;
const TEAM_B = 1;

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
  //console.log(JSON.stringify(str, null, 4));
}

//
// Round card
//
class RoundCardRow extends React.Component {
  render() {
    return (
      <div class="game-card-row">
      <div class='game-card-word'>{this.props.word}</div>
        <div class='game-card-box'>{this.props.guess}</div>
        <div class='game-card-box'>{this.props.number}</div>   
      </div>
    );
  }
}

class RoundCardRowLight extends React.Component {
  render() {
    return (
      <div class="game-card-row-light">
      <div class='game-card-word'>{this.props.word}</div>
        <div class='game-card-box'>{this.props.guess}</div>
        <div class='game-card-box'>{this.props.number}</div>   
      </div>
    );
  }
}

class RoundCardHeaderRow extends React.Component {
  render() {
    const floppy = '\u25a0';
    return (
      <div class="game-card-header">
        <div class='game-card-word'>Runda 0{this.props.roundNumber}</div>
        <div class='game-card-box'>?</div>
        <div class='game-card-box'>{floppy}</div>   
      </div>
    );
  }
}

class RoundCard extends React.Component {
  render() {
    return(
    <div class="game-card">
      <RoundCardHeaderRow roundNumber={this.props.roundNumber} />
      <RoundCardRowLight word={this.props.words[0]} guess={this.props.guesses[0]} number={this.props.numbers[0]} />
      <RoundCardRow word={this.props.words[1]} guess={this.props.guesses[1]} number={this.props.numbers[1]} />
      <RoundCardRowLight word={this.props.words[2]} guess={this.props.guesses[2]} number={this.props.numbers[2]} />
    </div>)
  }
}

// Opennents hints
class GameBoardKyes extends React.Component {
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

//
// Game board
//
class GameBoard extends React.Component {
  generateRoundCard(i) {
    return (<RoundCard roundNumber={i+1} words={this.props.board_state.words[i]} guesses={this.props.board_state.guesses[i]} numbers={this.props.board_state.numbers[i]}/>);
  }
  
  render() {
    return (    
      <div class="game-board">
        <div class="game-board-row">
          {this.generateRoundCard(0)}
          {this.generateRoundCard(1)}
          </div>
        <div class="game-board-row">
          {this.generateRoundCard(2)}
          {this.generateRoundCard(3)}
        </div>
        <div class="game-board-row">
          {this.generateRoundCard(4)}
          {this.generateRoundCard(5)}
          </div>
        <div class="game-board-row">
          {this.generateRoundCard(6)}
          {this.generateRoundCard(7)}
        </div>
      </div>
    );
  }
}

class HintsBoard extends React.Component {
  render() {
    return(
      <div class="game-board-hints">
        <GameBoardKyes name="Klucz #1" hints={this.props.hints[0]}/>
        <GameBoardKyes name="Klucz #2" hints={this.props.hints[1]}/>
        <GameBoardKyes name="Klucz #3" hints={this.props.hints[2]}/>
        <GameBoardKyes name="Klucz #4" hints={this.props.hints[3]}/>
      </div>
    );
  }
}

//
// Input form
//
class CodeEntryForm extends React.Component {

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
    this.props.socket.emit('game-submit-codednumber', this.state.codes);
    this.setState({codes : ['', '', '']});
  }

  render() {
    return(
      <div class="code-entry-form">
        <form onSubmit={this.handleSubmit}>
          <div><input class="code-entry-field" type="text" value={this.state.codes[0]} onChange={(event) => {this.handleChange(0, event)}} /></div>
          <div><input class="code-entry-field" type="text" value={this.state.codes[1]} onChange={(event) => {this.handleChange(1, event)}} /></div>
          <div><input class="code-entry-field" type="text" value={this.state.codes[2]} onChange={(event) => {this.handleChange(2, event)}} /></div>
          <div><input class="code-entry-button" type="submit" value="Zaszyfruj numer" /></div>
        </form>
      </div>
    );
  }
}

class NumberEntryForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {number: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({number : event.target.value})
  }

  handleSubmit(event) {
    log('A number was submitted: ' + this.state.number);
    event.preventDefault();
    this.props.socket.emit('game-submit-decodednumber', this.state.number);
    this.setState({number : ''});
  }

  render() {
    return(
      <div class="code-entry-form">
        <form onSubmit={this.handleSubmit}>
          <div><input class="code-entry-field" type="text" value={this.state.number} onChange={this.handleChange} /></div>
          <div><input class="code-entry-button" type="submit" value="Odszyfruj numer" /></div>
        </form>
      </div>
    );
  }
}


class CodeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {      
      display : 'Pokaz numer!',
      showingNumber : false,
      lastClick : new Date()
    };
  }

  onClick() {
    var now = new Date();
    const delta = now - this.state.lastClick;

    if (!this.state.showingNumber && delta < 500) {
      const newText = this.props.numer;
      this.setState({lastClick : now, display : newText, showingNumber : true});
      setTimeout(this.onClick.bind(this), 2000);
      return;
    } 

    if (this.state.showingNumber) {
      this.setState({lastClick : now, showingNumber : false, display : 'Pokaz numer!'});
      return;
    }

    this.setState({lastClick : now});
  }

  render() {
    return (<button class="game-infobar-button" onClick={this.onClick.bind(this)}>{this.state.display}</button>);
  }
}

class App extends React.Component {
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
    //const socket = io('http://szyfrant.kozlowscy.us:666');
    const socket = io('http://localhost:3000');

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

  showGameBoard() {
    if (!this.state.connected) {
      return false;
    }

    if (this.state.game_state == null) {
      return false;
    }

    if (this.state.game_state.team === TEAM_NONE) {
      return false;
    }

    return true;
  }

  genGameHeader() {
    if (!this.state.connected) {
      return(<div>:( Connecting to the game server...</div>);
    }

    if (this.state.game_state == null) {
      return(<div>Refreshing game state...</div>);
    }

    if (this.state.game_state.team === TEAM_NONE) {
      return(
        <div class="game-join-buttons">
          <button class="game-infobar-button" onClick={this.joinTeamA}>Druzyna: A</button>
          <button class="game-infobar-button" onClick={this.joinTeamB}>Druzyna: AA</button>
        </div>
      );
    }
    let team = "Druzyna: A";
    if (this.state.game_state.team === TEAM_B) {
      team = "Druzyna: AA";
    }
    
    let drawnNumber = 0;
    if (this.state.game_state) {
      const rounds = this.state.game_state.rounds;
      const round = rounds[rounds.length - 1];
      const team = round.teams[this.state.game_state.team];
      drawnNumber = team.drawn_number;
    }

    return (
    <div class="game-statusbar">
      <div class="game-infobar-text">{team}</div>
      <div class="game-infobar-text">Runda: 0{this.state.game_state.rounds.length}</div>
      <button class="game-infobar-button" onClick={this.newGame}>Nowa gra</button>
      <button class="game-infobar-button" onClick={this.startRound}>Nastepna runda</button>
      <CodeButton numer={drawnNumber}/>
    </div>);
  }

  genWordsBar() {
    if (  !this.state.game_state 
          || this.state.game_state.team === TEAM_NONE){
      return (<div></div>);
    }
    const words = this.state.game_state.words[this.state.game_state.team].map((word, index) => {
      return (<div class="game-wordsbar-word">{index + 1}: {word}</div>);
    });
  return (<div class="game-wordsbar">{words}</div>);
  }

  digits

  genBoardState() {
    let i = 0;
    let words = Array(8);
    for (i = 0; i < 8; i++) {
      words[i] = Array(3).fill([' ']);
    }

    let numbers = Array(8);
    for (i = 0; i < 8; i++) {
      numbers[i] = Array(3).fill([' ']);
    }

    let guesses = Array(8);
    for (i = 0; i < 8; i++) {
      guesses[i] = Array(3).fill([' ']);
    }

    let hints = Array(4);
    for (i = 0; i < 4; i++) {
      hints[i] = [];
    }

    let our_hints = Array(4);
    for (i = 0; i < 4; i++) {
      our_hints[i] = [];
    }

    if (this.state.game_state && this.state.game_state.team !== TEAM_NONE) {

      const ourTeam = this.state.game_state.team;
      let otherTeam = TEAM_B;
      if (ourTeam === TEAM_B) {
        otherTeam = TEAM_A;
      }
      
      const rounds = this.state.game_state.rounds;
      if (rounds) {
        for (i = 0; i < rounds.length; i++) {
          words[i] = rounds[i].teams[ourTeam].encoded_number.slice();
         
          if (rounds[i].teams[ourTeam].decoded_number) {
            guesses[i] = (""+rounds[i].teams[ourTeam].decoded_number).split("");          
            numbers[i] = (""+rounds[i].teams[ourTeam].drawn_number).split("");          
          }

          var j;

          // if another team posted the guess assign hints to hint buckets
          if (rounds[i].teams[otherTeam].decoded_number) {
            const hintBuckets = (""+rounds[i].teams[otherTeam].drawn_number).split("");          
            log(hintBuckets);
            for (j = 0; j < 3; j++) {
              hints[hintBuckets[j] - 1].push(rounds[i].teams[otherTeam].encoded_number[j]);
            }            
            
          // if our team posted the guess assign hints to hint buckets
          if (rounds[i].teams[ourTeam].decoded_number) {
            const hintBuckets = (""+rounds[i].teams[ourTeam].drawn_number).split("");          
            log(hintBuckets);
            for (j = 0; j < 3; j++) {
              our_hints[hintBuckets[j] - 1].push(rounds[i].teams[ourTeam].encoded_number[j]);
            }            
          }
        }
        }
      }
    }

    return ({
      words : words,
      numbers : numbers,
      guesses : guesses,
      hints : hints,
      our_hints : our_hints
    });
  }

  render() {
    log('Rendering app');
    
    const gameHeader = this.genGameHeader();
    const wordsBar = this.genWordsBar();
    const boardState = this.genBoardState();
    
    if (this.showGameBoard()) {
      return (
        <div class="game-main">
          <div class="game-titlebar"><h2>S Z Y F R A N T</h2></div>
          {gameHeader}
          {wordsBar}
          <HintsBoard hints={boardState.our_hints}/>
          <GameBoard board_state={boardState}/>
          <HintsBoard hints={boardState.hints}/>
          <div class="game-inputbar">
            <CodeEntryForm socket={this.state.socket}/>
            <NumberEntryForm socket={this.state.socket}/>
          </div>
        </div>
      );
    } else {
      return (
        <div class="game-main">
          <div class="game-titlebar"><h2>S Z Y F R A N T</h2></div>
          {gameHeader}
        </div>);
    }
  }
}

export default App;
