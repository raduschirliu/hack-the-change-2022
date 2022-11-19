import { ServerResponse, ServerUpdateMessage } from '../types';

import useWebSocket from 'react-use-websocket';

const socketUrl = `ws://${process.env['REACT_APP_API_URL']}/ws`;

export default function DocumentPage() {
  const onMessage = (event: MessageEvent) => {
    // Handle incoming messages here
    // Relevant types are:
    // ServerResponse (for responses to requests)
    // ServerMessageUpdate (for updates to the circuit)
    const data: ServerResponse | ServerUpdateMessage = JSON.parse(event.data);
  };

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    onMessage: onMessage,
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  return <p>doc</p>;
}
