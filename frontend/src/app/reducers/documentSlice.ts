import { AppThunk, RootState } from '../store';
import {
  CircuitDocument,
  CircuitElement,
  CircuitElementRemove,
  CircuitElementUpdate,
} from '../../types';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { EditorTool } from '../../circuit/circuitEditor';
import { updateCircuitState } from '../../utils';

/* State type */
export interface DocumentState {
  document: CircuitDocument | null;
  elements: CircuitElement[];
  activeTool: EditorTool;
}

/* Initial state */
const initialState: DocumentState = {
  document: {
    uuid: 'test',
    name: 'Test',
  },
  elements: [
    {
      id: 'and',
      typeId: 'And',
      params: {
        x: 0,
        y: 0,
        inputs: {
          input_0: 'wire_0',
          input_1: 'wire_1',
        },
        outputs: {
          output_0: 'wire_2',
        },
      },
    },
    {
      id: 'input_0',
      typeId: 'Input',
      params: {
        x: 0,
        y: 0,
        state: true,
        inputs: {},
        outputs: {
          output_0: 'wire_0',
        },
      },
    },
    {
      id: 'input_1',
      typeId: 'Input',
      params: {
        x: 0,
        y: 0,
        state: false,
        inputs: {},
        outputs: {
          output_0: 'wire_1',
        },
      },
    },
    {
      id: 'output',
      typeId: 'Output',
      params: {
        x: 0,
        y: 0,
        inputs: {
          input_0: 'wire_2',
        },
        outputs: {},
      },
    },
    {
      id: 'wire_0',
      typeId: 'Wire',
      params: {
        x: 0,
        y: 0,
        inputs: {
          input: 'input_0',
        },
        outputs: {
          output: 'and',
        },
      },
    },
    {
      id: 'wire_1',
      typeId: 'Wire',
      params: {
        x: 0,
        y: 0,
        inputs: {
          input: 'input_1',
        },
        outputs: {
          output: 'and',
        },
      },
    },
    {
      id: 'wire_2',
      typeId: 'Wire',
      params: {
        x: 0,
        y: 0,
        inputs: {
          input: 'and',
        },
        outputs: {
          output: 'output',
        },
      },
    },
  ],
  activeTool: EditorTool.Move,
};

/* Slice */
export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    addCircuitElement: (
      state: DocumentState,
      action: PayloadAction<CircuitElement>
    ) => {
      return {
        ...state,
        elements: [...state.elements, action.payload],
      };
    },
    removeCircuitElements: (
      state: DocumentState,
      action: PayloadAction<CircuitElementRemove[]>
    ) => {
      const idsToRemove = action.payload.map((remove) => remove.targetId);
      console.log('removing ids', idsToRemove);

      // TODO: Send this event to the backend

      return {
        ...state,
        elements: state.elements.filter(
          (element) => !idsToRemove.includes(element.id)
        ),
      };
    },
    updateCircuitElements: (
      state: DocumentState,
      action: PayloadAction<CircuitElementUpdate[]>
    ) => {
      // TODO: Send this event to the backend

      return {
        ...state,
        elements: updateCircuitState(state.elements, action.payload),
      };
    },
    setActiveTool: (
      state: DocumentState,
      action: PayloadAction<EditorTool>
    ) => {
      return {
        ...state,
        activeTool: action.payload,
      };
    },
  },
});

/* Actions */
export const {
  addCircuitElement,
  removeCircuitElements,
  updateCircuitElements,
  setActiveTool,
} = documentSlice.actions;

/* Selectors */
export const selectActiveTool = (state: RootState) => state.document.activeTool;
export const selectElements = (state: RootState) => state.document.elements;

/* Reducer */
export default documentSlice.reducer;
