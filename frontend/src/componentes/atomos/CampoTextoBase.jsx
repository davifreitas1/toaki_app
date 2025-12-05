import React from 'react';

const CampoTextoBase = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`
        w-full
        bg-[var(--cor-input-fundo)]
        border
        border-[var(--cor-input-borda)]
        rounded-[var(--radius-md)]
        text-[var(--font-size-xs)]
        text-[var(--cor-texto-primaria)]
        placeholder:text-[var(--cor-input-placeholder)]
        h-25
        py-2
        px-4
        focus:outline-none
        focus:ring-2
        focus:ring-[var(--cor-marca-secundaria)]
        ${className}
      `}
    />
  );
};

export default CampoTextoBase;
