import {
  CircuitElement,
  ClientMessage,
  ConnectMessage,
  CreateData,
  ServerResponse,
  ServerUpdateMessage,
  UpdateData,
} from '../types';
import { isServerResponse, isServerUpdateMessage } from '../typeGuards';

import CircuitCanvas from '../components/circuit-canvas/CircuitCanvas';
import { JsonValue } from 'react-use-websocket/dist/lib/types';
import { updateCircuitState } from '../utils';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { v4 as uuid } from 'uuid';
import { PartsMenu } from '../components/menu/PartsMenu';
import { ToolsMenu } from '../components/menu/ToolsMenu';

let socketUrl = `${process.env['REACT_APP_API_URL']}/ws`;
socketUrl = socketUrl.replace('https', 'ws');
socketUrl = socketUrl.replace('http', 'ws');

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
    const data: ServerResponse | ServerUpdateMessage | unknown = JSON.parse(
      event.data
    );

    if (isServerResponse(data)) {
      // Handle response
    } else if (isServerUpdateMessage(data)) {
      if (data.documentId !== documentId) {
        return;
      }
      setCircuitState((state) => {
        return updateCircuitState(state, data.elements);
      });
    } else {
      console.warn('Message of unknown type', data);
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

  const updateElement = (element: CircuitElement, update: UpdateData) => {
    const requestId = uuid();
    const message: ClientMessage = {
      requestId,
      documentId,
      userId: 'webbrothers', // TODO: Replace with actual user id from store
      type: 'update',
      targetId: element.id,
      data: update,
    };
    sendJsonMessage(message as unknown as JsonValue); // Websocket lib doesn't like string[] for arrays

    // TODO: Handle storing request until response is received
  };

  const createElement = (element: CreateData) => {
    const requestId = uuid();
    const message: ClientMessage = {
      requestId,
      documentId,
      userId: 'webbrothers', // TODO: Replace with actual user id from store
      type: 'create',
      data: element,
    };
    sendJsonMessage(message as unknown as JsonValue); // Websocket lib doesn't like string[] for arrays

    // TODO: Handle storing request until response is received
  };

  const deleteElement = (elementId: string) => {
    const requestId = uuid();
    const message: ClientMessage = {
      requestId,
      documentId,
      userId: 'webbrothers', // TODO: Replace with actual user id from store
      type: 'delete',
      targetId: elementId,
    };
    sendJsonMessage(message as unknown as JsonValue); // Websocket lib doesn't like string[] for arrays

    // TODO: Handle storing request until response is received
  };

  return (
    <div className="w-screen h-screen overflow-hidden">
      <ToolsMenu documentId={documentId} />
      <div className="grid grid-rows-1 grid-cols-[220px,1fr] w-full h-full">
        <PartsMenu />
        <CircuitCanvas circuitState={circuitState} />
      </div>
    </div>
  );
}
