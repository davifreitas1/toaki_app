// src/paginas/TelaPrincipalCliente.jsx
import React, { useState } from 'react';
import BarraNavegacaoInferior from '../componentes/organismos/BarraNavegacaoInferior';
import MapaTempoReal from '../componentes/organismos/MapaTempoReal';
import { obterUrlWs } from '../uteis/apiConfig';
import { useAuth } from '../contextos/AuthContext';

const TelaPrincipalCliente = () => {
  const { usuario } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState('home');
  const wsUrl = obterUrlWs('/ws/mapa/');

  return (
    <div className="min-h-screen bg-[var(--cor-fundo-primaria)] relative">
      {/* área do mapa */}
      <div className="absolute inset-0">
        <MapaTempoReal
          userId={usuario?.id}
          userType={usuario?.tipo_usuario}
          wsUrl={wsUrl}
          className="h-full"
        />
      </div>

      {/* aqui entrariam os outros organismos "flutuando" sobre o mapa */}

      {/* barra de navegação mobile */}
      <BarraNavegacaoInferior
        itemAtivo={abaAtiva}
        onItemChange={setAbaAtiva}
      />
    </div>
  );
};

export default TelaPrincipalCliente;
