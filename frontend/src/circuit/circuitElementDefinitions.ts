import { CircuitElementDefinition } from '../types';

const defaultDefinition: Partial<CircuitElementDefinition> = {
  visibleInToolbox: false,
};

export const WIRE_TYPE_ID = 'Wire';
export const WIRE_INPUT_ID = 'input';
export const WIRE_OUTPUT_ID = 'output';

const elementDefinitions: { [key: string]: CircuitElementDefinition } = {
  [WIRE_TYPE_ID]: {
    ...defaultDefinition,
    typeId: WIRE_TYPE_ID,
    label: 'Wire',
    color: 'black',
    width: 0,
    height: 0,
    inputs: [
      {
        id: WIRE_INPUT_ID,
        type: 'input',
        xOffset: 0,
        yOffset: 0,
      },
    ],
    outputs: [
      {
        id: WIRE_OUTPUT_ID,
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
    visibleInToolbox: true,
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
    visibleInToolbox: true,
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
