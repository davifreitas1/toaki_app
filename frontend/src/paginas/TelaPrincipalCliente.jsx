// src/paginas/TelaPrincipalCliente.jsx
import React, { useState } from 'react';
import MapaTempoReal from '../componentes/organismos/MapaTempoReal';
import BarraNavegacaoInferior from '../componentes/organismos/BarraNavegacaoInferior';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import PainelMapaCliente from '../componentes/organismos/PainelMapaCliente';
import { obterUrlWs } from '../uteis/apiConfig';
import { useAuth } from '../contextos/AuthContext';

// ❗ ajuste o caminho/nome abaixo para a SUA logo reduzida (quadrada),
// por exemplo: toaki_logo_reduzida.png
import logoToAkiMini from '../ativos/toaki_logo.png';

const TelaPrincipalCliente = () => {
  const { usuario } = useAuth();
  const wsUrl = obterUrlWs('/ws/mapa/');
  const [raioKm, setRaioKm] = useState(1);

  const nomeUsuario = usuario?.nome || 'Nome';

  return (
    <div className="relative min-h-screen w-full bg-[var(--cor-fundo-primaria)] overflow-hidden">
      {/* MAPA EM TELA CHEIA (fica por trás de tudo) */}
      <div className="absolute inset-0">
        <MapaTempoReal
          userId={usuario?.id}
          userType={usuario?.tipo_usuario}
          wsUrl={wsUrl}
          className="w-full h-full"
          raioKm={raioKm}
        />
      </div>

      {/* CAMADA DE CONTEÚDO SOBRE O MAPA */}
      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
        {/* HEADER DESKTOP (não aparece no mobile) */}
        <div className="hidden md:block w-full px-3 pt-3">
          {/* px-3 / pt-3 ≈ 12px → área vazada igual Figma */}
          <HeaderPrincipal
            logoSrc={logoToAkiMini}
            mostrarAcoes
            onNotificacoesClick={() => console.log('Notificações')}
            onChatClick={() => console.log('Chat')}
            onAvatarClick={() => console.log('Perfil')}
          />
        </div>

        {/* OVERLAYS (avatar mobile, filtros, botões mapa) */}
        <main className="relative flex-1 pointer-events-none">
          {/* Painel cobre a área útil, mas pointer-events já estão tratados lá */}
          <PainelMapaCliente
            nomeUsuario={nomeUsuario}
            raioKm={raioKm}
            onRaioChange={setRaioKm}
          />
        </main>

        {/* BARRA DE NAVEGAÇÃO MOBILE (desktop continua só com header + mapa) */}
        <div className="md:hidden px-4 pb-4">
          <BarraNavegacaoInferior
            itemAtivo="home"
            onItemChange={(id) => console.log('Trocar aba para', id)}
          />
        </div>
      </div>
    </div>
  );
};

export default TelaPrincipalCliente;
