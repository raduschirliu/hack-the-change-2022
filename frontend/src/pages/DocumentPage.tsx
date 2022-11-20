import {
  ClientMessage,
  ClientMessageCreateData,
  ClientMessageUpdateData,
  ServerUpdateMessage,
} from '../types';
import { useEffect, useState } from 'react';

import CircuitCanvas from '../components/circuit-canvas/CircuitCanvas';
import { CircuitSimulation } from '../circuit/circuitSimulation';
import { JsonValue } from 'react-use-websocket/dist/lib/types';
import PartsMenu from '../components/menu/PartsMenu';
import { ToolsMenu } from '../components/menu/ToolsMenu';
import { isServerUpdateMessage } from '../typeGuards';
import { selectUser } from '../app/reducers/user';
import { updateCircuitState } from '../utils';
import { useAppSelector } from '../app/hooks';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { v4 as uuid } from 'uuid';
import { uuidv4 } from '@firebase/util';

let socketUrl = `${process.env['REACT_APP_API_URL']}/ws`;
socketUrl = socketUrl.replace('https', 'ws');
socketUrl = socketUrl.replace('http', 'ws');

export default function DocumentPage() {
  const { documentId } = useParams();
  const user = useAppSelector(selectUser);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      setUserId(await (await user.getIdToken()).substring(0, 10));
    })();
  }, [user]);

  if (documentId === undefined) {
    throw new Error('documentId is undefined');
  }

  const onMessage = (event: MessageEvent) => {
    // Handle incoming messages here
    // Relevant types are:
    // ServerResponse (for responses to requests)
    // ServerMessageUpdate (for updates to the circuit)
    const data: ServerUpdateMessage = JSON.parse(event.data);

    if (!isServerUpdateMessage(data)) {
      console.warn('Message of unknown type', data);
      return;
    }

    console.log('Server Update Message', data);
    if (data.documentId !== documentId) {
      console.error(
        'Server sent message for wrong document',
        data.documentId,
        documentId
      );
      return;
    }

    // TODO: Update circuit elements with those received from the server
  };

  const onOpen = () => {
    console.log('Connected to server');
    const message: ClientMessage = {
      requestId: uuidv4(),
      documentId,
      userId,
      type: 'connect',
      data: {},
    };
    sendJsonMessage(message);
  };

  const updateElement = (update: ClientMessageUpdateData) => {
    const requestId = uuid();
    const message: ClientMessage = {
      requestId,
      documentId,
      userId,
      type: 'update',
      data: update,
    };
    sendJsonMessage(message as unknown as JsonValue); // Websocket lib doesn't like string[] for arrays

    // TODO: Handle storing request until response is received
  };

  const createElement = (data: ClientMessageCreateData) => {
    const requestId = uuid();
    const message: ClientMessage = {
      requestId: requestId,
      documentId: documentId,
      userId: userId,
      type: 'create',
      data: data,
    };
    sendJsonMessage(message as unknown as JsonValue); // Websocket lib doesn't like string[] for arrays

    // TODO: Handle storing request until response is received
  };

  const deleteElement = (elementId: string) => {
    const requestId = uuid();
    const message: ClientMessage = {
      requestId,
      documentId,
      userId,
      type: 'delete',
      data: {
        id: elementId,
      },
    };
    sendJsonMessage(message as unknown as JsonValue); // Websocket lib doesn't like string[] for arrays

    // TODO: Handle storing request until response is received
  };

  const { sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen,
    onMessage,
    // Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  // TODO: Write message sending

  return (
    <>
      <div className="w-screen h-screen overflow-hidden">
        <ToolsMenu documentId={documentId} />
        <div className="grid grid-rows-1 grid-cols-[220px,1fr] w-full h-full">
          <PartsMenu createCallback={createElement} />
          <CircuitCanvas
            updateCallBack={updateElement}
            deleteCallBack={deleteElement}
          />
        </div>
      </div>
    </>
  );
}
