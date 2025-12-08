import React from 'react';
import CampoTextoBase from '../atomos/CampoTextoBase';

const CampoFormulario = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-1 md:gap-2 ${className}`}>
      <label
        htmlFor={id}
        className="
          font-['Montserrat']
          text-[rgba(0,0,0,0.73)]
          
          /* Mobile: Regular 11px */
          text-[11px]
          font-normal
          
          /* Desktop: SemiBold 16px */
          md:text-[16px]
          md:font-semibold
        "
      >
        {label}
      </label>

      <CampoTextoBase
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default CampoFormulario;