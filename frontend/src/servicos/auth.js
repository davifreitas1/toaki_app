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