import React from 'react';

const QuadradoRedeSocial = ({ children, className = '', ...props }) => {
  return (
    <button
      type="button"
      className={`
        w-[26px]
        h-[26px]
        md:w-[56px]
        md:h-[56px]
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
