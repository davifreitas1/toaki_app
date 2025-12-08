import React from 'react';
import LogoImagem from '../atomos/LogoImagem';
import Icone from '../atomos/Icone';

/**
 * HeaderPrincipal
 *
 * Props:
 * - logoSrc: string
 * - logoAlt: string
 * - icones: array de objetos { path, onClick, cor, comFundo?: boolean }
 * - exibirNoMobile: boolean (default false → só desktop)
 */
const HeaderPrincipal = ({
  logoSrc,
  logoAlt = 'Logo',
  icones = [],
  exibirNoMobile = false,
}) => {
  const visibilidade = exibirNoMobile ? 'block' : 'hidden md:block';

  return (
    <header
      className={`
        ${visibilidade}
        w-full
        bg-[var(--cor-fundo-secundaria)]
        shadow-[0_4px_4px_rgba(0,0,0,0.10)]
      `}
    >
      <div
        className="
          w-full
          flex
          items-center
          justify-between
          px-4
          py-4
        "
      >
        {/* Logo alinhada à esquerda */}
        <LogoImagem src={logoSrc} alt={logoAlt} className="h-[72px]" />

        {/* Ícones alinhados à direita */}
        <div className="flex items-center gap-6">
          {icones.map((icone, indice) => {
            const comFundo = icone.comFundo;

            const btnClasses = comFundo
              ? `
                flex items-center justify-center
                w-12 h-12
                rounded-full
                bg-[var(--cor-branco-generico)]
                shadow-[0_4px_4px_rgba(0,0,0,0.10)]
                transition active:scale-95
              `
              : `
                flex items-center justify-center
                p-2
                transition active:scale-95
              `;

            const tamanhoIcone = icone.tamanho || 28;

            return (
              <button
                key={indice}
                type="button"
                onClick={icone.onClick}
                className={btnClasses}
              >
                <Icone
                  path={icone.path}
                  tamanho={tamanhoIcone}
                  cor={icone.cor || '#777777'}
                />
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default HeaderPrincipal;
