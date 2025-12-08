import React from 'react';
import AvatarSaudacao from '../moleculas/AvatarSaudacao';
import SeletorRaio from '../moleculas/SeletorRaio';
import BotaoCircularIcone from '../atomos/BotaoCircularIcone';
import Icone from '../atomos/Icone';

const PainelMapaCliente = ({ nomeUsuario = 'Nome', raioKm, onRaioChange }) => {
  return (
    // camada que cobre o mapa TODO, mas NÃO bloqueia clique
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* ===== MOBILE: coluna esquerda ===== */}
      <div
        className="
          absolute left-4 top-6
          md:hidden
          flex flex-col gap-6
          items-start          /* importante: não esticar largura */
          pointer-events-none  /* essa coluna não intercepta cliques */
        "
      >
        {/* Avatar + saudação (se for clicável, envolve em pointer-events-auto) */}
        <div className="pointer-events-auto">
          <AvatarSaudacao nome={nomeUsuario} />
        </div>

        <div
          className="
            mt-2
            flex flex-col gap-4
            items-start
            pointer-events-none  /* coluna ainda não recebe clique */
          "
        >
          {/* Seletor de raio */}
          <div className="pointer-events-auto">
            <SeletorRaio
              variant="mobile"
              valor={raioKm}
              onChange={onRaioChange}
            />
          </div>

          {/* Botão de categorias */}
          <div className="pointer-events-auto">
            <BotaoCircularIcone aria-label="Categorias" size={56}>
              <Icone
                path="tag"
                tamanho={24}
                cor="var(--cor-texto-secundaria)"
              />
            </BotaoCircularIcone>
          </div>

          {/* Botão de favoritos */}
          <div className="pointer-events-auto">
            <BotaoCircularIcone aria-label="Favoritos" size={56}>
              <Icone
                path="estrela"
                tamanho={24}
                cor="var(--cor-texto-secundaria)"
              />
            </BotaoCircularIcone>
          </div>
        </div>
      </div>

      {/* ===== DESKTOP: coluna direita ===== */}
      <div
        className="
          hidden md:flex
          absolute right-8 top-1/3
          flex-col items-center gap-4
          pointer-events-none
        "
      >
        <div className="pointer-events-auto">
          <SeletorRaio
            variant="desktop"
            valor={raioKm}
            onChange={onRaioChange}
          />
        </div>

        <div className="pointer-events-auto">
          <BotaoCircularIcone aria-label="Categorias" size={56}>
            <Icone
              path="tag"
              tamanho={24}
              cor="var(--cor-texto-secundaria)"
            />
          </BotaoCircularIcone>
        </div>

        <div className="pointer-events-auto">
          <BotaoCircularIcone aria-label="Favoritos" size={56}>
            <Icone
              path="estrela"
              tamanho={24}
              cor="var(--cor-texto-secundaria)"
            />
          </BotaoCircularIcone>
        </div>
      </div>

      {/* ===== Botão localizar (canto inferior) ===== */}
      <div className="absolute right-6 bottom-24 md:right-8 md:bottom-10 pointer-events-auto">
        <BotaoCircularIcone aria-label="Centralizar no meu local" size={56}>
          <Icone
            path="mapa"
            tamanho={26}
            cor="var(--cor-marca-secundaria)"
          />
        </BotaoCircularIcone>
      </div>
    </div>
  );
};

export default PainelMapaCliente;
