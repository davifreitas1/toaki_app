// src/contextos/SocketContext.jsx
import React, { createContext, useContext } from 'react';
import useSocket from '../hooks/useSocket';

const SocketContext = createContext(null);

// rota = string da rota WS, ex: "/ws/localizacoes/"
export const SocketProvider = ({ rota, children }) => {
  const socket = useSocket(rota);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const contexto = useContext(SocketContext);

  if (!contexto) {
    throw new Error(
      'useSocketContext deve ser usado dentro de um <SocketProvider>.'
    );
  }

  return contexto;
};
