import React from 'react';
import LogoImagem from '../componentes/atomos/LogoImagem';
import FormularioLogin from '../componentes/organismos/FormularioLogin';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import logoToAki from '../ativos/toaki_logo.png';
import Icone from '../componentes/atomos/Icone';

const LoginPagina = () => {
  return (
    <div className="min-h-screen w-full bg-[var(--cor-fundo-primaria)] flex flex-col">
      {/* Header reutilizável (apenas desktop) */}
      <HeaderPrincipal
        logoSrc={logoToAki}
        logoAlt="Tô Aki"
        icones={[
          {
            path: 'usuario',
            onClick: () => {
              console.log('clicou avatar');
            },
            cor: '#777777',
          },
        ]}
        exibirNoMobile={false}
      />

      {/* Conteúdo */}
      <main className="flex-1 flex justify-center items-center px-4 py-6 md:py-10">
        <div className="w-full max-w-[360px] md:max-w-[720px] flex flex-col items-center gap-4">
          {/* Logo apenas no mobile */}
          <div className="md:hidden pt-8">
            <LogoImagem src={logoToAki} className="h-[90px]" />
          </div>

          <FormularioLogin />
        </div>
      </main>
    </div>
  );
};

export default LoginPagina;
