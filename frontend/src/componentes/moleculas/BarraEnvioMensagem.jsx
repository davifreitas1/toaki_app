// src/componentes/moleculas/BarraEnvioMensagem.jsx
import React, { useState } from 'react';
import Icone from '../atomos/Icone';

const BarraEnvioMensagem = ({ onEnviar }) => {
  const [mensagem, setMensagem] = useState('');

  const handleEnviar = () => {
    if (mensagem.trim()) {
      onEnviar(mensagem);
      setMensagem('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEnviar();
    }
  };

  return (
    <div className="w-full px-4 pb-4 bg-white md:bg-transparent">
      {/* Container da Barra (Rectangle 192) */}
      <div 
        className="
          flex items-center justify-between
          w-full h-[43px]
          bg-[#F9F9F9]
          border-[0.5px] border-black
          rounded-[30px]
          px-4
          shadow-sm
        "
      >
        {/* Input de Texto */}
        <input
          type="text"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="
            flex-1
            bg-transparent
            border-none
            outline-none
            text-[14px] md:text-[16px]
            font-['Montserrat']
            text-[rgba(0,0,0,0.8)]
            placeholder:text-[#D9D9D9]
            mr-3
          "
        />

        {/* Botão de Enviar (base-ícone) */}
        <button 
          onClick={handleEnviar}
          className="
            flex items-center justify-center
            w-[28px] h-[28px]
            bg-transparent
            hover:bg-black/5
            rounded-full
            transition-colors
          "
          aria-label="Enviar mensagem"
        >
          {/* Usando 'avanco' (seta) ou 'enviar' se tiver adicionado ao Icone.jsx */}
          <Icone path="avanco" tamanho={20} cor="#000000" />
        </button>
      </div>
    </div>
  );
};

export default BarraEnvioMensagem;