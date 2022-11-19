import React, { useState } from 'react';
import logo from '../../res/logo.svg';
import { Counter } from '../counter/Counter';
import './App.css';

const API_URL = process.env['REACT_APP_API_URL'];

function App() {
  console.log(API_URL);

  const [ws, setWs] = useState(new WebSocket(`ws://${API_URL}/ws`));

  ws.addEventListener('open', () => {
    console.log('websock opened');

    ws.send('hello fellow web brother');
  });

  ws.addEventListener('message', (data: any) => {
    console.log('got msg', data);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="text-red-500 font-bold hover:text-red-200"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}

export default App;