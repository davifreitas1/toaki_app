import React from 'react';

const Input = ({ tipo, placeholder, valor, aoMudar, id }) => {
  return (
    <input
      id={id}
      type={tipo}
      value={valor}
      onChange={aoMudar}
      placeholder={placeholder}
      className="w-full h-25 p-4 bg-fundo-input border border-borda-generica rounded-medio text-base font-regular text-gray-700 placeholder-texto-placeholder focus:outline-none focus:border-marca-secundaria focus:ring-1 focus:ring-marca-secundaria transition-colors"
    />
  );
};

export default Input;