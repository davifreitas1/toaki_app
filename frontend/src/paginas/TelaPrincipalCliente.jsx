// src/paginas/TelaPrincipalCliente.jsx
import React, { useState } from 'react';
import MapaTempoReal from '../componentes/organismos/MapaTempoReal';
import BarraNavegacaoInferior from '../componentes/organismos/BarraNavegacaoInferior';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import PainelMapaCliente from '../componentes/organismos/PainelMapaCliente';
import { obterUrlWs } from '../uteis/apiConfig';
import { useAuth } from '../contextos/AuthContext';
import logoToAki from '../ativos/toaki_logo.png';

const TelaPrincipalCliente = () => {
  const { usuario } = useAuth();
  const wsUrl = obterUrlWs('/ws/mapa/');
  const [raioKm, setRaioKm] = useState(1);

  const nomeUsuario = usuario?.nome || 'Nome';

  return (
    <div className="min-h-screen w-full bg-[var(--cor-fundo-primaria)] flex flex-col">
      {/* HEADER - apenas desktop */}
      <HeaderPrincipal
        logoSrc={logoToAki}
        logoAlt="Tô Aki"
        icones={[
          {
            path: 'notas',
            onClick: () => console.log('Notificações'),
            cor: '#777777',
            comFundo: false,
          },
          {
            path: 'chat',
            onClick: () => console.log('Chat'),
            cor: '#777777',
            comFundo: false,
          },
          {
            path: 'usuario',
            onClick: () => console.log('Perfil'),
            cor: '#777777',
            comFundo: true, // ÚNICO com bolinha branca
          },
        ]}
        exibirNoMobile={false}
      />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="relative flex-1 overflow-hidden">
        {/* MAPA EM TELA CHEIA */}
        <div className="absolute inset-0">
          <MapaTempoReal
            userId={usuario?.id}
            userType={usuario?.tipo_usuario}
            wsUrl={wsUrl}
            className="w-full h-full"
            raioKm={raioKm} // pronto para usar no futuro
          />
        </div>

        {/* OVERLAYS (avatar, filtros, botões) */}
        <PainelMapaCliente
          nomeUsuario={nomeUsuario}
          raioKm={raioKm}
          onRaioChange={setRaioKm}
        />
      </main>

      {/* BARRA DE NAVEGAÇÃO MOBILE */}
      <div className="md:hidden">
        <BarraNavegacaoInferior
          itemAtivo="home"
          onItemChange={(id) => console.log('Trocar aba para', id)}
        />
      </div>
    </div>
  );
};

export default TelaPrincipalCliente;
