import React from 'react';
import { User } from 'lucide-react';
import LogoImagem from '../atomos/LogoImagem';

const HeaderPrincipal = ({ logoSrc, onAvatarClick }) => {
  return (
    <header
      className="
        w-full 
        h-[128px]
        bg-[#F9F9F9]
        shadow-[0px_2px_8px_-2px_rgba(0,0,0,0.06),0px_4px_12px_-2px_rgba(0,0,0,0.1)]
        flex items-center
        justify-between
        px-[120px]
      "
    >
      {/* Logo */}
      <div className="w-[122px] h-[74px]">
        <LogoImagem 
          src={logoSrc} 
          alt="Logo ToAki" 
          className="w-full h-full object-contain"
        />
      </div>

      {/* Avatar do Usuário */}
      <button 
        onClick={onAvatarClick}
        className="
          w-[48px] h-[48px]
          bg-[#F9F9F9]
          border border-[#EDEDED]
          rounded-full
          flex items-center justify-center
          hover:bg-gray-100 transition-colors
        "
      >
        <User size={24} color="#757575" strokeWidth={1.5} />
      </button>
    </header>
  );
};

export default HeaderPrincipal;