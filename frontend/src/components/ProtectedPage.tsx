import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectFirebase, setFirebase } from '../app/reducers/firebase';
import { selectUser, setAuth } from '../app/reducers/user';
import firebaseConfig from '../firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';

interface IProtectedPageProps {
  children: JSX.Element;
}

const ProtectedPage: React.FC<IProtectedPageProps> = (
  props: IProtectedPageProps
) => {
  const user = useAppSelector(selectUser);
  const app = useAppSelector(selectFirebase);
  // const [userHook] = useAuthState(getAuth(app));
  const dispatch = useAppDispatch();

  useEffect(() => {
    // If we have user already
    if (user) return;

    // Get app
    if (!app) {
      // Create app context
      const app_temp = initializeApp(firebaseConfig);
      dispatch(setFirebase(app_temp));
    }

    const auth = getAuth(app);
    dispatch(setAuth(auth));

    // // Ensure we have app
    // if (app) {
    //   const auth = getAuth(app);
    //   if (auth.currentUser) {
    //     // Set user
    //     dispatch(setUser(auth.currentUser));
    //   }
    // } else {
    //   // Set user
    //   const auth = getAuth(app_temp);
    //   if (auth.currentUser) {
    //     dispatch(setUser(auth.currentUser));
    //   }
    // }
  }, [user, app, dispatch]);

  return user === undefined || user === null ? (
    <Navigate to={'/sign-in'} />
  ) : (
    props.children
  );
};

export default ProtectedPage;
