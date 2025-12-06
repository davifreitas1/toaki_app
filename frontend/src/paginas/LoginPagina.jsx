import React from 'react';
import LogoImagem from '../componentes/atomos/LogoImagem';
import FormularioLogin from '../componentes/organismos/FormularioLogin';
import logoToAki from '../ativos/toaki_logo.png';
import Icone from '../componentes/atomos/Icone';

const LoginPagina = () => {
  return (
    <div
      className="
        w-full
        h-screen
        bg-[var(--cor-fundo-primaria)]
        flex
        justify-center
      "
    >
      <div className="w-full h-full max-w-md flex flex-col items-center">
        <div className='py-[32px] px-[64px]'>
          <LogoImagem src={logoToAki} className="h-[122px]" />
        </div>
        <FormularioLogin />
      </div>
    </div>
  );
};

export default LoginPagina;
