// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import AppRotas from './rotas/AppRotas';
import { AuthProvider } from './contextos/AuthContext';
import { SocketProvider } from './contextos/SocketContext';

import './estilos/global.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <SocketProvider rota="/ws/mapa/">
        <AppRotas />
      </SocketProvider>
    </AuthProvider>
  </React.StrictMode>
);
