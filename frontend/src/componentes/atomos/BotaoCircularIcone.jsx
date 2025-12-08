// src/componentes/atomos/BotaoCircularIcone.jsx
import React from 'react';

/**
 * Botão circular genérico usado em:
 * - seletor de raio
 * - filtros (tag, estrela)
 * - botão de localizar
 *
 * size em px (default 56 para seguir o Figma)
 */
const BotaoCircularIcone = ({
  children,
  size = 56,
  ativo = false,
  className = '',
  ...props
}) => {
  const estiloTamanho = {
    width: `${size}px`,
    height: `${size}px`,
  };

  return (
    <button
      type="button"
      style={estiloTamanho}
      className={`
        flex items-center justify-center
        rounded-full
        bg-[var(--cor-branco-generico)]
        shadow-[0_4px_4px_rgba(0,0,0,0.10)]
        ${ativo ? 'ring-2 ring-[var(--cor-marca-secundaria)]' : ''}
        transition
        active:scale-95
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default BotaoCircularIcone;
