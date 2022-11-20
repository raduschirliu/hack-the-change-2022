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
    truthTable: {
      '0': {
        output: false,
      },
      '1': {
        output: true,
      },
    },
  },
  And: {
    ...defaultDefinition,
    typeId: 'And',
    label: 'And',
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
    truthTable: {
      '00': {
        output_0: false,
      },
      '01': {
        output_0: false,
      },
      '10': {
        output_0: false,
      },
      '11': {
        output_0: true,
      },
    },
  },
  Input: {
    ...defaultDefinition,
    typeId: 'Input',
    label: 'Input',
    color: 'lightblue',
    width: 50,
    height: 50,
    inputs: [],
    outputs: [
      {
        id: 'output_0',
        type: 'output',
        xOffset: 25,
        yOffset: 0,
      },
    ],
    truthTable: {},
  },
  Output: {
    ...defaultDefinition,
    typeId: 'Output',
    label: 'Output',
    color: 'lightgreen',
    width: 50,
    height: 50,
    inputs: [
      {
        id: 'input_0',
        type: 'input',
        xOffset: -25,
        yOffset: 0,
      },
    ],
    outputs: [],
    truthTable: {},
  },
};

export default elementDefinitions;
