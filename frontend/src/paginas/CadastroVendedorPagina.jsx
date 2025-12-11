import React from 'react';
import FormularioCadastroVendedor from '../componentes/organismos/FormularioCadastroVendedor';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import LogoImagem from '../componentes/atomos/LogoImagem';
import logoToAki from '../ativos/toaki_logo.png';

const CadastroVendedorPagina = () => {
  return (
    <div
      className="
      min-h-screen w-full
      bg-[var(--cor-fundo-primaria)]
      flex flex-col
      overflow-hidden
    "
    >
      <div className="hidden md:block w-full z-20">
        <HeaderPrincipal
          logoSrc={logoToAki}
          onAvatarClick={() => console.log('Cadastro Vendedor Avatar')}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative w-full">
        <div className="mb-4 flex flex-col items-center md:hidden animate-fade-in-down">
          <LogoImagem
            src={logoToAki}
            alt="Tô Aki Logo"
            className="w-[197px] h-[122px] object-contain drop-shadow-sm"
          />
        </div>

        <main className="z-10 px-4 pb-4 md:p-0 flex items-center justify-center w-full">
          <FormularioCadastroVendedor />
        </main>
      </div>
    </div>
  );
};

export default CadastroVendedorPagina;