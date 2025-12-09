import React, { useEffect, useState } from 'react';
import Icone from '../atomos/Icone';
import BotaoPrimario from '../atomos/BotaoPrimario';
import {
  obterVendedorComDistancia,
  obterPerfilVendedor,
} from '../../servicos/vendedores';
import { chamarVendedor } from '../../servicos/pedidos';


const ModalVendedorMapa = ({
  vendedorBasico,
  clienteCoords,
  raioKm = 1,
  onClose,
  onPedidoCriado,
}) => {
  const [detalhes, setDetalhes] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const [carregandoPedido, setCarregandoPedido] = useState(false);
  const [erroPedido, setErroPedido] = useState(null);

  useEffect(() => {
    if (!vendedorBasico?.id) return;

    let cancelado = false;

    const carregar = async () => {
      setCarregando(true);
      setErro(null);

      try {
        const lat = clienteCoords?.lat ?? clienteCoords?.latitude;
        const lon = clienteCoords?.lon ?? clienteCoords?.longitude;

        let vendedorDetalhado = null;

        // 1) tentar endpoint com distancia_km
        if (lat != null && lon != null) {
          vendedorDetalhado = await obterVendedorComDistancia({
            vendedorId: vendedorBasico.id,
            latitude: lat,
            longitude: lon,
            raioKm,
          });
        }

        // 2) fallback: perfil simples (sem distancia_km)
        if (!vendedorDetalhado) {
          vendedorDetalhado = await obterPerfilVendedor(
            vendedorBasico.id
          );
        }

        if (!cancelado) {
          console.log('detalhes vendedor => ', vendedorDetalhado);
          setDetalhes(vendedorDetalhado);
        }
      } catch (e) {
        console.error(e);
        if (!cancelado) {
          setErro(
            'Não foi possível carregar as informações do vendedor.'
          );
        }
      } finally {
        if (!cancelado) setCarregando(false);
      }
    };

    carregar();

    return () => {
      cancelado = true;
    };
    // dependências mais “estáveis” pra evitar re-execução desnecessária
  }, [vendedorBasico?.id, clienteCoords?.lat, clienteCoords?.lon, raioKm]);

  const handleChamarVendedor = async () => {
    if (carregandoPedido) return;

    setCarregandoPedido(true);
    setErroPedido(null);

    try {
      await chamarVendedor(vendedorBasico.id);
      onPedidoCriado && onPedidoCriado();
    } catch (e) {
      console.error(e);
      setErroPedido(e.message || 'Não foi possível chamar o vendedor.');
    } finally {
      setCarregandoPedido(false);
    }
  };


  const vendedor = detalhes || vendedorBasico || {};

  const nome =
    vendedor.nome_fantasia ||
    vendedor.nome ||
    'Vendedor';

  const distanciaLabel =
    typeof vendedor.distancia_km === 'number'
      ? `${vendedor.distancia_km.toFixed(1)} km`
      : '—';

  const categorias = Array.isArray(vendedor.categorias)
    ? vendedor.categorias
    : [];

  // Enquanto carrega, pelo menos mostra o skeleton básico
  const isLoading = carregando && !detalhes;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-[var(--cor-fundo-secundaria)] shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
        {/* botão fechar */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-black/5"
        >
          <Icone path="fechar" tamanho={18} />
        </button>

        <div className="flex flex-col items-center px-6 pt-7 pb-6">
          {/* avatar */}
          <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full border border-[var(--cor-borda-neutra)] bg-[var(--cor-fundo-primaria)] shadow-[0_4px_10px_rgba(0,0,0,0.12)] overflow-hidden">
            <Icone path="usuario" tamanho={40} />
          </div>

          {/* nome */}
          <h2 className="text-base font-semibold text-[var(--cor-texto-primaria)] text-center">
            {nome}
          </h2>

          {/* Distância + avaliação */}
          <div className="mt-2 flex items-center gap-3 text-sm text-[var(--cor-texto-secundaria)]">
            <span>{distanciaLabel}</span>
            <span className="h-3 w-px bg-[var(--cor-borda-neutra)]" />
            <div className="inline-flex items-center gap-1">
              <Icone path="estrela" tamanho={16} cor="#FBBF24" />
              <span>—</span> {/* aqui entra futura média se o backend expor */}
            </div>
          </div>

          {/* categorias */}
          {categorias.length > 0 && (
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {categorias.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 rounded-full bg-[var(--cor-fundo-primaria)] border border-[var(--cor-borda-neutra)] text-xs font-medium text-[var(--cor-texto-secundaria)]"
                >
                  {cat}
                </span>
              ))}
            </div>
          )}

          {(erro || erroPedido) && (
            <div className="mt-4 text-xs text-red-600 text-center">
              {erro || erroPedido}
            </div>
          )}

          <div className="mt-6 w-full">
            <BotaoPrimario
              onClick={handleChamarVendedor}
              disabled={carregandoPedido || isLoading}
              className="uppercase tracking-wide"
            >
              {carregandoPedido ? 'Enviando...' : 'Chamar Vendedor'}
            </BotaoPrimario>
          </div>

          {isLoading && (
            <p className="mt-2 text-[11px] text-[var(--cor-texto-secundaria)]">
              Carregando informações do vendedor...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalVendedorMapa;
