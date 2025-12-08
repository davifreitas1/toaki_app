// frontend/src/componentes/moleculas/CampoFormulario.jsx
import React from 'react';
import CampoTextoBase from '../atomos/CampoTextoBase';

const CampoFormulario = ({
  label,
  id,
  type = 'text',
  placeholder,
  className = '',
  erro,
  ...props
}) => {
  const temErro = Boolean(erro);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className="
          text-[12px] md:text-[16px]
          text-black
          font-normal
        "
      >
        {label}
      </label>

      <CampoTextoBase
        id={id}
        type={type}
        placeholder={placeholder}
        className={
          temErro
            ? `
              border-[var(--cor-feedback-negativo)]
              focus:ring-[var(--cor-feedback-negativo)]
            `
            : ''
        }
        {...props}
      />

      {temErro && (
        <p className="mt-1 text-[11px] md:text-[12px] text-[var(--cor-feedback-negativo)]">
          {erro}
        </p>
      )}
    </div>
  );
};

export default CampoFormulario;
