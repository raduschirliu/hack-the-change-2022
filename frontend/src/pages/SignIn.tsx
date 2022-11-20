import React from 'react';
import { useState, useEffect } from 'react';
import {
  getAuth,
  Auth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectFirebase, setFirebase } from '../app/reducers/firebase';
import { setAuth as setAuthRedux } from '../app/reducers/user';
import { FirebaseError, initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const app = useAppSelector(selectFirebase);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [auth, setAuth] = useState<Auth>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrror] = useState('');

  useEffect(() => {
    console.log(app, auth);

    if (app) {
      const auth_temp = getAuth(app);
      setAuth(getAuth(app));
      console.warn('HERE 1', auth_temp);
      dispatch(setAuthRedux(auth_temp));
      navigate('/home');
    } else {
      const app_temp = initializeApp(firebaseConfig);
      dispatch(setFirebase(app_temp));
      const auth_temp = getAuth(app_temp);
      setAuth(getAuth(app_temp));
      console.warn('HERE 1', auth_temp);
      dispatch(setAuthRedux(auth_temp));
      navigate('/home');
    }
  }, []);

  const onSubmitPress = async () => {
    if (!auth) return;
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!auth.currentUser) {
        console.warn("Didn't get user?", auth);
        return;
      }
      // dispatch(setUser(auth.currentUser));
      console.warn('Got user', userCredential);
      navigate('/home');
    } catch (e) {
      console.error('Got error while creating user', e);
      setErrror((e as FirebaseError).message);
    }
  };

  return (
    <div>
      <p>Email</p>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        type={'email'}
      />
      <p>Password</p>
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type={'password'}
      />
      <button onClick={onSubmitPress}>Submit</button>
      <p>{error}</p>
    </div>
  );
};

export default SignIn;
