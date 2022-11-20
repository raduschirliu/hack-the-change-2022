import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorTool } from '../../circuit/circuitEditor';
import { CircuitDocument } from '../../types';
import { RootState, AppThunk } from '../store';

/* State type */
export interface DocumentState {
  document: CircuitDocument | null;
  activeTool: EditorTool;
}

/* Initial state */
const initialState: DocumentState = {
  document: null,
  activeTool: EditorTool.Move,
};

/* Slice */
export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    addCircuitElement: (state: DocumentState) => {},
    removeCircuitElement: (state: DocumentState) => {},
    modifyCircuitElement: (state: DocumentState) => {},
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
  modifyCircuitElement,
  setActiveTool,
} = documentSlice.actions;

/* Selectors */
export const selectActiveTool = (state: RootState) => state.document.activeTool;

/* Reducer */
export default documentSlice.reducer;
