import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectFirebase, setFirebase } from '../app/reducers/firebase';
import { selectUser, setUser } from '../app/reducers/user';
import firebaseConfig from '../firebaseConfig';

interface IProtectedPageProps {
  children: JSX.Element;
}

const ProtectedPage: React.FC<IProtectedPageProps> = (
  props: IProtectedPageProps
) => {
  const user = useAppSelector(selectUser);
  const app = useAppSelector(selectFirebase);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) return;

    if (app) {
      const auth = getAuth(app);
      if (auth.currentUser) {
        dispatch(setUser(auth.currentUser));
      }
    } else {
      const app_temp = initializeApp(firebaseConfig);
      dispatch(setFirebase(app_temp));
      const auth = getAuth(app_temp);
      if (auth.currentUser) {
        dispatch(setUser(auth.currentUser));
      }
    }
  }, [user, app, dispatch]);

  return user === undefined ? <Navigate to={'/sign-in'} /> : props.children;
};

export default ProtectedPage;
