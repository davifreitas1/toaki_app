import React from 'react';

const Etiqueta = ({ alvo, texto, variante }) => {
  const opcoes = {
    login: 'text-texto-preto-opaco text-base font-semibold'
  }

  return (
    <label htmlFor={alvo} className={`${opcoes[variante]} block`}>
      {texto}
    </label>
  );
};

export default Etiqueta;