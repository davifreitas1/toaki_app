import React from 'react';

const Icone = ({ path, tamanho = 24, cor = 'currentColor', aoClicar, viewBox = "0 0 24 24" }) => {
  return (
    <button 
      onClick={aoClicar}
      className="flex items-center justify-center transition-opacity hover:opacity-70 focus:outline-none"
      type="button"
    >
      <svg 
        width={tamanho} 
        height={tamanho} 
        viewBox={viewBox} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          d={path} 
          stroke={cor} 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default Icone;