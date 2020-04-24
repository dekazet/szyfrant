import React from 'react';
import logo from './logo.svg';
import './App.css';

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
    alert('A code was submitted: ' + this.state.codes);
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


function App() {
  return (
    <div className="sampleEntry">
      <CodeEntryForm />
    </div>
  );
}

export default App;
