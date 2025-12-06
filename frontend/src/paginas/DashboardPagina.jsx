// src/paginas/DashboardPagina.jsx
import React from 'react';
import MapaTempoReal from '../componentes/organismos/MapaTempoReal';
import { obterUrlWs } from '../uteis/apiConfig';
import { useAuth } from '../contextos/AuthContext';

const DashboardPagina = () => {
  const { usuario } = useAuth(); // quando você tiver isso no contexto
  const wsUrl = obterUrlWs('/ws/mapa/');

  return (
    <div className="min-h-screen bg-[var(--cor-fundo-primaria)] px-4 py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="space-y-4">
          {/* Outras informações, cards, etc */}
          <h2 className="text-xl font-[var(--font-SemiBold)]">
            Bem-vindo, {usuario?.nome || 'Usuário'}
          </h2>
          {/* ... */}
        </section>

        <section className="h-[480px]">
          <MapaTempoReal
            userId={usuario?.id}
            userType={usuario?.tipo_usuario}
            wsUrl={wsUrl}
            className="h-full"
          />
        </section>
      </div>
    </div>
  );
};

export default DashboardPagina;
