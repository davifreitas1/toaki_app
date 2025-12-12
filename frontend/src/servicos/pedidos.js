// src/servicos/pedidos.js
import { obterUrlHttp } from '../uteis/apiConfig';

export const chamarVendedor = async (perfilVendedorId) => {
  const url = obterUrlHttp('/api/pedidos/');

  const resp = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({
      perfil_vendedor_id: perfilVendedorId,
      itens: [],
    }),
  });

  let body = null;
  try {
    body = await resp.json();
  } catch {
    body = null;
  }

  if (!resp.ok) {
    const mensagem =
      body?.detail || 'Não foi possível chamar o vendedor.';
    throw new Error(mensagem);
  }

  return body;
};

export const listarPedidosVendedor = async ({ status } = {}) => {
  const params = new URLSearchParams();
  if (status) params.append('status', status);

  const url = obterUrlHttp(`/api/pedidos/vendedor?${params.toString()}`);

  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!resp.ok) {
    throw new Error('Não foi possível carregar os pedidos do vendedor.');
  }

  const dados = await resp.json();
  return Array.isArray(dados) ? dados : [];
};

export const atualizarPedido = async (pedidoId, payload) => {
  const url = obterUrlHttp(`/api/pedidos/${encodeURIComponent(pedidoId)}`);

  const resp = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    throw new Error('Não foi possível atualizar o pedido.');
  }

  return resp.json();
};

export const obterPedido = async (pedidoId) => {
  const url = obterUrlHttp(`/api/pedidos/${encodeURIComponent(pedidoId)}`);

  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!resp.ok) {
    throw new Error('Não foi possível carregar o pedido.');
  }

  return resp.json();
};
