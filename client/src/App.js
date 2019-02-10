import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Randomizer from './pages/RandomRestaurant';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Randomizer/>
      </div>
    );
  }
}

export default App;
