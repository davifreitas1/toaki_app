import React, { useState } from 'react';
import BotaoCircularIcone from '../atomos/BotaoCircularIcone';
import Icone from '../atomos/Icone';

const opcoesPadrao = [1, 2, 3];

const SeletorRaio = ({
  valor,
  onChange,
  variant = 'mobile', // 'mobile' | 'desktop'
  opcoes = opcoesPadrao,
}) => {
  const [aberto, setAberto] = useState(false);

  const handleSelecionar = (km) => {
    onChange?.(km);
  };

  /* ======================== MOBILE ========================= */
  if (variant === 'mobile') {
    return (
      <div className="relative">
        {aberto ? (
          // estado ABERTO: a bolinha vira uma fileira horizontal
          <div className="flex items-center gap-2">
            {opcoes.map((km) => (
              <BotaoCircularIcone
                key={km}
                size={56}
                ativo={km === valor}
                aria-label={`${km} quilômetros`}
                onClick={() => handleSelecionar(km)}
              >
                <span
                  className="font-semibold text-[var(--cor-texto-primaria)]"
                  style={{ fontSize: 'var(--font-size-sm)' }}
                >
                  {km}km
                </span>
              </BotaoCircularIcone>
            ))}

            {/* seta para fechar, apontando para a ESQUERDA */}
            <button
              type="button"
              onClick={() => setAberto(false)}
              className="p-2"
              aria-label="Fechar seleção de raio"
            >
              <Icone
                path="retorno" // seta "<"
                tamanho={18}
                cor="var(--cor-texto-primaria)"
              />
            </button>
          </div>
        ) : (
          // estado FECHADO: só UMA bolinha na coluna
          <BotaoCircularIcone
            size={56}
            ativo
            aria-label={`${valor} quilômetros`}
            onClick={() => setAberto(true)}
          >
            <span
              className="font-medium text-[var(--cor-texto-primaria)]"
              style={{ fontSize: 'var(--font-size-md)' }}
            >
              {valor}km
            </span>
          </BotaoCircularIcone>
        )}
      </div>
    );
  }

  /* ======================== DESKTOP ======================== */

  return (
    <div className="relative">
      {/* bolinha da coluna */}
      <BotaoCircularIcone
        size={56}
        ativo
        aria-label={`${valor} quilômetros`}
        onClick={() => setAberto((prev) => !prev)}
      >
        <span
          className="font-medium text-[var(--cor-texto-primaria)]"
          style={{ fontSize: 'var(--font-size-sm)' }}
        >
          {valor}km
        </span>
      </BotaoCircularIcone>

      {aberto && (
        <div
          className="
            absolute
            right-full
            mr-4
            top-1/2
            -translate-y-1/2
            flex
            items-center
            gap-4
          "
        >
          {/* seta para a DIREITA (>) */}
          <button
            type="button"
            onClick={() => setAberto(false)}
            className="p-2"
            aria-label="Fechar seleção de raio"
          >
            <Icone
              path="avanco"
              tamanho={18}
              cor="var(--cor-texto-primaria)"
            />
          </button>

          {/* 3km 2km 1km */}
          <div className="flex items-center gap-4">
            {opcoes
              .slice()
              .sort((a, b) => b - a) // 3 → 2 → 1
              .map((km) => (
                <BotaoCircularIcone
                  key={km}
                  size={56}
                  ativo={km === valor}
                  aria-label={`${km} quilômetros`}
                  onClick={() => handleSelecionar(km)}
                >
                  <span
                    className="font-semibold text-[var(--cor-texto-primaria)]"
                    style={{ fontSize: 'var(--font-size-sm)' }}
                  >
                    {km}km
                  </span>
                </BotaoCircularIcone>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeletorRaio;
