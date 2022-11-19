import { ServerResponse, ServerUpdateMessage } from './types';

export const isServerResponse = (data: any): data is ServerResponse => {
  return (
    typeof data === 'object' &&
    typeof data.requestId === 'string' &&
    typeof data.success === 'boolean'
  );
};

export const isServerUpdateMessage = (
  data: any
): data is ServerUpdateMessage => {
  return (
    typeof data === 'object' &&
    typeof data.documentId === 'string' &&
    Array.isArray(data.users) &&
    data.users.every((user: any) => typeof user === 'string') &&
    Array.isArray(data.elements) &&
    data.elements.every((element: any) => {
      return (
        typeof element === 'object' &&
        typeof element.id === 'string' &&
        typeof element.x === 'number' &&
        typeof element.y === 'number' &&
        Array.isArray(element.inputs) &&
        element.inputs.every((input: any) => typeof input === 'string') &&
        Array.isArray(element.outputs) &&
        element.outputs.every((output: any) => typeof output === 'string')
      );
    })
  );
};