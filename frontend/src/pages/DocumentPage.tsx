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
import { useEffect, useState } from 'react';

import CircuitCanvas from '../components/circuit-canvas/CircuitCanvas';
import { CircuitSimulation } from '../circuit/circuitSimulation';
import { JsonValue } from 'react-use-websocket/dist/lib/types';
import { PartsMenu } from '../components/menu/PartsMenu';
import { ToolsMenu } from '../components/menu/ToolsMenu';
import { selectUser } from '../app/reducers/user';
import { updateCircuitState } from '../utils';
import { useAppSelector } from '../app/hooks';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { v4 as uuid } from 'uuid';

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
      console.log('Server Response', data);
    } else if (isServerUpdateMessage(data)) {
      console.log('Server Update Message', data);
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
      userId,
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
      userId,
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
      requestId: requestId,
      documentId: documentId,
      userId: userId,
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
      userId,
      type: 'delete',
      targetId: elementId,
    };
    sendJsonMessage(message as unknown as JsonValue); // Websocket lib doesn't like string[] for arrays

    // TODO: Handle storing request until response is received
  };

  const onPlayClick = () => {
    const simulation = new CircuitSimulation();
    const solution = simulation.solve();
    console.log(solution);
  };

  return (
    <>
      <div className="w-screen h-screen overflow-hidden">
        <ToolsMenu documentId={documentId} onPlayClick={onPlayClick} />
        <div className="grid grid-rows-1 grid-cols-[220px,1fr] w-full h-full">
          <PartsMenu />
          <CircuitCanvas circuitState={circuitState} />
        </div>
      </div>
    </>
  );
}
