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

export type CircuitElement = {
  id: string;
  typeId: string;
  x: number;
  y: number;
  inputs: string[];
  outputs: string[];
  numInputs: number;
  numOutputs: number;
};

export type CircuitElementUpdate = {
  id: string;
  x: number;
  y: number;
  inputs: string[];
  outputs: string[];
  typeId?: string; // Only used for create
  numInputs?: number; // Only used for create
  numOutputs?: number; // Only used for create
};

export type ServerUpdateMessage = {
  documentId: string; // The ID of the document that the message is for
  users: string[]; // The IDs of the users that are currently editing the document
  elements: CircuitElementUpdate[]; // The elements that have been updated
};
