// src/servicos/pedidosCliente.js
import { obterUrlHttp } from '../uteis/apiConfig';

// Status que consideramos "em andamento" pra rastrear
const STATUS_EM_ANDAMENTO = ['PENDENTE', 'CONFIRMADO', 'EM_ANDAMENTO'];

export const listarPedidosCliente = async () => {
  const url = obterUrlHttp('/api/pedidos/');

  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!resp.ok) {
    throw new Error('Não foi possível carregar seus pedidos.');
  }

  const dados = await resp.json();
  return Array.isArray(dados) ? dados : [];
};

export const listarPedidosClienteEmAndamento = async () => {
  const pedidos = await listarPedidosCliente();
  return pedidos.filter((p) => STATUS_EM_ANDAMENTO.includes(p.status));
};
