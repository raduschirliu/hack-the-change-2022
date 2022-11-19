import {
  CircuitElement,
  ConnectMessage,
  ServerResponse,
  ServerUpdateMessage,
} from '../types';

import CircuitCanvas from '../components/circuit-canvas/CircuitCanvas';
import { isServerResponse } from '../typeGuards';
import { updateCircuitState } from '../utils';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';

const socketUrl = `ws://${process.env['REACT_APP_API_URL']}/ws`;

export default function DocumentPage() {
  const { documentId } = useParams();

  if (documentId === undefined) {
    throw new Error('documentId is undefined');
  }

  const [circuitState, setCircuitState] = useState<CircuitElement[]>([]);

  const onMessage = (event: MessageEvent) => {
    // Handle incoming messages here
    // Relevant types are:
    // ServerResponse (for responses to requests)
    // ServerMessageUpdate (for updates to the circuit)
    const data: ServerResponse | ServerUpdateMessage = JSON.parse(event.data);

    if (isServerResponse(data)) {
      // Handle response
    } else {
      if (data.documentId !== documentId) {
        return;
      }
      setCircuitState((state) => {
        return updateCircuitState(state, data.elements);
      });
    }
  };

  const onOpen = () => {
    console.log('Connected to server');
    const message: ConnectMessage = {
      type: 'connect',
      documentId,
      userId: 'webbrothers', // TODO: Replace with actual user id from store
    };
    sendJsonMessage(message);
  };

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen,
    onMessage,
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  return (
    <div>
      <CircuitCanvas circuitState={circuitState} />
    </div>
  );
}
