import React from 'react';

const LogoImagem = ({ src, alt = 'Logo', className = '' }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`mx-auto my-auto max-h-32 w-auto object-contain ${className}`}
    />
  );
};

export default LogoImagem;
