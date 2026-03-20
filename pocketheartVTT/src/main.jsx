import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- IMPORTACIÓN NUEVA
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* <-- ENVOLVEMOS LA APP AQUÍ */}
      <App />
    </BrowserRouter>
  </StrictMode>,
)