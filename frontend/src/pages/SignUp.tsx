import React from 'react';
import { useState, useEffect } from 'react';
import {
  getAuth,
  createUserWithEmailAndPassword,
  Auth,
  browserSessionPersistence,
  setPersistence,
} from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectFirebase, setFirebase } from '../app/reducers/firebase';
import { setUser } from '../app/reducers/user';
import { FirebaseError, initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';

const SignUp: React.FC = () => {
  const app = useAppSelector(selectFirebase);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [auth, setAuth] = useState<Auth>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrror] = useState('');

  useEffect(() => {
    console.log(app, auth);

    if (app) setAuth(getAuth(app));
    else {
      const app_temp = initializeApp(firebaseConfig);
      dispatch(setFirebase(app_temp));
      setAuth(getAuth(app_temp));
    }
  }, [app, auth, dispatch]);

  const onSubmitPress = async () => {
    if (!auth) return;
    try {
      await setPersistence(auth, browserSessionPersistence);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      dispatch(setUser(userCredential.user));
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

export default SignUp;
