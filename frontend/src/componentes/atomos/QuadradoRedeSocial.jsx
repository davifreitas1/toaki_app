import React from 'react';

const QuadradoRedeSocial = ({ icon, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        bg-[#D9D9D9] 
        flex 
        items-center 
        justify-center 
        hover:bg-[#c0c0c0] 
        transition-colors
        
        /* Mobile */
        w-[26px] 
        h-[26px] 
        rounded-[5px]

        /* Desktop */
        md:w-[57px] 
        md:h-[57px]
        md:rounded-[10px]
      `}
    >
      {icon && React.cloneElement(icon, { 
        className: "w-4 h-4 md:w-8 md:h-8 text-[#555]" // Ícone cresce no desktop
      })}
    </button>
  );
};

export default QuadradoRedeSocial;