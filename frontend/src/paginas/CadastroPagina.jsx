import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import FormularioCadastro from '../componentes/organismos/FormularioCadastro';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import LogoImagem from '../componentes/atomos/LogoImagem';
import logoToAki from '../ativos/toaki_logo.png';

const CadastroPagina = () => {
  const navigate = useNavigate();

  return (
    <div className="
      min-h-screen w-full 
      bg-[var(--cor-fundo-primaria)] 
      flex flex-col 
      overflow-y-auto 
      overflow-x-hidden
    ">
      
      {/* Header Desktop */}
      <div className="hidden md:block w-full z-20">
        <HeaderPrincipal 
          logoSrc={logoToAki} 
          onAvatarClick={() => console.log('Cadastro Avatar')} 
        />
      </div>

      {/* Container Principal */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full py-6 md:py-0">
        
        {/* --- BOTÃO VOLTAR (MOBILE APENAS) --- */}
        {/* Renderiza apenas em telas pequenas. No fluxo da página, alinhado à esquerda. */}
        <div className="w-full px-6 mb-2 md:hidden flex justify-start">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-[14px] font-semibold font-['Montserrat'] text-black hover:opacity-70"
          >
            <ChevronLeft size={20} />
            Voltar
          </button>
        </div>

        {/* Logo Mobile */}
        <div className="mb-4 flex flex-col items-center md:hidden animate-fade-in-down">
          <LogoImagem 
            src={logoToAki} 
            alt="Tô Aki Logo" 
            className="w-[129px] h-[80px] object-contain drop-shadow-sm" 
          />
        </div>

        {/* Card de Cadastro */}
        <main className="z-10 px-4 md:p-0 flex items-center justify-center w-full">
          <FormularioCadastro />
        </main>
      </div>

    </div>
  );
};

export default CadastroPagina;