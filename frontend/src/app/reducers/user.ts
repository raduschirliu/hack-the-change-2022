import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { RootState } from '../store';

export interface AuthState {
  user?: User;
}

const initialState: AuthState = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.user;

export default authSlice.reducer;
