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
        max-w-[266px]
        bg-[var(--cor-marca-secundaria)]
        text-white
        text-[16px] md:text-[20px]
        font-[var(--font-SemiBold)]
        rounded-[8px]
        py-3
        px-4
        mx-auto
        block
        text-center
        shadow
        hover:brightness-110
        active:scale-[0.99]
        transition
        disabled:opacity-60
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default BotaoPrimario;
