import { CircuitElementDefinition } from '../types';

const defaultDefinition: Partial<CircuitElementDefinition> = {
  visibleInToolbox: false,
};

const elementDefinitions: { [key: string]: CircuitElementDefinition } = {
  Wire: {
    ...defaultDefinition,
    typeId: 'Wire',
    label: 'Wire',
    color: 'black',
    width: 1,
    height: 1,
    inputs: [
      {
        id: 'input',
        type: 'input',
        xOffset: 0,
        yOffset: 0,
      },
    ],
    outputs: [
      {
        id: 'output',
        type: 'output',
        xOffset: 0,
        yOffset: 0,
      },
    ],
    truthTable: [],
  },
  AndGate: {
    ...defaultDefinition,
    typeId: 'AndGate',
    label: 'And Gate',
    visibleInToolbox: true,
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
    truthTable: [],
  },
};

export default elementDefinitions;
