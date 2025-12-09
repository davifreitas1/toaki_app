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
