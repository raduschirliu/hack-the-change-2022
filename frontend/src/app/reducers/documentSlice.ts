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
  document: null,
  elements: [],
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
      const idsToRemove = action.payload.map((remove) => remove.id);
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
        elements:updateCircuitState(state.elements, action.payload)
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
