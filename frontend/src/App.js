import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Products from './components/Products';

class App extends Component{

  render() {
    return (
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <p>
              Mission impossible
            </p>
          </header>
          <Products/>
        </div>
    );
  }
}

export default App;
