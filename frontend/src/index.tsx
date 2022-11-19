import './App.css';
import './index.css';
import 'tw-elements';

import { RouterProvider, createBrowserRouter } from 'react-router-dom';

import DocumentPage from './pages/DocumentPage';
import { Provider } from 'react-redux';
import React from 'react';
import RootPage from './pages/MainPage';
import { createRoot } from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { store } from './app/store';

const container = document.getElementById('root')!;
const root = createRoot(container);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootPage />,
  },
  {
    path: '/document/:documentId',
    element: <DocumentPage />,
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
