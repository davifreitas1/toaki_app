import React from 'react';
import { Link } from 'react-router-dom';

const Hyperlink = ({ to, onClick, children, className = '' }) => {
  const baseClasses = `
    text-[12px] md:text-[14px]
    text-[var(--cor-link-primaria)]
    font-normal
  `;

  if (to) {
    return (
      <Link to={to} className={`${baseClasses} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        bg-transparent
        border-none
        p-0
        ${baseClasses}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Hyperlink;
