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
    color: '#67e8f9',
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
    color: '#059669',
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
    color: '#fde047',
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
  Not: {
    ...defaultDefinition,
    visibleInToolbox: true,
    typeId: 'Not',
    label: 'Not',
    color: '#6ee7b7',
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
    outputs: [
      {
        id: 'output_0',
        type: 'output',
        xOffset: 25,
        yOffset: 0,
      },
    ],
    truthTable: {
      '0': {
        output_0: true,
      },
      '1': {
        output_0: false,
      },
    },
  },
  Or: {
    ...defaultDefinition,
    visibleInToolbox: true,
    typeId: 'Or',
    label: 'Or',
    color: '#a5b4fc',
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
        output_0: true,
      },
      '10': {
        output_0: true,
      },
      '11': {
        output_0: true,
      },
    },
  },
  Xor: {
    ...defaultDefinition,
    visibleInToolbox: true,
    typeId: 'Xor',
    label: 'Xor',
    color: '#f0abfc',
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
        output_0: true,
      },
      '10': {
        output_0: true,
      },
      '11': {
        output_0: false,
      },
    },
  },
  Nand: {
    ...defaultDefinition,
    visibleInToolbox: true,
    typeId: 'Nand',
    label: 'Nand',
    color: '#0284c7',
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
        output_0: true,
      },
      '01': {
        output_0: true,
      },
      '10': {
        output_0: true,
      },
      '11': {
        output_0: false,
      },
    },
  },
  Nor: {
    ...defaultDefinition,
    visibleInToolbox: true,
    typeId: 'Nor',
    label: 'Nor',
    color: '#4f46e5',
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
        output_0: true,
      },
      '01': {
        output_0: false,
      },
      '10': {
        output_0: false,
      },
      '11': {
        output_0: false,
      },
    },
  },
  Xnor: {
    ...defaultDefinition,
    visibleInToolbox: true,
    typeId: 'Xnor',
    label: 'Xnor',
    color: '#9333ea',
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
        output_0: true,
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
};

export default elementDefinitions;
