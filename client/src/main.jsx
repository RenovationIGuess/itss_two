import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { ContextProvider } from './contexts/ContextProvider';
import './index.css';
import { QueryProvider } from './providers/QueryProvider';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ContextProvider>
      <QueryProvider>
        <RouterProvider router={router} />
      </QueryProvider>
    </ContextProvider>
  </React.StrictMode>
);
