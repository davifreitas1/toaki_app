// src/rotas/AppRotas.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contextos/AuthContext';

// IMPORTS DAS PÁGINAS (crie esses arquivos em src/paginas/)
import LoginPagina from '../paginas/LoginPagina';
import CadastroPagina from '../paginas/CadastroPagina';
import Pagina404 from '../paginas/Pagina404';
import TelaPrincipalCliente from '../paginas/TelaPrincipalCliente';
import LoginVendedorPagina from '../paginas/LoginVendedorPagina';
import CadastroVendedorPagina from '../paginas/CadastroVendedorPagina';
import TelaPrincipalVendedor from '../paginas/TelaPrincipalVendedor';

// Componente de Rota Privada
const RotaPrivada = ({ children }) => {
  const { autenticado, carregando } = useAuth();

  if (carregando) {
    // Aqui depois você pode trocar por um spinner bonitinho (átomo de Loading)
    return <div>Carregando...</div>;
  }

  if (!autenticado) {
    // Não autenticado → manda pro login
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRotas = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redireciona "/" para "/app" (Dashboard) */}
        <Route path="/" element={<Navigate to="/app" replace />} />

        {/* Rotas públicas */}
        <Route path="/login" element={<LoginPagina />} />
        <Route path="/cadastro" element={<CadastroPagina />} />
        <Route path="/vendedor/login" element={<LoginVendedorPagina />} />
        <Route path="/vendedor/cadastro" element={<CadastroVendedorPagina />} />

        {/* Rotas protegidas */}
        <Route
          path="/app"
          element={
            <RotaPrivada>
              <TelaPrincipalCliente />
            </RotaPrivada>
          }
        />
        <Route
          path="/vendedor/app"
          element={
            <RotaPrivada>
              <TelaPrincipalVendedor />
            </RotaPrivada>
          }
        />

        {/* 404 genérica */}
        <Route path="*" element={<Pagina404 />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRotas;