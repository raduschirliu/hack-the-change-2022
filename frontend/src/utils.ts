import { CircuitElement, CircuitElementUpdate } from './types';

import { isCircuitElement } from './typeGuards';

export const updateCircuitState = (
  circuitState: CircuitElement[],
  elementUpdates: CircuitElementUpdate[]
): CircuitElement[] => {
  for (const elementUpdate of elementUpdates) {
    const elementIndex = circuitState.findIndex(
      (element) => element.id === elementUpdate.id
    );
    if (elementIndex === -1) {
      if (!isCircuitElement(elementUpdate)) {
        throw new Error(`Invalid circuit element created: ${elementUpdate}`);
      }
      circuitState.push(elementUpdate);
    }
    circuitState[elementIndex] = {
      ...circuitState[elementIndex],
      ...elementUpdate,
    };
  }
  return circuitState;
};
