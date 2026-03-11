import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import '@wxt-monorepo/ui/styles';

const root = document.getElementById('root')!;
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
