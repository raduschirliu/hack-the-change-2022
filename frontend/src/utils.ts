import { CircuitElement, CircuitElementUpdate } from './types';

import { isCircuitElement } from './typeGuards';

export const updateCircuitState = (
  originalCircuitState: CircuitElement[],
  elementUpdates: CircuitElementUpdate[]
): CircuitElement[] => {
  console.log('payload', elementUpdates);
  // A foul hack for deep copy
  let circuitState: CircuitElement[] = JSON.parse(
    JSON.stringify(originalCircuitState)
  );

  for (const elementUpdate of elementUpdates) {
    const idx = circuitState.findIndex((e) => e.id === elementUpdate.id);

    if (idx === -1) {
      // Doesnt exist
      circuitState.push(elementUpdate);
    } else {
      circuitState[idx] = elementUpdate;
    }
  }
  return circuitState;
};
