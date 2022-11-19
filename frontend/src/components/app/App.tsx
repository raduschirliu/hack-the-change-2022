import './App.css';

import { Counter } from '../counter/Counter';
import logo from '../../res/logo.svg';
import useWebSocket from 'react-use-websocket';


const API_URL = process.env['REACT_APP_API_URL'];

function App() {
  console.log(API_URL);
  const socketUrl = 'ws://' + API_URL + '/ws';

  const onMessage = (event: MessageEvent) => {
    console.log('got msg', event);
  };

  const { sendMessage, sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: onMessage,
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  return (
    <div className="App">

    </div>
  );
}

export default App;
