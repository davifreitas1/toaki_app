import React from 'react';
import HeaderPrincipal from '../componentes/organismos/HeaderPrincipal';
import logoToAki from '../ativos/toaki_logo.png';

const TelaPrincipalVendedor = () => {
  return (
    <div className="min-h-screen bg-[var(--cor-fundo-primaria)] text-black">
      <HeaderPrincipal
        logoSrc={logoToAki}
        onAvatarClick={() => console.log('Tela principal vendedor')}
      />
      <div className="p-6 md:p-10">
        <h1 className="text-2xl md:text-4xl font-semibold mb-4">Área do vendedor</h1>
        <p className="text-base md:text-lg text-gray-700">
          Login realizado com sucesso. Em breve esta tela mostrará os pedidos e
          controles do vendedor.
        </p>
      </div>
    </div>
  );
};

export default TelaPrincipalVendedor;