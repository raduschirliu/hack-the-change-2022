import {
  CircuitElement,
  CircuitElementIO,
  CircuitElementParams,
} from '../types';
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

const WIRE_TYPE = 'Wire';
const WIRE_INPUT_ID = 'input_0';
const WIRE_OUTPUT_ID = 'output_0';

type CircuitElementPortTuple = {
  element: CircuitElement;
  ioPort: CircuitElementIO;
};

function buildWireConnection(
  start: CircuitElementPortTuple,
  end: CircuitElementPortTuple
): CircuitElement | null {
  if (!start || !end) {
    return null;
  }

  const wire = buildCircuitElement(WIRE_TYPE);
  if (!wire) {
    console.error('Failed to create wire for connection', start, end);
    return null;
  }

  // wire.params.inputs[WIRE_INPUT_ID] = start.
  return wire;
}

export { buildCircuitElement };
