import React from 'react';

const TituloSecao = ({ children, className = '' }) => {
  return (
    <h1
      className={`
        text-[24px] md:text-[48px]
        font-[var(--font-Medium)]
        text-[var(--cor-texto-primaria)]
        text-center
        ${className}
      `}
    >
      {children}
    </h1>
  );
};

export default TituloSecao;
