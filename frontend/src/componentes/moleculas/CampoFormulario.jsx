import React from 'react';
import CampoTextoBase from '../atomos/CampoTextoBase';

const CampoFormulario = ({
  label,
  id,
  type = 'text',
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label
        htmlFor={id}
        className="
          text-xs
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
        {...props}
      />
    </div>
  );
};

export default CampoFormulario;
