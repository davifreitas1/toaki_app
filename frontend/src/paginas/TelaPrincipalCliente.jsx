// src/paginas/TelaPrincipalCliente.jsx
import React, { useState } from 'react';
import MapaTempoReal from '../componentes/organismos/MapaTempoReal';
import BarraNavegacaoInferior from '../componentes/organismos/BarraNavegacaoInferior';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import PainelMapaCliente from '../componentes/organismos/PainelMapaCliente';
import ModalVendedorMapa from '../componentes/organismos/ModalVendedorMapa';
import { obterUrlWs } from '../uteis/apiConfig';
import { useAuth } from '../contextos/AuthContext';
import logoToAkiMini from '../ativos/toaki_logo.png';

const TelaPrincipalCliente = () => {
  const { usuario } = useAuth();
  const wsUrl = obterUrlWs('/ws/mapa/');
  const [raioKm, setRaioKm] = useState(1);

  const [vendedorSelecionado, setVendedorSelecionado] = useState(null);
  const [feedback, setFeedback] = useState('');

  const nomeUsuario = usuario?.nome || 'Nome';

  const handleVendedorClick = (vendedorDoMapa) => {
    if (!vendedorDoMapa) return;
    setVendedorSelecionado(vendedorDoMapa);
  };

  const handlePedidoCriado = () => {
    setVendedorSelecionado(null);
    setFeedback('Seu pedido foi enviado, por favor, aguarde.');

    // limpa feedback depois de alguns segundos
    setTimeout(() => {
      setFeedback('');
    }, 4000);
  };

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
          onVendedorClick={handleVendedorClick}
        />
      </div>

      {/* MODAL DO VENDEDOR */}
      {vendedorSelecionado && (
        <ModalVendedorMapa
          vendedorBasico={vendedorSelecionado}
          clienteCoords={vendedorSelecionado.clienteCoords}
          onClose={() => setVendedorSelecionado(null)}
          onPedidoCriado={handlePedidoCriado}
        />
      )}

      {/* TOAST DE FEEDBACK */}
      {feedback && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="max-w-md w-full rounded-full bg-[var(--cor-feedback-sucesso)] text-white px-4 py-3 text-sm text-center shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
            {feedback}
          </div>
        </div>
      )}

      {/* CAMADA DE CONTEÚDO SOBRE O MAPA */}
      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
        {/* HEADER DESKTOP (não aparece no mobile) */}
        <div className="hidden md:block w-full px-3 pt-3">
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
          <PainelMapaCliente
            nomeUsuario={nomeUsuario}
            raioKm={raioKm}
            onRaioChange={setRaioKm}
          />
        </main>

        {/* BARRA DE NAVEGAÇÃO MOBILE */}
        <div className="md:hidden px-4 pb-4">
          <BarraNavegacaoInferior
            itemAtivo="home"
            onItemChange={(id) =>
              console.log('Trocar aba para', id)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default TelaPrincipalCliente;
