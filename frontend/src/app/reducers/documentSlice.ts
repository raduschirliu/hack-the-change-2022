import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorTool } from '../../circuit/circuitEditor';
import {
  CircuitDocument,
  CircuitElement,
  CircuitElementUpdate,
} from '../../types';
import { updateCircuitState } from '../../utils';
import { RootState, AppThunk } from '../store';

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
    removeCircuitElement: (state: DocumentState) => {},
    updateCircuitElements: (
      state: DocumentState,
      action: PayloadAction<CircuitElementUpdate[]>
    ) => {
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
  removeCircuitElement,
  updateCircuitElements,
  setActiveTool,
} = documentSlice.actions;

/* Selectors */
export const selectActiveTool = (state: RootState) => state.document.activeTool;
export const selectElements = (state: RootState) => state.document.elements;

/* Reducer */
export default documentSlice.reducer;
