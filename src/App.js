import React, {Component} from 'react';
import './App.css';
import io from 'socket.io-client'

class CodeEntryForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {codes: ['', '', '']};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleChange(codeIndex, event) {
    const codes = this.state.codes.slice();
    codes[codeIndex] = event.target.value;
    this.setState({codes : codes})
  }


  handleSubmit(event) {
    console.log('A code was submitted: ' + this.state.codes);
    event.preventDefault();
  }

  render() {
    return(
      <form onSubmit={this.handleSubmit}>
        <ol>
        <li>
          <input type="text" value={this.state.codes[0]} onChange={(event) => {this.handleChange(0, event)}} />
        </li>
        <li>  
          <input type="text" value={this.state.codes[1]} onChange={(event) => {this.handleChange(1, event)}} />
        </li>
        <li>
          <input type="text" value={this.state.codes[2]} onChange={(event) => {this.handleChange(2, event)}} />
        </li> 
       </ol>
       <input type="submit" value="Submit" />
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
      game_status : null
    }

    this.getGameState = this.getGameState.bind(this); 
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
        console.log('Disconnected from the server');
        this.setState({connected : false});
      })

    socket.on('connect', () => {
      console.log('Connected to the server');
      this.setState({connected : true});
    })

    socket.on('game-state', (game_state) => { 
      console.log('Received game state ' + game_state);
      this.setState({game_state : game_state}); 
    });

    console.log('Created socket');
    this.setState({socket : socket});
  }

  getGameState() {
    console.log('Requesting game state');
    this.state.socket.emit('game-state');
  }

//        <div className="sampleEntry">
//         <CodeEntryForm />
//      </div>

  render() {
    console.log('Rendering app');
    let status = 'connected :)';
    if (!this.state.connected) {
      status = 'connecting :('
    }

    return (
      <div>
        <div>Connection status - {status}</div>
        <button onClick={this.getGameState}>Get game state</button>
      </div>
    );
  }
}

export default App;
