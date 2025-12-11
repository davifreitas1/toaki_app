import { obterUrlHttp } from '../uteis/apiConfig';

export const loginUsuario = async (username, password) => {
  const url = obterUrlHttp('/api/login');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ username, password }),
    });

    const dados = await response.json();
    return { sucesso: response.ok, dados };
  } catch (erro) {
    console.error('Erro no login:', erro);
    return { sucesso: false, erro };
  }
};

/**
 * Busca o perfil de cliente (nome, telefone, etc.)
 * GET /api/perfis/cliente
 */
export const obterPerfilCliente = async () => {
  const url = obterUrlHttp('/api/perfis/cliente');

  const resposta = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });

  if (!resposta.ok) {
    return null;
  }

  try {
    return await resposta.json();
  } catch {
    return null;
  }
};

/**
 * Verifica se há sessão válida e retorna dados ricos do usuário.
 * Usa:
 * - GET /api/profile  → id, username, email, tipo_usuario
 * - GET /api/perfis/cliente → nome amigável do cliente
 */
export const verificarAuth = async () => {
  const urlProfile = obterUrlHttp('/api/profile');

  try {
    const respProfile = await fetch(urlProfile, {
      method: 'GET',
      credentials: 'include',
    });

    if (!respProfile.ok) {
      return { autenticado: false, usuario: null };
    }

    const dadosProfile = await respProfile.json();
    console.log(dadosProfile);
    

    let perfilCliente = null;
    try {
      perfilCliente = await obterPerfilCliente();
      console.log(perfilCliente);
      
    } catch (erroPerfil) {
      console.error('Erro ao buscar perfil do cliente:', erroPerfil);
    }

    const usuario = {
      id: dadosProfile.id,
      username: dadosProfile.username,
      email: dadosProfile.email,
      tipo_usuario: dadosProfile.tipo_usuario,
      perfilCliente,
      // nome amigável para telas: usa perfil.nome se existir, senão cai pro username
      nome: perfilCliente?.nome || dadosProfile.username,
    };

    return { autenticado: true, usuario };
  } catch (error) {
    console.error('Erro ao verificar auth:', error);
    return { autenticado: false, usuario: null };
  }
};

export const registrarUsuario = async ({ nome, email, senha }) => {
  const url = obterUrlHttp('/api/register');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        first_name: nome,
        email: email,
        password: senha,
      }),
    });

    let dados = {};
    try {
      dados = await response.json();
    } catch {
      dados = {};
    }

    let erroMsg = null;
    if (!response.ok && dados.detail) {
      erroMsg = dados.detail;
    }

    return { sucesso: response.ok, dados, erro: erroMsg };
  } catch (erro) {
    console.error('Erro no registro:', erro);
    return { sucesso: false, erro: 'Erro de conexão com o servidor.' };
  }
};

export const registrarVendedor = async ({ nomeFantasia, email, senha }) => {
  const url = obterUrlHttp('/api/register');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
        first_name: nomeFantasia,
        email: email,
        password: senha,
        tipo_usuario: 'VENDEDOR',
        nome_fantasia: nomeFantasia,
      }),
    });

    let dados = {};
    try {
      dados = await response.json();
    } catch {
      dados = {};
    }

    let erroMsg = null;
    if (!response.ok && dados.detail) {
      erroMsg = dados.detail;
    }

    return { sucesso: response.ok, dados, erro: erroMsg };
  } catch (erro) {
    console.error('Erro no registro de vendedor:', erro);
    return { sucesso: false, erro: 'Erro de conexão com o servidor.' };
  }
};
