import React from 'react';
import FormularioLogin from '../componentes/organismos/FormularioLogin';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import LogoImagem from '../componentes/atomos/LogoImagem';
import logoToAki from '../ativos/toaki_logo.png';

const LoginPagina = () => {
  return (
    <div className="
      min-h-screen w-full 
      bg-[var(--cor-fundo-primaria)] 
      flex flex-col 
      overflow-hidden /* Garante que não haja scroll */
    ">
      
      {/* Header Desktop (Logo + Avatar) - Removemos absolute, agora é flex item */}
      <div className="hidden md:block w-full z-20">
        <HeaderPrincipal 
          logoSrc={logoToAki} 
          onAvatarClick={() => console.log('Login Avatar')} 
        />
      </div>

      {/* Container Principal (Centralizado) - Flex grow para ocupar o resto da altura */}
      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
        
        {/* Logo Mobile (Aparece em cima do card, some no Desktop) */}
        <div className="mb-4 flex flex-col items-center md:hidden animate-fade-in-down">
          <LogoImagem 
            src={logoToAki} 
            alt="Tô Aki Logo" 
            className="w-[197px] h-[122px] object-contain drop-shadow-sm" 
          />
        </div>

        {/* Card de Login */}
        <main className="z-10 px-4 pb-4 md:p-0 flex items-center justify-center w-full">
          <FormularioLogin />
        </main>
      </div>

    </div>
  );
};

export default LoginPagina;