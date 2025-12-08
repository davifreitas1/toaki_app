import React from 'react';

const CampoTextoBase = ({ id, type = 'text', placeholder, value, onChange, className = '' }) => {
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full
        bg-[var(--cor-fundo-secundaria)]
        border border-[var(--cor-borda-neutra)]
        focus:outline-none
        focus:border-[var(--cor-marca-secundaria)]
        focus:ring-1
        focus:ring-[var(--cor-marca-secundaria)]
        transition-all
        
        /* Mobile (Default) */
        h-[33px]
        rounded-[12px]
        px-3
        text-[12px]
        
        /* Desktop */
        md:h-[41px]
        md:text-[16px]
        md:placeholder:text-[16px]
        
        ${className}
      `}
    />
  );
};

export default CampoTextoBase;