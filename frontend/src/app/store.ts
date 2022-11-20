import {
  Action,
  ThunkAction,
  configureStore,
  createImmutableStateInvariantMiddleware,
} from '@reduxjs/toolkit';

import authReducer from './reducers/user';
import documentReducer from './reducers/documentSlice';
import firebaseReducer from './reducers/firebase';

export const store = configureStore({
  reducer: {
    document: documentReducer,
    auth: authReducer,
    firebase: firebaseReducer,
  },
  middleware: [
    createImmutableStateInvariantMiddleware({ ignore: ['auth', 'firebase'] }),
  ],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
