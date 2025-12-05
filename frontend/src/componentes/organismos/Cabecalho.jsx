import React from 'react';
import logoPadrao from '../../assets/toaki_logo.jpeg';

const Cabecalho = ({ logo = logoPadrao, aoClicarLogo, aoClicarPerfil }) => {
  return (
    <header className="w-full h-20 flex justify-between items-center px-6 py-4 md:px-10 bg-[#f9f9f9] shadow-media">
      
      {/* Área da Logo (Imagem) */}
      <div 
        onClick={aoClicarLogo}
        className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
      >
        <img 
          src={logo} 
          alt="Logo Tô Aki" 
          className="h-10 md:h-14 w-auto object-contain"
        />
      </div>

      {/* Área do Perfil (SVG) */}
      <button 
        onClick={aoClicarPerfil}
        className="group p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-marca-secundaria"
        title="Perfil do Usuário"
      >
        {/* Ajuste o viewBox se necessário (padrão costuma ser 0 0 24 24 ou 0 0 512 512 dependendo do seu SVG) */}
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            // Classes para cor e tamanho responsivo (24px mobile / 32px desktop)
            className="w-6 h-6 md:w-8 md:h-8 text-texto-secundaria group-hover:text-marca-secundaria transition-colors"
        >
            {/* COLE SEU PATH ESPECÍFICO AQUI EMBAIXO NA PROPRIEDADE 'd' */}
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
      </button>
    </header>
  );
};

export default Cabecalho;