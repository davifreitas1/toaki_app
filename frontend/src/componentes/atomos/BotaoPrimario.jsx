import React from 'react';

const BotaoPrimario = ({ children, onClick, type = 'button', className = '', disabled = false }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full
        h-[37px]
        bg-[var(--cor-marca-secundaria)]
        text-[var(--cor-branco-generico)]
        font-['Montserrat']
        font-semibold
        hover:brightness-110
        active:scale-[0.98]
        transition-all
        disabled:opacity-60
        shadow-[0_4px_4px_rgba(0,0,0,0.25)]
        flex items-center justify-center
        
        /* Mobile */
        text-[16px]
        rounded-[8px]

        /* Desktop */
        md:text-[20px] 
        
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default BotaoPrimario;