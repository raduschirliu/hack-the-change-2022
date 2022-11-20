import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import counterReducer from './reducers/counterSlice';
import documentReducer from './reducers/documentSlice';
import authReducer from './reducers/user';
import firebaseReducer from './reducers/firebase';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    document: documentReducer,
    auth: authReducer,
    firebase: firebaseReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
