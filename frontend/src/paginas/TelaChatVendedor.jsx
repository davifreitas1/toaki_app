// src/paginas/TelaConversas.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import BarraNavegacaoInferior from '../componentes/organismos/BarraNavegacaoInferior';
import ItemListaConversa from '../componentes/moleculas/ItemListaConversa';
import BarraEnvioMensagem from '../componentes/moleculas/BarraEnvioMensagem';
import Icone from '../componentes/atomos/Icone';
import logoToAkiMini from '../ativos/toaki_logo.png';

const DADOS_MOCK = [
  { id: 1, nome: 'Matheus', mensagem: 'Vou ai buscar', naoLidas: 2 },
  { id: 2, nome: 'Carlos Dias', mensagem: 'Bom dia', naoLidas: 3 },
  { id: 3, nome: 'Davi', mensagem: 'Você: seu pedido...', naoLidas: 1 },
  { id: 4, nome: 'Winny', mensagem: 'Você: Bom dia', naoLidas: 0 },
];

const TelaConversas = () => {
  const navigate = useNavigate();
  const [termoBusca, setTermoBusca] = useState('');
  const [conversaAtiva, setConversaAtiva] = useState(null);
  
  // Mock de mensagens
  const [mensagensChat, setMensagensChat] = useState([
    { id: 1, texto: 'Bom dia!', enviadaPorMim: true },
    { id: 2, texto: 'Seu pedido saiu para entrega?', enviadaPorMim: false },
    { id: 3, texto: 'Sim, já está a caminho.', enviadaPorMim: true },
  ]);

  const conversasFiltradas = DADOS_MOCK.filter(c => 
    c.nome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  const handleEnviarMensagem = (texto) => {
    setMensagensChat([...mensagensChat, { 
      id: Date.now(), 
      texto, 
      enviadaPorMim: true 
    }]);
  };

  return (
    <div className="relative min-h-screen w-full bg-[var(--cor-fundo-primaria)] overflow-hidden flex flex-col">
      
      {/* Header Desktop (Sempre oculto no mobile) */}
      <div className="hidden md:block w-full px-3 pt-3 z-20">
        <HeaderPrincipal 
          logoSrc={logoToAkiMini}
          mostrarAcoes
        />
      </div>

      <main className="flex-1 relative flex justify-center md:items-start md:pt-[30px]">
        
        {/* Card Principal Container */}
        <div className="
          w-full h-full 
          md:w-[1038px] md:h-[80vh] 
          bg-[#F9F9F9] 
          md:rounded-[20px] 
          md:shadow-[0px_4px_4px_rgba(0,0,0,0.25)] 
          md:border md:border-black/10
          flex flex-col md:flex-row overflow-hidden
        ">
          
          {/* ================= ESQUERDA: LISTA ================= */}
          <div className={`
            w-full md:w-[354px] h-full flex-col bg-[#F9F9F9] md:border-r border-[var(--cor-borda-neutra)]
            ${conversaAtiva ? 'hidden md:flex' : 'flex'} 
          `}>
            
            {/* Header Lista */}
            <div className="flex flex-col gap-[10px] p-[16px] md:p-[24px]">
              <h2 className="font-['Montserrat'] font-semibold text-[20px] md:text-[24px] text-black text-center md:text-left mb-2">
                Conversas
              </h2>
              {/* Input Busca */}
              <div className="relative w-full h-[42px]">
                <input
                  type="text"
                  placeholder="Buscar"
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                  className="
                    w-full h-full pl-[12px] pr-[40px]
                    bg-transparent
                    border border-[rgba(117,117,117,0.24)]
                    rounded-[10px]
                    font-['Montserrat'] text-[16px] text-[#757575]
                    focus:outline-none focus:border-[var(--cor-marca-secundaria)]
                  "
                />
                <div className="absolute right-[12px] top-1/2 -translate-y-1/2">
                  <Icone path="lupa" tamanho={18} cor="rgba(0,0,0,0.8)" />
                </div>
              </div>
            </div>

            {/* Lista Scrollável */}
            <div className="flex-1 overflow-y-auto px-[10px] md:px-[16px] pb-24 md:pb-0">
              {conversasFiltradas.map((conversa) => (
                <ItemListaConversa
                  key={conversa.id}
                  nome={conversa.nome}
                  ultimaMensagem={conversa.mensagem}
                  naoLidas={conversa.naoLidas}
                  ativo={conversaAtiva?.id === conversa.id}
                  onClick={() => setConversaAtiva(conversa)}
                />
              ))}
            </div>
          </div>

          {/* ================= DIREITA: CHAT ================= */}
          {/* ALTERAÇÃO AQUI:
              - Mobile (conversaAtiva): usa 'fixed inset-0 z-50' para cobrir TUDO.
              - Desktop: usa 'md:static md:flex-1' para ficar dentro do card.
          */}
          <div className={`
            bg-white flex-col
            ${conversaAtiva 
              ? 'fixed inset-0 z-50 flex md:static md:flex-1' 
              : 'hidden md:flex md:flex-1'}
          `}>
            
            {conversaAtiva ? (
              <>
                {/* Header Mobile do Chat (Botão Voltar) */}
                <div className="md:hidden flex items-center p-4 border-b border-gray-100 bg-[#F9F9F9] shadow-sm shrink-0">
                  <button onClick={() => setConversaAtiva(null)} className="mr-4 p-1">
                    <Icone path="retorno" tamanho={24} />
                  </button>
                  <div className="flex flex-col">
                    <span className="font-semibold text-lg leading-tight">{conversaAtiva.nome}</span>
                    <span className="text-xs text-gray-500">Online agora</span>
                  </div>
                </div>

                {/* Área de Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-white">
                  {mensagensChat.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`
                        max-w-[75%] p-3 rounded-xl text-sm font-['Montserrat'] leading-relaxed shadow-sm
                        ${msg.enviadaPorMim 
                          ? 'bg-[var(--cor-marca-primaria)] text-white self-end rounded-br-none' 
                          : 'bg-[#F0F0F0] text-black self-start rounded-bl-none'}
                      `}
                    >
                      {msg.texto}
                    </div>
                  ))}
                </div>

                {/* Barra de Input (Fixa no bottom do container flex) */}
                <div className="shrink-0">
                  <BarraEnvioMensagem onEnviar={handleEnviarMensagem} />
                </div>
              </>
            ) : (
              /* Placeholder Desktop (Nenhuma conversa selecionada) */
              <div className="hidden md:flex flex-1 items-center justify-center text-[#757575] flex-col gap-4 bg-white">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icone path="chat" tamanho={40} cor="#D9D9D9" />
                </div>
                <p className="font-medium">Selecione uma conversa para iniciar</p>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ALTERAÇÃO AQUI: 
          Barra de Navegação só aparece se NÃO houver conversa ativa.
      */}
      {!conversaAtiva && (
        <div className="md:hidden">
          <BarraNavegacaoInferior itemAtivo="chat" />
        </div>
      )}
    </div>
  );
};

export default TelaConversas;