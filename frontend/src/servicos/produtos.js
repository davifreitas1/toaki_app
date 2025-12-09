// src/servicos/produtos.js
import { obterUrlHttp } from '../uteis/apiConfig';

export const listarProdutos = async () => {
  const url = obterUrlHttp('/api/produtos/');
  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!resp.ok) {
    throw new Error('Não foi possível buscar produtos.');
  }

  return resp.json();
};

export const listarProdutosPorVendedor = async (perfilVendedorId) => {
  const produtos = await listarProdutos();
  return produtos.filter(
    (p) =>
      String(p.perfil_vendedor_id) === String(perfilVendedorId)
  );
};
