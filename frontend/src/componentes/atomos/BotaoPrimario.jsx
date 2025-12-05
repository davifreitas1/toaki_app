import React from 'react';

const BotaoPrimario = ({
  children,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      className={`
        w-full
        max-w-[var(--largura-botao-padrao)]
        bg-[var(--cor-marca-secundaria)]
        [color:var(--cor-branco-generico)]
        text-base
        font-[var(--font-SemiBold)]
        rounded-[var(--radius-sm)]
        py-3
        px-4
        mx-auto
        block
        text-center
        shadow
        hover:brightness-110
        active:scale-[0.99]
        transition
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default BotaoPrimario;
