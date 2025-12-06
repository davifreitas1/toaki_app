import React from 'react';
import Icone from '../atomos/Icone';

/**
 * BarraNavegacaoInferior
 *
 * Props:
 * - itemAtivo: string (id do item ativo, ex: 'home', 'buscar', 'chat', 'tag')
 * - onItemChange: (id: string) => void  (callback ao clicar em um item)
 * - itens: opcional, para customizar os itens da barra
 *
 * Observação:
 * - Por padrão, aparece apenas em mobile (md:hidden).
 * - Para desktop vamos usar variações do HeaderPrincipal.
 */

const ITENS_PADRAO = [
  { id: 'home', icon: 'home', label: 'Início' },
  { id: 'buscar', icon: 'lupa', label: 'Buscar' },
  { id: 'chat', icon: 'chat', label: 'Chat' },
  { id: 'tag', icon: 'tag', label: 'Ofertas' },
];

const ItemNavegacao = ({ item, ativo, onClick }) => {
  const corIcone = ativo
    ? 'var(--cor-marca-secundaria)'
    : 'var(--cor-texto-secundaria)';

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        relative
        flex
        items-center
        justify-center
        rounded-full
        transition
        hover:bg-[rgba(15,181,181,0.06)]
        active:scale-95
      "
      aria-label={item.label}
    >
      <Icone path={item.icon} tamanho={24} cor={corIcone} />

      {ativo && (
        <span
          className="
            absolute
            -bottom-1
            w-1.5
            h-1.5
            rounded-full
            bg-[var(--cor-marca-secundaria)]
          "
        />
      )}
    </button>
  );
};

const BarraNavegacaoInferior = ({
  itemAtivo = 'home',
  onItemChange,
  itens = ITENS_PADRAO,
}) => {
  return (
    <div
      className="
        md:hidden
        fixed
        inset-x-0
        bottom-4
        flex
        justify-center
        pointer-events-none
        z-20
      "
    >
      <nav
        className="
          pointer-events-auto
          bg-[var(--cor-branco-generico)]
          shadow-[var(--sombra-grande)]
          rounded-[12px]
          px-[48px]
          py-[12px]
          flex
          items-center
          justify-between
          gap-8
          max-w-[360px]
          w-[90%]
        "
      >
        {itens.map((item) => (
          <ItemNavegacao
            key={item.id}
            item={item}
            ativo={itemAtivo === item.id}
            onClick={() => onItemChange && onItemChange(item.id)}
          />
        ))}
      </nav>
    </div>
  );
};

export default BarraNavegacaoInferior;
