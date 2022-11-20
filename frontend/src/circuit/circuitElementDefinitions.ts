import { CircuitElementDefinition } from '../types';

const elementDefinitions: { [key: string]: CircuitElementDefinition } = {
  AndGate: {
    typeId: 'AndGate',
    label: 'And Gate',
    color: 'pink',
    width: 50,
    height: 100,
    inputs: [
      {
        id: 'input_0',
        type: 'input',
        xOffset: -25,
        yOffset: -25,
      },
      {
        id: 'input_1',
        type: 'input',
        xOffset: -25,
        yOffset: 25,
      },
    ],
    outputs: [
      {
        id: 'output_0',
        type: 'output',
        xOffset: 25,
        yOffset: 0,
      },
    ],
  },
};

export default elementDefinitions;
