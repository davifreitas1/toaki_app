import React from 'react';
import { Link } from 'react-router-dom';

const Hyperlink = ({ to, onClick, children, className = '' }) => {
  const baseClasses = `
    text-[var(--font-size-xs)]
    [color:var(--cor-link-primaria)]
    font-[var(--font-SemiBold)]
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
