// src/paginas/TelaPrincipalCliente.jsx
import React, { useState } from 'react';
import MapaTempoReal from '../componentes/organismos/MapaTempoReal';
import BarraNavegacaoInferior from '../componentes/organismos/BarraNavegacaoInferior';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import PainelMapaCliente from '../componentes/organismos/PainelMapaCliente';
import ModalVendedorMapa from '../componentes/organismos/ModalVendedorMapa';
import ModalPedidosCliente from '../componentes/organismos/ModalPedidosCliente';
import { obterUrlWs } from '../uteis/apiConfig';
import { useAuth } from '../contextos/AuthContext';
import logoToAkiMini from '../ativos/toaki_logo.png';

const TelaPrincipalCliente = () => {
  const { usuario } = useAuth();
  const wsUrl = obterUrlWs('/ws/mapa/');
  const [raioKm, setRaioKm] = useState(1);

  const [vendedorSelecionado, setVendedorSelecionado] = useState(null);
  const [feedback, setFeedback] = useState('');

    // Navegação inferior
  const [itemAtivoBarra, setItemAtivoBarra] = useState('home');

  // Modal de pedidos / rastreio
  const [mostrarModalPedidos, setMostrarModalPedidos] = useState(false);
  const [pedidoRastreado, setPedidoRastreado] = useState(null);
  const [distanciaRastreamentoKm, setDistanciaRastreamentoKm] =
    useState(null);

  const nomeUsuario = usuario?.nome || 'Nome';

  const handleVendedorClick = (vendedorDoMapa) => {
    if (!vendedorDoMapa) return;
    setVendedorSelecionado(vendedorDoMapa);
  };

  const handlePedidoCriado = () => {
    setVendedorSelecionado(null);
    setFeedback('Seu pedido foi enviado, por favor, aguarde.');

    setTimeout(() => {
      setFeedback('');
    }, 4000);
  };

  const handlePararRastreamento = () => {
    setPedidoRastreado(null);
    setDistanciaRastreamentoKm(null);
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
          vendedorRastreadoId={pedidoRastreado?.perfil_vendedor_id || null}
          onDistanciaRastreamentoChange={setDistanciaRastreamentoKm}
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

      {/* MODAL DE PEDIDOS EM ANDAMENTO */}
      <ModalPedidosCliente
        aberto={mostrarModalPedidos}
        onClose={() => setMostrarModalPedidos(false)}
        onRastrear={(pedido) => {
          setPedidoRastreado(pedido);
          setMostrarModalPedidos(false);
        }}
      />

      {/* TOAST DE FEEDBACK */}
      {feedback && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none">
          <div className="max-w-md w-full rounded-full bg-[var(--cor-feedback-sucesso)] text-white px-4 py-3 text-sm text-center shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
            {feedback}
          </div>
        </div>
      )}

      {/* PILL DE DISTÂNCIA DO RASTREIO */}
      {pedidoRastreado && distanciaRastreamentoKm != null && (
        <div className="fixed inset-x-0 bottom-20 z-40 flex justify-center pointer-events-none px-4">
          <div
            className="
              inline-flex items-center gap-2
              max-w-md
              rounded-full
              bg-black/75
              px-4 py-2
              text-xs
              text-white
              font-['Montserrat']
              shadow-[0_6px_16px_rgba(0,0,0,0.45)]
              pointer-events-auto
            "
          >
            <span className="truncate">
              Pedido #{pedidoRastreado.id.slice(0, 6).toUpperCase()} ·{' '}
              {distanciaRastreamentoKm.toFixed(1)} km até o vendedor
            </span>

            <button
              type="button"
              onClick={handlePararRastreamento}
              className="
                ml-1
                inline-flex items-center justify-center
                w-6 h-6
                rounded-full
                bg-white/10
                hover:bg-white/20
                text-[10px]
                font-semibold
              "
              aria-label="Parar rastreio"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* CAMADA DE CONTEÚDO SOBRE O MAPA */}
      {/* pointer-events-none aqui deixa o mapa interagível por padrão */}
      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
        {/* HEADER DESKTOP (não aparece no mobile) */}
        <div className="hidden md:block w-full px-3 pt-3 pointer-events-auto">
          <HeaderPrincipal
            logoSrc={logoToAkiMini}
            mostrarAcoes
            onNotificacoesClick={() => setMostrarModalPedidos(true)}
            onChatClick={() => console.log('Chat')}
            onAvatarClick={() => console.log('Perfil')}
          />
        </div>

        {/* OVERLAYS (avatar mobile, filtros, botões mapa) */}
        <main className="relative flex-1">
          <div className="pointer-events-auto">
            <PainelMapaCliente
              nomeUsuario={nomeUsuario}
              raioKm={raioKm}
              onRaioChange={setRaioKm}
            />
          </div>
        </main>

        {/* BARRA DE NAVEGAÇÃO MOBILE */}
        <div className="md:hidden px-4 pb-4 pointer-events-auto">
          <BarraNavegacaoInferior
            itemAtivo={itemAtivoBarra}
            onItemChange={(id) => {
              setItemAtivoBarra(id);

              if (id === 'tag') {
                setMostrarModalPedidos(true);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TelaPrincipalCliente;
