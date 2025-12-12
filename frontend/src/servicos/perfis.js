import { obterUrlHttp } from '../uteis/apiConfig';

export const obterPerfilVendedorComStatus = async () => {
  const url = obterUrlHttp('/api/perfis/vendedor');

  const resposta = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!resposta.ok) {
    return { perfil: null, status: resposta.status };
  }

  try {
    const perfil = await resposta.json();
    return { perfil, status: resposta.status };
  } catch {
    return { perfil: null, status: resposta.status };
  }
};

export const obterPerfilVendedor = async () => {
  const { perfil } = await obterPerfilVendedorComStatus();
  return perfil;
};

export const atualizarStatusOnlineVendedor = async (
  perfilVendedorId,
  estaOnline
) => {
  const perfilId = `${perfilVendedorId || ''}`.trim();

  if (!perfilId) {
    throw new Error('Perfil de vendedor inválido para atualização de status.');
  }

  const url = obterUrlHttp(
    `/api/perfis/vendedores/${encodeURIComponent(perfilId)}/online`
  );

  const resposta = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ esta_online: estaOnline }),
  });

  if (!resposta.ok) {
    const erro = await resposta.text();
    throw new Error(erro || 'Não foi possível atualizar o status.');
  }

  return resposta.json();
};