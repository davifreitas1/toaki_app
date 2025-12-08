import React from 'react';

const DivisorOu = () => {
  return (
    <div className="flex items-center w-full gap-3 my-1 md:my-2"> {/* Margem vertical pequena */}
      {/* Linha Desktop: 0.3px solid #000000 | Mobile: 1px solid #D9D9D9 */}
      <div className="h-[1px] bg-[#D9D9D9] md:h-[0.5px] md:bg-black flex-1"></div>
      
      <span className="
        font-['Montserrat']
        text-center
        
        /* Mobile */
        text-[11px] 
        font-normal 
        text-[var(--cor-texto-primaria)]
        
        /* Desktop */
        md:text-[16px]
        md:text-black
        md:font-normal
      ">
        Entrar com
      </span>
      
      <div className="h-[1px] bg-[#D9D9D9] md:h-[0.5px] md:bg-black flex-1"></div>
    </div>
  );
};

export default DivisorOu;