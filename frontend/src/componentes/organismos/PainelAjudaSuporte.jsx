import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importação dos Átomos
import Icone from '../atomos/Icone';
import TituloSecao from '../atomos/TituloSecao';

const PainelAjudaSuporte = () => {
  const navigate = useNavigate();

  // Estado para mensagens do chat (Inicia vazio)
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");

  const handleEnviar = () => {
    if (novaMensagem.trim()) {
      setMensagens([...mensagens, {
        id: Date.now(),
        texto: novaMensagem,
        horario: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        enviadaPorMim: true,
        lida: false
      }]);
      setNovaMensagem("");
    }
  };

  // Renderiza itens do Menu Lateral (Padrão Desktop)
  const renderMenuItem = (pathIcone, texto, rota, ativo = false) => (
    <button
      type="button"
      onClick={() => navigate(rota)}
      className="flex items-center gap-8 w-full py-2.5 mb-8 bg-transparent cursor-pointer group hover:opacity-80 transition-opacity"
    >
      <div className={`
        w-[36px] h-[34px] flex justify-center items-center rounded-[4px]
        ${ativo ? 'border border-[#000000]' : 'border border-transparent group-hover:border-[#000000]'}
      `}>
        <Icone path={pathIcone} tamanho={24} cor="#2A2A2A" />
      </div>
      <span className={`
        font-['Montserrat'] text-[24px] leading-[29px] text-[#2A2A2A]
        ${ativo ? 'font-bold' : 'font-medium'}
      `}>
        {texto}
      </span>
    </button>
  );

  return (
    // Wrapper Geral
    <div className="flex justify-center items-start md:items-center w-full min-h-screen bg-[#F9F9F9] md:bg-[#FFF6E9] p-0 md:p-10 font-['Montserrat']">
      
      {/* Card Principal 
          - Adicionado 'relative' para o posicionamento absoluto da linha funcionar
      */}
      <div className="
        relative w-full max-w-[1263px] 
        flex flex-col md:flex-row 
        bg-transparent md:bg-[#F9F9F9]
        md:rounded-[20px] md:shadow-[0px_4px_4px_rgba(0,0,0,0.25)] 
        md:min-h-[928px]
        overflow-hidden
      ">
        
        {/* === SIDEBAR ATUALIZADA === */}
        <aside className="hidden md:flex flex-col w-[265px] pt-[60px] pl-[40px] pb-[40px] shrink-0">
          <nav>
            {renderMenuItem('editar', 'Editar Perfil', '/perfil/editar', false)}
            {renderMenuItem('documento', 'Alterar Dados', '/perfil/dados', false)}
            {renderMenuItem('chat', 'Ajuda e Suporte', '/perfil/ajuda', true)}
          </nav>
        </aside>

        {/* LINHA DIVISÓRIA VERTICAL (Line 45) - CORRIGIDA
           - Usando absolute para garantir que apareça independente do flexbox
           - left-[350px]: Ajustado visualmente para ficar após a sidebar + margens
           - top-0 bottom-0: Estica de ponta a ponta (928px)
           - w-[3px]: Espessura da borda
           - bg-[#EDEDED]: Cor da borda
        */}
        <div className="hidden md:block absolute left-[350px] top-0 bottom-0 w-[3px] bg-[#EDEDED]"></div>

        {/* === CONTEÚDO PRINCIPAL (Chat) === 
            - Adicionado ml-[100px] para compensar o espaço da linha absoluta e margens
        */}
        <main className="grow flex flex-col items-center pt-0 md:pt-[40px] px-0 md:px-0 md:ml-[100px] w-full relative h-full">
          
          {/* Header Mobile (Seta Voltar) */}
          <div className="flex items-center w-full mb-2 gap-3 relative md:hidden px-4 mt-4">
            <Icone path="retorno" tamanho={24} cor="#000000" aoClicar={() => navigate(-1)} />
            <span className="text-[12px] font-semibold text-black leading-[15px]">
              Ajuda e Suporte
            </span>
          </div>

          {/* TÍTULO DESKTOP */}
          <div className="hidden md:block mb-8 text-center">
            <TituloSecao className="!text-[32px] !font-bold text-[rgba(0,0,0,0.73)]">
              Ajuda e Suporte
            </TituloSecao>
          </div>

          {/* === ÁREA DO CHAT === */}
          <div className="w-full md:max-w-[847px] flex flex-col h-[calc(100vh-100px)] md:h-[650px] relative">
            
            {/* Header do Chat (Avatar + Nome) */}
            <div className="flex items-center gap-3 p-3 border-b border-[#EDEDED] md:border-b-0 md:mb-4">
               {/* Avatar */}
               <div className="
                 w-[24px] h-[24px] md:w-[48px] md:h-[48px] 
                 bg-[#F9F9F9] border border-[#EDEDED] rounded-full 
                 flex justify-center items-center overflow-hidden
               ">
                 <Icone path="usuario" tamanho={16} cor="#757575" /> 
               </div>
               
               {/* Nome ChatBot */}
               <span className="font-['Montserrat'] font-medium text-[16px] md:text-[24px] text-[#2A2A2A]">
                 ChatBot
               </span>
            </div>

            {/* Linha Divisória Horizontal (Line 40) */}
            <div className="hidden md:block w-full border-t-[0.5px] border-black/20 mb-6"></div>

            {/* Lista de Mensagens */}
            <div className="flex-grow overflow-y-auto px-4 py-2 flex flex-col gap-4 scrollbar-thin">
              {mensagens.length === 0 ? (
                <div className="flex justify-center items-center h-full text-[#757575] text-sm">
                  Comece uma conversa...
                </div>
              ) : (
                mensagens.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[80%] ${msg.enviadaPorMim ? 'self-end items-end' : 'self-start items-start'}`}
                  >
                    {/* Balão */}
                    <div className="
                      bg-[#F9F9F9] border border-[#D9D9D9] rounded-[12px] 
                      px-4 py-2 min-w-[100px] relative shadow-sm
                    ">
                      <p className={`
                        font-['Montserrat'] text-[12px] text-[#757575] 
                        ${msg.enviadaPorMim ? 'text-right' : 'text-left'}
                      `}>
                        {msg.texto}
                      </p>
                    </div>
                    
                    {/* Meta-dados */}
                    <div className="flex items-center gap-1 mt-1 px-1">
                      <span className="font-['Montserrat'] text-[10px] text-[#757575]">{msg.horario}</span>
                      {msg.enviadaPorMim && (
                        <div className="flex gap-[1px]">
                           <div className={`w-[3px] h-[3px] rounded-full ${msg.lida ? 'bg-[#0FB5B5]' : 'bg-[#757575]'}`}></div>
                           <div className={`w-[3px] h-[3px] rounded-full ${msg.lida ? 'bg-[#0FB5B5]' : 'bg-[#757575]'}`}></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input de Envio */}
            <div className="p-4 w-full flex justify-center mt-auto md:mb-10">
               <div className="
                 relative w-full md:w-[847px] h-[45px] md:h-[43px]
                 bg-[#EDEDED] md:bg-[#F9F9F9] 
                 border border-[#EDEDED] md:border-[#000000] md:border-[0.5px]
                 rounded-[32px] md:rounded-[30px]
                 flex items-center px-4
               ">
                 <input 
                   type="text" 
                   value={novaMensagem}
                   onChange={(e) => setNovaMensagem(e.target.value)}
                   onKeyPress={(e) => e.key === 'Enter' && handleEnviar()}
                   placeholder="Digite sua mensagem..."
                   className="flex-grow bg-transparent border-none outline-none text-[#2A2A2A] text-sm md:text-base font-['Montserrat']"
                 />
                 
                 <button 
                   onClick={handleEnviar}
                   className="
                     w-[28px] h-[28px] rounded-full border border-[#D9D9D9] bg-transparent 
                     flex justify-center items-center cursor-pointer hover:bg-gray-200 transition-colors
                   "
                 >
                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </button>
               </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default PainelAjudaSuporte;