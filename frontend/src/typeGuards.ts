/* eslint-disable */

import { CircuitElement, ServerUpdateMessage } from './types';

export const isCircuitElement = (data: any): data is CircuitElement => {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.typeId === 'string' &&
    typeof data.x === 'number' &&
    typeof data.y === 'number' &&
    Array.isArray(data.inputs) &&
    Array.isArray(data.outputs) &&
    typeof data.numInputs === 'number' &&
    typeof data.numOutputs === 'number'
  );
};

// TODO: This is no longer up to date with the new type
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
