import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CircuitDocument } from '../../types';
import { RootState, AppThunk } from '../store';

export interface DocumentState {
  document: CircuitDocument | null;
}

const initialState: DocumentState = {
  document: null,
};

export const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    addCircuitElement: (state: DocumentState) => {},
    removeCircuitElement: (state: DocumentState) => {},
    modifyCircuitElement: (state: DocumentState) => {},
  },
});

export const { addCircuitElement, removeCircuitElement, modifyCircuitElement } =
  documentSlice.actions;

export default documentSlice.reducer;
