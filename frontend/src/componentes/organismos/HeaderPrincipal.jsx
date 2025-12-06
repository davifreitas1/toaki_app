import React from 'react';
import LogoImagem from '../atomos/LogoImagem';
import Icone from '../atomos/Icone';

/**
 * HeaderPrincipal
 *
 * Props:
 * - logoSrc: string (URL da logo)
 * - logoAlt: string (texto alternativo da logo)
 * - icones: array de objetos { path, onClick, cor }
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
        shadow-[0_2px_8px_rgba(0,0,0,0.06),0_4px_12px_rgba(0,0,0,0.1)]
      `}
    >
      <div
        className="
          max-w-6xl
          mx-auto
          flex
          items-center
          justify-between
          px-6
          md:px-8
          py-7
        "
      >
        {/* Logo: 72px de altura → 72 + 28 + 28 = 128px de header */}
        <LogoImagem src={logoSrc} alt={logoAlt} className="h-[72px]" />

        {/* Área de ícones à direita (1 ou vários) */}
        <div className="flex items-center gap-4">
          {icones.map((icone, indice) => (
            <button
              key={indice}
              type="button"
              onClick={icone.onClick}
              className="
                w-12
                h-12
                rounded-full
                border
                border-[var(--cor-borda-neutra)]
                flex
                items-center
                justify-center
                bg-[var(--cor-branco-generico)]
              "
            >
              <Icone
                path={icone.path}
                tamanho={48}
                cor={icone.cor || '#777777'}
              />
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default HeaderPrincipal;
