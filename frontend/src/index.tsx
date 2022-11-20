import './App.css';
import './index.css';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import DocumentPage from './pages/DocumentPage';
import { Provider } from 'react-redux';
import React from 'react';
import RootPage from './pages/MainPage';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { store } from './app/store';

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import SignUp from './pages/SignUp';
import firebaseConfig from './firebaseConfig';
import ProtectedPage from './components/ProtectedPage';
import SignIn from './pages/SignIn';
import Landing from './pages/Landing';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const container = document.getElementById('root')!;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/home',
    element: (
      <ProtectedPage>
        <RootPage />
      </ProtectedPage>
    ),
  },
  {
    path: '/document/:documentId',
    element: (
      <ProtectedPage>
        <DocumentPage />
      </ProtectedPage>
    ),
  },
]);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
