import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importação dos Átomos
import BotaoPrimario from '../atomos/BotaoPrimario';
import Icone from '../atomos/Icone';
import TituloSecao from '../atomos/TituloSecao';
import Input from '../atomos/Input';

const PainelAlterarDados = () => {
  const navigate = useNavigate();

  // Estado dos dados
  const [dados, setDados] = useState({
    email: 'exemplo@email.com',
    senha: '',
    confirmarSenha: '', // Novo campo no estado
    celular: '+55 (81) 9 9090-0000',
  });

  // Estados para visibilidade das senhas
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  const handleChange = (id, valor) => {
    setDados((prev) => ({ ...prev, [id]: valor }));
  };

  const toggleMostrarSenha = () => {
    setMostrarSenha(!mostrarSenha);
  };

  const toggleMostrarConfirmarSenha = () => {
    setMostrarConfirmarSenha(!mostrarConfirmarSenha);
  };

  // Renderiza itens do Menu Lateral (Desktop)
  const renderMenuItem = (pathIcone, texto, rota, ativo = false) => (
    <div // Mantive a div wrapper se preferir, ou troque por button como no anterior para consistência
      className="flex items-center gap-8 w-full py-2.5 mb-8 bg-transparent cursor-pointer group hover:opacity-80 transition-opacity"
      onClick={() => navigate(rota)} // Adicionada navegação
    >
      <div className={`
        w-[34px] h-[34px] flex justify-center items-center rounded-[4px]
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
    </div>
  );

  return (
    // Wrapper Geral
    <div className="flex justify-center items-start md:items-center w-full min-h-screen bg-[#F9F9F9] md:bg-[#FFF6E9] p-0 md:p-10 font-['Montserrat']">
      
      {/* Card Principal */}
      <div className="
        relative w-full max-w-[1263px] 
        flex flex-col md:flex-row 
        bg-transparent md:bg-[#F9F9F9]
        md:rounded-[20px] md:shadow-[0px_4px_4px_rgba(0,0,0,0.25)] 
        md:min-h-[928px] md:p-10
      ">
        
        {/* === SIDEBAR ATUALIZADA === */}
        <aside className="hidden md:flex flex-col w-[265px] pt-[60px] shrink-0">
          <nav>
            {renderMenuItem('editar', 'Editar Perfil', '/perfil/editar', false)}
            {renderMenuItem('documento', 'Alterar Dados', '/perfil/dados', true)} 
            {renderMenuItem('chat', 'Ajuda e Suporte', '/perfil/ajuda', false)}
          </nav>
        </aside>

        {/* Linha Divisória */}
        <div className="hidden md:block w-[3px] bg-[#EDEDED] mx-10 min-h-[600px] self-stretch"></div>

        {/* === CONTEÚDO PRINCIPAL === */}
        <main className="grow flex flex-col items-center pt-5 md:pt-[40px] px-6 md:px-0 gap-8 w-full">
          
          {/* HEADER MOBILE */}
          <div className="flex items-center w-full mb-6 gap-3 relative md:hidden">
            <Icone 
              path="retorno" 
              tamanho={24} 
              cor="#000000" 
              aoClicar={() => navigate(-1)} 
            />
            <span className="text-[12px] font-semibold text-black leading-[15px]">
              Alterar Dados
            </span>
          </div>

          {/* TÍTULO DESKTOP */}
          <div className="hidden md:block mb-2 text-center">
            <TituloSecao className="!text-[32px] !font-bold text-[rgba(0,0,0,0.73)]">
              Alterar Dados
            </TituloSecao>
          </div>

          {/* === FORMULÁRIO === */}
          <div className="flex flex-col gap-[15px] md:gap-5 w-full max-w-[553px] mt-2 md:mt-0 items-center">
            
            {/* Input E-mail */}
            <div className="flex flex-col gap-1 md:gap-2 w-full">
              <label 
                htmlFor="input-email" 
                className="
                  text-[11px] leading-[13px] text-[#000000] font-normal 
                  md:text-[18px] md:leading-[22px] md:text-[#757575] md:font-semibold 
                  pl-1
                "
              >
                E-mail
              </label>
              <div className="
                w-full [&_input]:w-full
                [&_input]:h-[33px] [&_input]:rounded-[12px] [&_input]:border-[#D9D9D9] [&_input]:bg-[#F9F9F9] [&_input]:text-[12px] [&_input]:text-[#757575] [&_input]:px-4
                md:[&_input]:h-[91px] md:[&_input]:rounded-[4px] md:[&_input]:border-[#EDEDED] md:[&_input]:text-[16px] md:[&_input]:text-[#2A2A2A]
              ">
                <Input 
                  id="input-email"
                  tipo="email"
                  valor={dados.email}
                  aoMudar={(e) => handleChange('email', e.target.value)}
                />
              </div>
            </div>

            {/* Input Senha */}
            <div className="flex flex-col gap-1 md:gap-2 w-full relative">
              <label 
                htmlFor="input-senha" 
                className="
                  text-[11px] leading-[13px] text-[#000000] font-normal 
                  md:text-[18px] md:leading-[22px] md:text-[#757575] md:font-semibold 
                  pl-1
                "
              >
                Senha
              </label>
              <div className="relative w-full">
                <div className="
                  w-full [&_input]:w-full
                  [&_input]:h-[33px] [&_input]:rounded-[12px] [&_input]:border-[#D9D9D9] [&_input]:bg-[#F9F9F9] [&_input]:text-[12px] [&_input]:text-[#757575] [&_input]:px-4
                  md:[&_input]:h-[91px] md:[&_input]:rounded-[4px] md:[&_input]:border-[#EDEDED] md:[&_input]:text-[16px] md:[&_input]:text-[#2A2A2A]
                ">
                  <Input 
                    id="input-senha"
                    tipo={mostrarSenha ? "text" : "password"}
                    valor={dados.senha}
                    aoMudar={(e) => handleChange('senha', e.target.value)}
                    placeholder="******************"
                  />
                </div>
                
                {/* Ícone Olho */}
                <div 
                  className="absolute right-3 top-[50%] translate-y-[-50%] cursor-pointer z-10"
                  onClick={toggleMostrarSenha}
                >
                  <div className={`w-[21px] h-[11px] bg-[#757575] ${mostrarSenha ? 'opacity-50' : 'opacity-100'}`} style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
                </div>
              </div>
            </div>

            {/* Input Confirmar Senha (NOVO) */}
            <div className="flex flex-col gap-1 md:gap-2 w-full relative">
              <label 
                htmlFor="input-confirmar-senha" 
                className="
                  text-[11px] leading-[13px] text-[#000000] font-normal 
                  md:text-[18px] md:leading-[22px] md:text-[#757575] md:font-semibold 
                  pl-1
                "
              >
                Confirmar Senha
              </label>
              <div className="relative w-full">
                <div className="
                  w-full [&_input]:w-full
                  [&_input]:h-[33px] [&_input]:rounded-[12px] [&_input]:border-[#D9D9D9] [&_input]:bg-[#F9F9F9] [&_input]:text-[12px] [&_input]:text-[#757575] [&_input]:px-4
                  md:[&_input]:h-[91px] md:[&_input]:rounded-[4px] md:[&_input]:border-[#EDEDED] md:[&_input]:text-[16px] md:[&_input]:text-[#2A2A2A]
                ">
                  <Input 
                    id="input-confirmar-senha"
                    tipo={mostrarConfirmarSenha ? "text" : "password"}
                    valor={dados.confirmarSenha}
                    aoMudar={(e) => handleChange('confirmarSenha', e.target.value)}
                    placeholder="******************"
                  />
                </div>
                
                {/* Ícone Olho (Confirmar) */}
                <div 
                  className="absolute right-3 top-[50%] translate-y-[-50%] cursor-pointer z-10"
                  onClick={toggleMostrarConfirmarSenha}
                >
                  <div className={`w-[21px] h-[11px] bg-[#757575] ${mostrarConfirmarSenha ? 'opacity-50' : 'opacity-100'}`} style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }}></div>
                </div>
              </div>
            </div>

            {/* Input Celular */}
            <div className="flex flex-col gap-1 md:gap-2 w-full">
              <label 
                htmlFor="input-celular" 
                className="
                  text-[11px] leading-[13px] text-[#000000] font-normal 
                  md:text-[18px] md:leading-[22px] md:text-[#757575] md:font-semibold 
                  pl-1
                "
              >
                Celular
              </label>
              <div className="
                w-full [&_input]:w-full
                [&_input]:h-[33px] [&_input]:rounded-[12px] [&_input]:border-[#D9D9D9] [&_input]:bg-[#F9F9F9] [&_input]:text-[12px] [&_input]:text-[#757575] [&_input]:px-4
                md:[&_input]:h-[91px] md:[&_input]:rounded-[4px] md:[&_input]:border-[#EDEDED] md:[&_input]:text-[16px] md:[&_input]:text-[#2A2A2A]
              ">
                <Input 
                  id="input-celular"
                  tipo="tel"
                  valor={dados.celular}
                  aoMudar={(e) => handleChange('celular', e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* === BOTÕES DE AÇÃO === */}
          <div className="w-full max-w-[553px] flex flex-col items-center gap-4 mt-8 md:mt-2">
            
            {/* Botão Salvar */}
            <BotaoPrimario 
              onClick={() => console.log('Salvar', dados)}
              className="
                !bg-[#0FB5B5] !shadow-[0px_4px_4px_rgba(0,0,0,0.05)]
                !w-[122px] !h-[23px] !text-[12px] !font-semibold !rounded-[4px]
                md:!w-[247px] md:!h-[44px] md:!text-[20px] md:!rounded-[10px]
                flex items-center justify-center
              "
            >
              <span className="md:hidden">Salvar</span>
              <span className="hidden md:inline">Salvar Alterações</span>
            </BotaoPrimario>

            {/* Botão Excluir Conta */}
            <button 
              type="button"
              className="
                bg-transparent border-none cursor-pointer
                font-['Montserrat'] font-semibold text-[#D93025]
                text-[12px] leading-[20px] w-[82px] h-[20px]
                md:text-[20px] md:leading-[24px] md:w-[137px] md:h-[24px]
                hover:opacity-80 transition-opacity
              "
              onClick={() => console.log('Excluir Conta')}
            >
              Excluir Conta
            </button>

          </div>

        </main>
      </div>
    </div>
  );
};

export default PainelAlterarDados;