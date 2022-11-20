import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FirebaseApp } from 'firebase/app';
import { RootState } from '../store';

export interface FirebaseState {
  app?: FirebaseApp;
}

const initialState: FirebaseState = {};

export const firebaseSlice = createSlice({
  name: 'firebase',
  initialState,
  reducers: {
    setFirebase: (state, action: PayloadAction<FirebaseApp>) => {
      state.app = action.payload;
    },
    clearFirebase: (state) => {
      state.app = undefined;
    },
  },
});

export const { setFirebase } = firebaseSlice.actions;

export const selectFirebase = (state: RootState) => state.firebase.app;

export default firebaseSlice.reducer;
