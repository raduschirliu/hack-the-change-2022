export type UpdateData = {
  elementTypeId: string;
  x: number;
  y: number;
  inputs: string[];
  outputs: string[];
};

export type CreateData = {
  elementTypeId: string;
  x: number;
  y: number;
};

export type ClientMessage = {
  requestId: string; // UUID, generated by the client and used to match the response to the request
  documentId: string; // The ID of the document that the message is for
  userId: string; // The ID of the user that sent the message
  type: 'update' | 'delete' | 'create'; // Action type
  targetId?: string; // The ID of the target element, undefined for create
  data?: UpdateData | CreateData; // Data for the action, undefined for delete
};

export type ConnectMessage = {
  type: 'connect';
  documentId: string;
  userId: string;
};

export type ServerResponse = {
  requestId: string; // UUID, generated by the client and used to match the response to the request
  success: boolean; // Whether the request was successful
};

export type CircuitElementIO = {
  id: string;
  type: 'input' | 'output';
  // X offset of IO port in pixels
  xOffset: number;
  // y offset of IO port in pixels
  yOffset: number;
};

export type CircuitElementTruthTable = { [key: string]: boolean }[];

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

export type CircuitElementParams = {
  x: number;
  y: number;
  inputs: { [key: string]: string | null };
  outputs: { [key: string]: string | null };
};

export type CircuitElement = {
  id: string;
  typeId: string;
  params: CircuitElementParams;
};

export type CircuitElementUpdate = {
  targetId: string;
  params: Partial<CircuitElementParams>;
};

export type CircuitElementRemove = {
  targetId: string;
}

export type ServerUpdateMessage = {
  documentId: string; // The ID of the document that the message is for
  users: string[]; // The IDs of the users that are currently editing the document
  elements: CircuitElementUpdate[]; // The elements that have been updated
};

export type CircuitDocument = {
  uuid: string;
  name: string;
};
