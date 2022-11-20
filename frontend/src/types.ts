export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type CircuitDocument = {
  uuid: string;
  name: string;
};

/**
 * Defines what the IO looks like on a circuit element
 * Used in `circuitElementDefinitions.ts`
 */
export type CircuitElementIO = {
  id: string;
  type: 'input' | 'output';
  // X offset of IO port in pixels
  xOffset: number;
  // y offset of IO port in pixels
  yOffset: number;
};

/**
 * Defines a circuit's truth table
 * Used in `circuitElementDefinitions.ts`
 *
 * Format: { inputString: { outputId: boolean } }
 *
 * @example
 * { '00': { 'output_1': true } }
 */
export type CircuitElementTruthTable = Record<string, Record<string, boolean>>;

/**
 * Defines what a circuit element looks like and how it behaves
 * Used in `circuitElementDefinitions.ts`
 */
export type CircuitElementDefinition = {
  typeId: string;
  label: string;
  // Width in pixels
  width: number;
  // Height in pixels
  height: number;
  color: string;
  inputs: CircuitElementIO[];
  outputs: CircuitElementIO[];
  truthTable: CircuitElementTruthTable;
  visibleInToolbox?: boolean;
};

export type CircuitElementIOMap = {
  [sourceIoPortId: string]: {
    elementId: string;
    ioPortId: string;
  } | null;
};

export type CircuitElementParams = {
  x: number;
  y: number;
  state?: boolean; // State for input elements
  inputs: CircuitElementIOMap;
  outputs: CircuitElementIOMap;
};

export type CircuitElement = {
  id: string;
  typeId: string;
  params: CircuitElementParams;
};

export type CircuitElementUpdate = CircuitElement;

export type CircuitElementRemove = {
  id: string;
};

// The message the server sends back to update the client
export type ServerUpdateMessage = {
  documentId: string; // The ID of the document that the message is for
  users: string[]; // The IDs of the users that are currently editing the document
  element: CircuitElement; // The element that has been updated
};

export type ClientMessageDeleteData = CircuitElementRemove;
export type ClientMessageCreateData = CircuitElement;
export type ClientMessageUpdateData = CircuitElementUpdate;

// The message being sent by the client every time
export type ClientMessage = {
  requestId: string; // UUID, generated by the client and used to match the response to the request
  documentId: string; // The ID of the document that the message is for
  userId: string; // The ID of the user that sent the message
} & (
  | {
      /* Sent to initiate communication with the server */
      type: 'connect';
      /* Data should be empty object */
      data: {};
    }
  | {
      /* Sent when the client has made any updates to the local data */
      type: 'update';
      data: ClientMessageUpdateData;
    }
  | {
      /* Sent when the client has created any new elements */
      type: 'create';
      data: ClientMessageCreateData;
    }
  | {
      /* Sent when the client deletes any elements */
      type: 'delete';
      data: ClientMessageDeleteData;
    }
);
