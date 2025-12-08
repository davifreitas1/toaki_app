import { obterUrlHttp } from '../uteis/apiConfig';

export const loginUsuario = async (username, password) => {
    // Ninja API endpoint: /api/login (sem barra no final)
    const url = obterUrlHttp('/api/login');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // OBRIGATÓRIO: Diz ao navegador para receber e guardar o cookie de sessão
            credentials: 'include', 
            body: JSON.stringify({ username, password })
        });

        const dados = await response.json();
        return { sucesso: response.ok, dados };
    } catch (erro) {
        console.error("Erro no login:", erro);
        return { sucesso: false, erro };
    }
};

export const verificarAuth = async () => {
    const url = obterUrlHttp('/api/profile'); // Usando /profile para checar se user existe
    try {
        const response = await fetch(url, {
            method: 'GET',
            credentials: 'include' 
        });
        return response.ok;
    } catch (error) {
        return false;
    }
}

export const registrarUsuario = async ({ nome, email, senha }) => {
  const url = obterUrlHttp('/api/register');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Backend espera username, email, password.
      // Como o Login pede Email, usamos o email como username.
      body: JSON.stringify({
        username: email,
        first_name: nome,
        email: email,
        password: senha,
        // Opcional: Se quiser salvar o nome, precisaria ajustar o backend ou 
        // salvar no perfil depois. Por enquanto segue o schema do backend.
      }),
    });

    let dados = {};
    try {
      dados = await response.json();
    } catch {
      dados = {};
    }

    // Tenta capturar mensagem de erro específica do backend se houver
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