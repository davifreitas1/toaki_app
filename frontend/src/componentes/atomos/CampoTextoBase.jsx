import React from 'react';

const CampoTextoBase = ({ className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`
        w-full
        bg-[var(--cor-fundo-secundaria)]
        border
        border-[var(--cor-borda-neutra)]
        rounded-[12px]
        text-[12px] md:text-[16px]
        text-[var(--cor-texto-primaria)]
        placeholder:text-[#D9D9D9]
        py-3
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
