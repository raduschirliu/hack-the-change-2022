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
import { setUser } from '../app/reducers/user';
import { FirebaseError, initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { LandNav } from '../components/landing/LandNav';

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (!auth.currentUser) {
        console.warn("Didn't get user?", auth);
        return;
      }
      dispatch(setUser(auth.currentUser));
      console.warn('Got user', userCredential);
      navigate('/home');
    } catch (e) {
      console.error('Got error while creating user', e);
      setErrror((e as FirebaseError).message);
    }
  };

  return (
    <div className="h-screen">
      <LandNav shouldNotDisplayLogInOut={true} />
      {/* <!-- Jumbotron --> */}
      <div className="h-full p-6 shadow-lg rounded-lg bg-cyan-100 text-gray-700 text-center">
        <h1 className="font-semibold text-xl">Welcome Back!</h1>
        <br />
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
        <br />
        <br />
        <button
          type="button"
          data-mdb-ripple="true"
          data-mdb-ripple-color="light"
          className="px-5 bg-violet-500 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-cyan-400 hover:shadow-lg transition duration-150 ease-in-out"
          title="Submit"
          onClick={onSubmitPress}
        >
          Login
        </button>
        <p>{error}</p>
      </div>
    </div>
  );
};

export default SignIn;
