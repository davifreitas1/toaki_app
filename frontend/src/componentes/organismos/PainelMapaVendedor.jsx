import React from 'react';
import AvatarSaudacao from '../moleculas/AvatarSaudacao';
import SeletorRaio from '../moleculas/SeletorRaio';
import BotaoCircularIcone from '../atomos/BotaoCircularIcone';
import Icone from '../atomos/Icone';
import logoToAkiMini from '../../ativos/toaki_logo.png';


const BotaoStatusOnline = ({ ativo, onClick, disabled }) => (
  <BotaoCircularIcone
    aria-label="Alternar status online"
    size={56}
    ativo={ativo}
    onClick={onClick}
    disabled={disabled}
    className={`
      transition
      ${ativo ? 'bg-[var(--cor-marca-secundaria)] ring-offset-2 ring-offset-white' : ''}
      ${disabled ? 'opacity-80 cursor-not-allowed' : ''}
    `}
  >
    <div className="relative flex items-center justify-center">
      <img
        src={logoToAkiMini}
        alt="ToAki"
        className={`w-auto h-6 ${ativo ? 'brightness-0 invert' : ''}`}
      />
    </div>
  </BotaoCircularIcone>
);

const PainelMapaVendedor = ({
  nomeUsuario = 'Nome',
  raioKm,
  onRaioChange,
  estaOnline = false,
  onAlternarOnline,
  alterandoStatus = false,
}) => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* ===== MOBILE: coluna esquerda ===== */}
      <div
        className="
          absolute left-4 top-6
          md:hidden
          flex flex-col gap-6
          items-start
          pointer-events-none
        "
      >
        <div className="pointer-events-auto">
          <AvatarSaudacao nome={nomeUsuario} />
        </div>

        <div
          className="
            mt-2
            flex flex-col gap-4
            items-start
            pointer-events-none
          "
        >
          <div className="pointer-events-auto">
            <SeletorRaio
              variant="mobile"
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

          <div className="pointer-events-auto">
            <BotaoStatusOnline
              ativo={estaOnline}
              onClick={onAlternarOnline}
              disabled={alterandoStatus}
            />
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

        <div className="pointer-events-auto">
          <BotaoStatusOnline
            ativo={estaOnline}
            onClick={onAlternarOnline}
            disabled={alterandoStatus}
          />
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

export default PainelMapaVendedor;