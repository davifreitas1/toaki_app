import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// Importação dos Átomos (Caminhos relativos baseados na estrutura do repositório)
import BotaoPrimario from '../atomos/BotaoPrimario';
import Icone from '../atomos/Icone';
import TituloSecao from '../atomos/TituloSecao';
import Input from '../atomos/Input';

const PainelEditarPerfil = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Estados do formulário
  const [dados, setDados] = useState({
    nome: 'João',
    sobrenome: 'Silva',
  });
  const [imagemPreview, setImagemPreview] = useState(null);

  // Manipula alterações nos inputs
  const handleChange = (id, valor) => {
    setDados((prev) => ({ ...prev, [id]: valor }));
  };

  // Abre o seletor de arquivos ao clicar no avatar ou botão
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  // Processa o upload da imagem para preview local
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagemPreview(URL.createObjectURL(file));
    }
  };

  // Renderiza itens do Menu Lateral (Apenas Desktop)
  const renderMenuItem = (pathIcone, texto, rota, ativo = false) => (
    <button
      type="button"
      onClick={() => navigate(rota)} // Adicionada navegação
      className="flex items-center gap-8 w-full py-2.5 mb-8 bg-transparent border-none cursor-pointer group hover:opacity-80 transition-opacity"
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
    </button>
  );

  return (
    // Wrapper Geral (Cor de fundo primária do App)
    <div className="flex justify-center items-start md:items-center w-full min-h-screen bg-[#F9F9F9] md:bg-[#FFF6E9] p-0 md:p-10 font-['Montserrat']">
      
      {/* Card Principal (Container Branco com Sombra no Desktop) */}
      <div className="
        relative w-full max-w-[1263px] 
        flex flex-col md:flex-row 
        bg-transparent md:bg-[#F9F9F9]
        md:rounded-[20px] md:shadow-[0px_4px_4px_rgba(0,0,0,0.25)] 
        md:min-h-[736px] md:p-10
      ">
        
        {/* === SIDEBAR ATUALIZADA === */}
        <aside className="hidden md:flex flex-col w-[265px] pt-[60px] shrink-0">
          <nav>
            {/* Note os caminhos das rotas adicionados */}
            {renderMenuItem('editar', 'Editar Perfil', '/perfil/editar', true)}
            {renderMenuItem('documento', 'Alterar Dados', '/perfil/dados', false)}
            {renderMenuItem('chat', 'Ajuda e Suporte', '/perfil/ajuda', false)}
          </nav>
        </aside>

        {/* Linha Divisória Vertical */}
        <div className="hidden md:block w-[3px] bg-[#EDEDED] mx-10 min-h-[600px] self-stretch"></div>

        {/* === CONTEÚDO PRINCIPAL === */}
        <main className="grow flex flex-col items-center pt-5 md:pt-[40px] px-6 md:px-0 gap-8 w-full">
          
          {/* HEADER MOBILE (Botão Voltar + Título) */}
          <div className="flex items-center w-full mb-6 gap-3 relative md:hidden">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center bg-transparent border-none p-0 cursor-pointer"
            >
               <Icone path="retorno" tamanho={24} cor="#000000" />
            </button>
            <span className="text-[12px] font-semibold text-black leading-[15px]">
              Editar Perfil
            </span>
          </div>

          {/* TÍTULO DESKTOP */}
          <div className="hidden md:block mb-2 text-center">
            <TituloSecao className="!text-[32px] !font-bold text-[rgba(0,0,0,0.73)]">
              Editar Perfil
            </TituloSecao>
          </div>

          {/* === SEÇÃO DE AVATAR & UPLOAD === */}
          <div className="flex flex-col items-center gap-5 w-full md:w-auto mb-2 md:mb-0 relative">
            
            {/* Input Invisível */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Círculo do Avatar */}
            <div 
              onClick={handleAvatarClick}
              className="
                w-[93px] h-[93px] md:w-[157px] md:h-[157px] 
                bg-[#F9F9F9] cursor-pointer
                border-[4px] border-[#EDEDED] rounded-full 
                flex justify-center items-center overflow-hidden
                relative group
              "
            >
               {imagemPreview ? (
                 <img src={imagemPreview} alt="Avatar" className="w-full h-full object-cover" />
               ) : (
                 <Icone path="usuario" tamanho={64} cor="#757575" />
               )}
               
               {/* Overlay Hover Desktop */}
               <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity justify-center items-center">
                 <Icone path="editar" tamanho={32} cor="#FFFFFF" />
               </div>
            </div>

            {/* Ícone Editar Flutuante (Mobile) */}
            <div 
              onClick={handleAvatarClick}
              className="md:hidden absolute bottom-0 right-[calc(50%-46px)] bg-[#F9F9F9] border border-[#EDEDED] rounded-full p-1 cursor-pointer shadow-sm"
            >
               <Icone path="editar" tamanho={16} cor="#2A2A2A" />
            </div>

            {/* BOTÃO "Fazer upload da imagem" (Desktop Only) */}
            <div 
              onClick={handleAvatarClick}
              className="
                hidden md:flex justify-center items-center px-2 py-1 
                bg-[#F9F9F9] border border-[#757575] rounded-[4px] 
                w-[170px] h-[23px] gap-2
                cursor-pointer hover:bg-gray-100 transition-colors
              "
            >
              <Icone path="editar" tamanho={12} cor="#2A2A2A" />
              <span className="font-semibold text-[10px] text-[#2A2A2A]">
                Fazer upload da imagem
              </span>
            </div>
          </div>

          {/* === FORMULÁRIO === */}
          <div className="flex flex-col gap-[15px] md:gap-5 w-full max-w-[553px] mt-2 md:mt-0 items-center">
            
            {/* Input Nome */}
            <div className="flex flex-col gap-1 md:gap-2 w-full">
              <label 
                htmlFor="input-nome" 
                className="
                  text-[11px] leading-[13px] text-[#000000] font-normal 
                  md:text-[18px] md:leading-[22px] md:text-[#757575] md:font-semibold 
                  pl-1
                "
              >
                Nome
              </label>
              <div className="
                w-full [&_input]:w-full
                /* Estilo Mobile (iOS) */
                [&_input]:h-[33px] [&_input]:rounded-[12px] [&_input]:border-[#D9D9D9] [&_input]:bg-[#F9F9F9] [&_input]:text-[12px] [&_input]:text-[#757575] [&_input]:px-4
                /* Estilo Desktop */
                md:[&_input]:h-[91px] md:[&_input]:rounded-[4px] md:[&_input]:border-[#EDEDED] md:[&_input]:text-[16px] md:[&_input]:text-[#2A2A2A]
              ">
                <Input 
                  id="input-nome"
                  tipo="text"
                  valor={dados.nome}
                  aoMudar={(e) => handleChange('nome', e.target.value)}
                />
              </div>
            </div>

            {/* Input Sobrenome */}
            <div className="flex flex-col gap-1 md:gap-2 w-full">
              <label 
                htmlFor="input-sobrenome" 
                className="
                  text-[11px] leading-[13px] text-[#000000] font-normal 
                  md:text-[18px] md:leading-[22px] md:text-[#757575] md:font-semibold 
                  pl-1
                "
              >
                Sobrenome
              </label>
              <div className="
                w-full [&_input]:w-full
                [&_input]:h-[33px] [&_input]:rounded-[12px] [&_input]:border-[#D9D9D9] [&_input]:bg-[#F9F9F9] [&_input]:text-[12px] [&_input]:text-[#757575] [&_input]:px-4
                md:[&_input]:h-[91px] md:[&_input]:rounded-[4px] md:[&_input]:border-[#EDEDED] md:[&_input]:text-[16px] md:[&_input]:text-[#2A2A2A]
              ">
                <Input 
                  id="input-sobrenome"
                  tipo="text"
                  valor={dados.sobrenome}
                  aoMudar={(e) => handleChange('sobrenome', e.target.value)}
                />
              </div>
            </div>

          </div>

          {/* === BOTÃO SALVAR (Centralizado e Responsivo) === */}
          <div className="w-full max-w-[553px] flex justify-center mt-8 md:mt-2">
            <BotaoPrimario 
              onClick={() => console.log('Salvar', dados)}
              className="
                !bg-[#0FB5B5] !shadow-[0px_4px_4px_rgba(0,0,0,0.05)]
                /* Tamanho Mobile */
                !w-[122px] !h-[23px] !text-[12px] !font-semibold !rounded-[4px]
                /* Tamanho Desktop */
                md:!w-[247px] md:!h-[44px] md:!text-[20px] md:!rounded-[10px]
                flex items-center justify-center
              "
            >
              <span className="md:hidden">Salvar</span>
              <span className="hidden md:inline">Salvar Alterações</span>
            </BotaoPrimario>
          </div>

        </main>
      </div>
    </div>
  );
};

export default PainelEditarPerfil;