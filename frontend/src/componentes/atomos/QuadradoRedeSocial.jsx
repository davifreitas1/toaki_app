import React from 'react';

const QuadradoRedeSocial = ({ children, className = '', ...props }) => {
  return (
    <button
      type="button"
      className={`
        w-[var(--tamanho-quadrado-social)]
        h-[var(--tamanho-quadrado-social)]
        bg-[var(--cor-social-quadrado)]
        rounded-md
        flex
        items-center
        justify-center
        shadow-sm
        hover:brightness-110
        transition
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default QuadradoRedeSocial;
