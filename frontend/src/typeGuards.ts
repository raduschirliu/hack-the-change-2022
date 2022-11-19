import { CircuitElement, ServerResponse } from './types';

export const isServerResponse = (data: any): data is ServerResponse => {
  return (
    typeof data === 'object' &&
    typeof data.requestId === 'string' &&
    typeof data.success === 'boolean'
  );
};

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
