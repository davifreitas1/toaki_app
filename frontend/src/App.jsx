import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contextos/AuthContext';

import PaginaLogin from './paginas/PaginaLogin';
import PaginaMapa from './paginas/PaginaMapa';

// Componente de Rota Privada
const RotaPrivada = ({ children }) => {
    const { signed, carregando } = useAuth();

    if (carregando) {
        return <div className="flex h-screen items-center justify-center">Carregando...</div>;
    }

    return signed ? children : <Navigate to="/" />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
            {/* Rota Pública (Login) */}
            <Route path="/" element={<PaginaLogin />} />

            {/* Rota Privada (Mapa) */}
            <Route 
                path="/mapa" 
                element={
                    <RotaPrivada>
                        <PaginaMapa />
                    </RotaPrivada>
                } 
            />
            
            {/* Rota 404 - Redireciona para home */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;