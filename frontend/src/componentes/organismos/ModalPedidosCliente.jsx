// src/componentes/organismos/ModalPedidosCliente.jsx
import React, { useEffect, useState } from 'react';
import BotaoPrimario from '../atomos/BotaoPrimario';
import { listarPedidosClienteEmAndamento } from '../../servicos/pedidosCliente';

const statusLabel = (status) => {
  switch (status) {
    case 'PENDENTE':
      return 'Pendente';
    case 'CONFIRMADO':
      return 'Confirmado';
    case 'EM_ANDAMENTO':
      return 'Em andamento';
    case 'CONCLUIDO':
      return 'Concluído';
    case 'CANCELADO':
      return 'Cancelado';
    default:
      return status;
  }
};

const ModalPedidosCliente = ({ aberto, onClose, onRastrear }) => {
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    if (!aberto) return;

    const carregar = async () => {
      setCarregando(true);
      setErro('');
      try {
        const lista = await listarPedidosClienteEmAndamento();
        setPedidos(lista);
      } catch (e) {
        console.error(e);
        setErro('Não foi possível carregar seus pedidos.');
      } finally {
        setCarregando(false);
      }
    };

    carregar();
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div
        className="
          w-full max-w-md
          bg-[var(--cor-fundo-secundaria)]
          rounded-[20px]
          shadow-[0_4px_12px_rgba(0,0,0,0.15)]
          p-6
        "
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] font-semibold font-['Montserrat'] text-black">
            Pedidos em andamento
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-[24px] leading-none px-2 pb-[2px]"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {/* Conteúdo */}
        {carregando && (
          <p className="text-sm text-[var(--cor-texto-secundaria)]">
            Carregando pedidos...
          </p>
        )}

        {!carregando && erro && (
          <p className="text-sm text-[var(--cor-feedback-erro)] mb-3">
            {erro}
          </p>
        )}

        {!carregando && !erro && pedidos.length === 0 && (
          <p className="text-sm text-[var(--cor-texto-secundaria)]">
            Você não possui pedidos em andamento no momento.
          </p>
        )}

        {!carregando && !erro && pedidos.length > 0 && (
          <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto pr-1">
            {pedidos.map((pedido) => {
              const valor = Number(pedido.valor_total ?? 0);

              return (
                <div
                  key={pedido.id}
                  className="
                    w-full
                    rounded-[12px]
                    bg-white
                    shadow-[0_2px_6px_rgba(0,0,0,0.06)]
                    px-4 py-3
                    flex flex-col gap-2
                  "
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex flex-col">
                      <span className="text-[13px] text-[var(--cor-texto-secundaria)]">
                        Pedido
                      </span>
                      <span className="text-[14px] font-semibold">
                        #{pedido.id.slice(0, 6).toUpperCase()}
                      </span>
                    </div>

                    <span className="text-[12px] px-2 py-1 rounded-full bg-[#FFF6E9] text-[var(--cor-texto-principal)]">
                      {statusLabel(pedido.status)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-[var(--cor-texto-secundaria)]">
                    <span>Valor: R$ {valor.toFixed(2)}</span>
                    <span>
                      Vendedor:{' '}
                      <span className="font-mono text-[11px]">
                        {pedido.perfil_vendedor_id.slice(0, 6)}
                      </span>
                    </span>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (onRastrear) {
                          onRastrear(pedido);
                        }
                      }}
                      className="
                        text-[13px] font-semibold
                        px-3 py-2
                        rounded-[999px]
                        border border-[var(--cor-marca-secundaria)]
                        text-[var(--cor-marca-secundaria)]
                        hover:bg-[var(--cor-marca-secundaria)]/5
                        transition-colors
                      "
                    >
                      Rastrear
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Rodapé */}
        <div className="mt-4 flex justify-end">
          <BotaoPrimario
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm"
          >
            Fechar
          </BotaoPrimario>
        </div>
      </div>
    </div>
  );
};

export default ModalPedidosCliente;
