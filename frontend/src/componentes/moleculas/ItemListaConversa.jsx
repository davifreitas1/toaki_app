import React from 'react';
import Icone from '../atomos/Icone';

const ItemListaConversa = ({ nome, ultimaMensagem, naoLidas, onClick, ativo }) => {
  return (
    <div 
      onClick={onClick}
      className={`
        w-full flex items-center gap-[10px] p-[10px] cursor-pointer transition-colors
        ${ativo ? 'bg-black/5' : 'hover:bg-black/5'}
        border-b border-[var(--cor-borda-neutra)] last:border-none md:border-none md:rounded-[12px]
      `}
    >
      {/* AVATAR (Figma: 60px mobile / 48px desktop - ajustado para responsivo) */}
      <div className="relative flex-shrink-0 w-[60px] h-[60px] md:w-[48px] md:h-[48px] bg-[var(--cor-fundo-secundaria)] border border-[var(--cor-borda-neutra)] rounded-full flex items-center justify-center">
        <Icone path="usuario" tamanho={24} cor="var(--cor-texto-secundaria)" />
        {/* Opcional: Imagem real se houver */}
        {/* <img src={...} className="w-full h-full rounded-full object-cover" /> */}
      </div>

      {/* TEXTOS */}
      <div className="flex-1 flex flex-col gap-[5px] overflow-hidden">
        {/* Nome */}
        <h4 className="text-[18px] font-semibold text-[rgba(0,0,0,0.8)] leading-[22px] truncate font-['Montserrat']">
          {nome}
        </h4>
        
        {/* Última Mensagem */}
        <p className="text-[16px] font-regular text-[rgba(0,0,0,0.8)] leading-[20px] truncate font-['Montserrat']">
          {ultimaMensagem}
        </p>
      </div>

      {/* BADGE DE NÃO LIDAS (Figma: Ellipse 82 #D73A25) */}
      {naoLidas > 0 && (
        <div className="flex-shrink-0 flex items-center justify-center w-[18px] h-[18px] bg-[#D73A25] rounded-full">
          <span className="text-[10px] md:text-[12px] font-medium text-white font-['Inter']">
            {naoLidas}
          </span>
        </div>
      )}
    </div>
  );
};

export default ItemListaConversa;