// src/paginas/TelaPrincipalVendedor.jsx
import React, { useEffect, useMemo, useState } from 'react';
import BarraNavegacaoInferior from '../componentes/organismos/BarraNavegacaoInferior';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import PainelMapaVendedor from '../componentes/organismos/PainelMapaVendedor';
import MapaTempoRealVendedor from '../componentes/organismos/MapaTempoRealVendedor';
import logoToAkiMini from '../ativos/toaki_logo.png';
import { useAuth } from '../contextos/AuthContext';
import { obterUrlWs } from '../uteis/apiConfig';
import {
  atualizarStatusOnlineVendedor,
  obterPerfilVendedorComStatus,
} from '../servicos/perfis';
import BotaoLogoutTemporario from '../componentes/atomos/BotaoLogoutTemporario';

const TelaPrincipalVendedor = () => {
    const { usuario, autenticado } = useAuth();
  const wsUrl = useMemo(() => obterUrlWs('/ws/mapa/'), []);

  const [itemAtivoBarra, setItemAtivoBarra] = useState('home');
  const [feedback, setFeedback] = useState('');
  const [estaOnline, setEstaOnline] = useState(
    usuario?.perfilVendedor?.esta_online ?? false
  );
  const [raioKm, setRaioKm] = useState(1);
  const [alterandoStatus, setAlterandoStatus] = useState(false);
  const [perfilVendedor, setPerfilVendedor] = useState(
    usuario?.perfilVendedor || usuario?.perfil_vendedor || null
  );

  useEffect(() => {
    setPerfilVendedor(usuario?.perfilVendedor || usuario?.perfil_vendedor);
    setEstaOnline(usuario?.perfilVendedor?.esta_online ?? false);
  }, [usuario?.perfilVendedor, usuario?.perfil_vendedor]);

  useEffect(() => {
    if (!autenticado) return;

    const carregarPerfil = async () => {
      const { perfil, status } = await obterPerfilVendedorComStatus();

      if (status === 401) {
        setFeedback('Sua sessão expirou, faça login novamente.');
        setTimeout(() => setFeedback(''), 4000);
        return;
      }

      if (perfil) {
        setPerfilVendedor(perfil);
        setEstaOnline(!!perfil.esta_online);
      }
    };

    carregarPerfil();
  }, [autenticado]);

  const perfilVendedorId =
    perfilVendedor?.id || usuario?.perfilVendedor?.id || usuario?.perfil_vendedor?.id;
  const nomeUsuario = usuario?.nome || 'Nome';

  const alternarOnline = async () => {
    if (alterandoStatus) return;

    if (!perfilVendedorId) {
      setFeedback('Não foi possível identificar seu perfil de vendedor.');
      setTimeout(() => setFeedback(''), 3000);
      return;
    }

    setAlterandoStatus(true);
    try {
      const resposta = await atualizarStatusOnlineVendedor(
        perfilVendedorId,
        !estaOnline
      );
      const novoStatus = !!resposta?.esta_online;
      setPerfilVendedor((atual) =>
        atual ? { ...atual, esta_online: novoStatus } : atual
      );
      setEstaOnline(novoStatus);
      setFeedback(
        novoStatus
          ? 'Sua loja está online e visível para clientes.'
          : 'Você ficou offline.'
      );
      setTimeout(() => setFeedback(''), 3000);
    } catch (error) {
      console.error('Erro ao alternar status online:', error);
      setFeedback('Não foi possível atualizar seu status agora.');
      setTimeout(() => setFeedback(''), 3000);
    } finally {
      setAlterandoStatus(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--cor-fundo-primaria)] overflow-hidden">
      <div className="fixed top-4 right-4 z-50 pointer-events-auto">
        <BotaoLogoutTemporario />
      </div>
      <div className="absolute inset-0">
        <MapaTempoRealVendedor
          userId={usuario?.id}
          userType={usuario?.tipo_usuario}
          wsUrl={wsUrl}
          className="w-full h-full"
        />
      </div>

      {feedback && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none">
          <div className="max-w-md w-full rounded-full bg-[var(--cor-feedback-sucesso)] text-white px-4 py-3 text-sm text-center shadow-[0_10px_25px_rgba(0,0,0,0.25)]">
            {feedback}
          </div>
        </div>
      )}

      <div className="relative z-10 flex flex-col min-h-screen pointer-events-none">
        <div className="hidden md:block w-full px-3 pt-3 pointer-events-auto">
          <HeaderPrincipal
            logoSrc={logoToAkiMini}
            mostrarAcoes
            onNotificacoesClick={() => console.log('Pedidos do vendedor')}
            onChatClick={() => console.log('Chat vendedor')}
            onAvatarClick={() => console.log('Perfil vendedor')}
          />
        </div>

        <main className="relative flex-1">
          <div className="pointer-events-auto">
            <PainelMapaVendedor
              nomeUsuario={nomeUsuario}
              raioKm={raioKm}
              onRaioChange={setRaioKm}
              estaOnline={estaOnline}
              onAlternarOnline={alternarOnline}
              alterandoStatus={alterandoStatus}
            />
          </div>
        </main>

        <div className="md:hidden px-4 pb-4 pointer-events-auto">
          <BarraNavegacaoInferior
            itemAtivo={itemAtivoBarra}
            onItemChange={(id) => {
              setItemAtivoBarra(id);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default TelaPrincipalVendedor;