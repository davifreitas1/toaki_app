import React from 'react';

const LogoImagem = ({ src, alt = 'Logo', className = '' }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`w-auto object-contain ${className}`}
    />
  );
};

export default LogoImagem;
