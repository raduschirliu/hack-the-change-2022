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
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const app = initializeApp(firebaseConfig);

const container = document.getElementById('root')!;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
  },
  {
    path: '/document/:documentId',
    element: (
      <>
        <DocumentPage />
      </>
    ),
  },
  {
    path: '/sign-up',
    element: <SignUp />,
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
