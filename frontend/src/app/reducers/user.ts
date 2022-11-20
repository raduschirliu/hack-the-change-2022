import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Auth, signOut, User } from 'firebase/auth';
import { RootState } from '../store';

export interface AuthState {
  auth?: Auth;
}

const initialState: AuthState = {};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<Auth>) => {
      state.auth = action.payload;
    },
    clearUser: (state) => {
      (async () => {
        console.warn('Trying to log out', state.auth);
        if (state.auth) await signOut(state.auth);
      })();
      // if (state.auth) signOut(state.auth);
      // state.auth = undefined;
      // state.user;
      // state.user = undefined;
    },
  },
});

export const { setAuth, clearUser } = authSlice.actions;

export const selectUser = (state: RootState) => state.auth.auth?.currentUser;

export default authSlice.reducer;
