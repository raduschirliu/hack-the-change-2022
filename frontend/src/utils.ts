import { CircuitElement, CircuitElementUpdate } from './types';

import { isCircuitElement } from './typeGuards';

export const updateCircuitState = (
  originalCircuitState: CircuitElement[],
  elementUpdates: CircuitElementUpdate[]
): CircuitElement[] => {
  // A foul hack for deep copy
  let circuitState: CircuitElement[] = JSON.parse(
    JSON.stringify(originalCircuitState)
  );

  for (const elementUpdate of elementUpdates) {
    const elementIndex = circuitState.findIndex(
      (element) => element.id === elementUpdate.id
    );
    if (elementIndex === -1) {
      console.error('Invalid update element', elementUpdate);
    } else {
      circuitState[elementIndex] = {
        ...circuitState[elementIndex],
        params: {
          ...circuitState[elementIndex].params,
          ...elementUpdate.params,
        },
      };
    }
  }
  return circuitState;
};
