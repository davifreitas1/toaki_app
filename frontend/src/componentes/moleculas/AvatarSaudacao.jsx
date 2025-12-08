// src/componentes/moleculas/AvatarSaudacao.jsx
import React from 'react';
import Icone from '../atomos/Icone';

const AvatarSaudacao = ({ nome = 'Nome' }) => {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar redondo com ícone */}
      <div className="flex items-center justify-center rounded-full bg-[var(--cor-branco-generico)] shadow-[var(--sombra-media)] w-14 h-14">
        <Icone path="usuario" tamanho={32} cor="var(--cor-texto-secundaria)" />
      </div>

      {/* “Olá, Nome” em pill */}
      <span
        className="
          px-4 py-1
          rounded-full
          bg-[var(--cor-branco-generico)]
          shadow-[var(--sombra-pequena)]
          text-[var(--cor-texto-primaria)]
          font-medium
        "
        style={{ fontSize: 'var(--font-size-sm)' }}
      >
        Olá, {nome}
      </span>
    </div>
  );
};

export default AvatarSaudacao;
