import { obterUrlHttp } from '../uteis/apiConfig';

export const loginUsuario = async (username, password) => {
    const url = obterUrlHttp('/api/login/');

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // OBRIGATÓRIO: Diz ao navegador para receber e guardar o cookie
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
    const url = obterUrlHttp('/api/check-auth/');
    try {
        const response = await fetch(url, {
            method: 'GET',
            // OBRIGATÓRIO: Envia o cookie guardado de volta pro servidor
            credentials: 'include' 
        });
        return response.ok; // Retorna true se 200 OK
    } catch (error) {
        return false;
    }
}

export const registrarUsuario = async ({ nome, email, senha }) => {
  // Ajuste essa URL para a view de cadastro que você criou no Django
  const url = obterUrlHttp('/api/register');

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: email,
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

    return { sucesso: response.ok, dados };
  } catch (erro) {
    console.error('Erro no registro:', erro);
    return { sucesso: false, erro };
  }
};
