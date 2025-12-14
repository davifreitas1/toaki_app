import React from 'react';
import Icone from '../atomos/Icone';

const formatarDistancia = (valor) => {
  if (valor == null) return '—';
  if (valor < 1) return `${(valor * 1000).toFixed(0)} m`;
  return `${valor.toFixed(1)} km`;
};

const PopupPedidoVendedor = ({
  pedido,
  onAceitar,
  onRecusar,
  carregando = false,
}) => {
  if (!pedido) return null;

  const clienteNome = pedido.cliente_nome || 'Cliente';
  const distancia = formatarDistancia(pedido.cliente_distancia_km);

  return (
    <div className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center">
      <div className="flex w-[300px] flex-col items-center gap-3 rounded-2xl bg-[#F9F9F9] p-4 shadow-[0_12px_24px_rgba(0,0,0,0.18)]">
        <div className="flex w-full items-center justify-center">
          <h2 className="font-['Montserrat'] text-2xl font-semibold text-black">Pedido</h2>
        </div>

        <div className="relative w-[264px] overflow-hidden rounded-lg border border-black/10">
          <div className="h-[131px] w-full bg-gradient-to-br from-[#f1f5f9] via-[#e0f2fe] to-[#cffafe]" />
          <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/70 px-2 py-1 text-[11px] font-medium text-white">
            <Icone path="mapa" tamanho={14} />
            <span>Prévia do trajeto</span>
          </div>
        </div>

        <div className="flex w-[264px] flex-col gap-3 rounded-2xl border border-[#D9D9D9] p-3 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
          <div className="flex items-start gap-2">
            <div className="mt-[2px] flex h-10 w-10 items-center justify-center rounded-full border border-[#D9D9D9] bg-white">
              <Icone path="usuario" tamanho={20} />
            </div>
            <div className="flex flex-col">
              <span className="font-['Montserrat'] text-[16px] font-medium text-black">
                {clienteNome}
              </span>
              <div className="mt-1 flex items-center gap-2 text-[12px] font-semibold text-[#444444]">
                <Icone path="mapa" tamanho={14} cor="#757575" />
                <span>{distancia}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-3">
          <button
            type="button"
            disabled={carregando}
            onClick={onRecusar}
            className="flex h-[40px] flex-1 items-center justify-center rounded-lg bg-[#D93025] px-4 text-[16px] font-semibold text-white transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            Recusar
          </button>
          <button
            type="button"
            disabled={carregando}
            onClick={onAceitar}
            className="flex h-[40px] flex-1 items-center justify-center rounded-lg bg-[#0FB5B5] px-4 text-[16px] font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.12)] transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupPedidoVendedor;
