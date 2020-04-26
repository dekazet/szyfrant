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

  componentDidMount = () => {
  }

  joinGame() {
    const socket = io('http://localhost:3000', {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttemps: 10,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false
    });  
  socket.emit('join');
  console.log('Socket: ' + socket.id);
}


//        <div className="sampleEntry">
//         <CodeEntryForm />
//      </div>

  render() {
    return (
      <div>
        <button onClick={this.joinGame}>Join game</button>
      </div>
    );
  }
}

export default App;
