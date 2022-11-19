import { CircuitElementDefinition } from '../types';

const COMPONENT_DEFINITIONS: { [key: string]: CircuitElementDefinition } = {
  AndGate: {
    typeId: 'AndGate',
    label: 'And Gate',
    color: 'red',
    width: 50,
    height: 150,
    inputs: [
      {
        id: 'input_0',
        type: 'input',
        xOffset: 20,
        yOffset: 20,
      },
    ],
    outputs: [
      {
        id: 'output_0',
        type: 'output',
        xOffset: 20,
        yOffset: 20,
      },
    ],
  },
};

export { COMPONENT_DEFINITIONS };
