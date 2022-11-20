import { CircuitElement, CircuitElementParams } from '../types';
import elementDefinitions from './circuitElementDefinitions';
import { v4 as uuidv4 } from 'uuid';

function buildCircuitElement(typeId: string): CircuitElement | null {
  if (!(typeId in elementDefinitions)) {
    return null;
  }

  const elementDef = elementDefinitions[typeId];
  const params: CircuitElementParams = {
    x: 0,
    y: 0,
    inputs: {},
    outputs: {},
  };

  elementDef.inputs.forEach((input) => {
    params.inputs[input.id] = null;
  });

  elementDef.outputs.forEach((output) => {
    params.outputs[output.id] = null;
  });

  return {
    id: uuidv4(),
    typeId,
    params,
  } as CircuitElement;
}

export { buildCircuitElement };
