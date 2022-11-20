import {
  CircuitElement,
  CircuitElementIO,
  CircuitElementParams,
} from '../types';
import elementDefinitions, {
  WIRE_INPUT_ID,
  WIRE_OUTPUT_ID,
  WIRE_TYPE_ID,
} from './circuitElementDefinitions';
import { v4 as uuidv4 } from 'uuid';

export function buildCircuitElement(typeId: string): CircuitElement | null {
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

export type CircuitElementIoPortTuple = {
  element: CircuitElement;
  ioPort: CircuitElementIO;
};

export function getWireId(
  src: CircuitElementIoPortTuple,
  sink: CircuitElementIoPortTuple
): string {
  return `${src.element.id}/${src.ioPort.id} -> ${sink.element.id}/${sink.ioPort.id}`;
}

export function buildWireConnection(
  src: CircuitElementIoPortTuple,
  sink: CircuitElementIoPortTuple
): CircuitElement | null {
  if (!src || !sink) {
    return null;
  }

  const wire = buildCircuitElement(WIRE_TYPE_ID);

  if (!wire) {
    console.error('Failed to create wire for connection', src, sink);
    return null;
  }

  wire.id = getWireId(src, sink);

  wire.params.inputs[WIRE_INPUT_ID] = {
    elementId: src.element.id,
    ioPortId: src.ioPort.id,
  };

  wire.params.outputs[WIRE_OUTPUT_ID] = {
    elementId: sink.element.id,
    ioPortId: sink.ioPort.id,
  };

  return wire;
}
