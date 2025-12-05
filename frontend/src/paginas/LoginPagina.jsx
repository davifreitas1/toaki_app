import React from 'react';
import LogoImagem from '../componentes/atomos/LogoImagem';
import FormularioLogin from '../componentes/organismos/FormularioLogin';
import logoToAki from '../ativos/toaki_logo.png';

const LoginPagina = () => {
  return (
    <div
      className="
        w-full
        h-screen
        bg-[var(--cor-fundo-primaria)]
        flex
        justify-center
        items-center
        px-0
      "
    >
      <div className="w-full h-full max-w-sm flex flex-col justify-between items-center">
        <LogoImagem src={logoToAki} className="max-h-24" />
        <FormularioLogin />
      </div>
    </div>
  );
};

export default LoginPagina;
