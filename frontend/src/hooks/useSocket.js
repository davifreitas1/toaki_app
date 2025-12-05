// src/hooks/useSocket.js
import { useEffect, useState } from 'react';
import instanciaSocket from '../servicos/websocket';

const useSocket = (rota) => {
    const [mensagens, setMensagens] = useState(null);
    const [status, setStatus] = useState(false);

    useEffect(() => {
        if (!rota) return;

        // 1. Conecta
        instanciaSocket.conectar(rota);

        // 2. Registra os callbacks (Mensagem E Status)
        instanciaSocket.definirCallbacks(
            (dados) => {
                const dadosProcessados = JSON.parse(dados);
                setMensagens(dadosProcessados);
            },
            (statusConexao) => {
                setStatus(statusConexao);
            }
        );

        // 3. Limpeza ao desmontar
        return () => {
            instanciaSocket.desconectar();
            setStatus(false);
        };
    }, [rota]);

    const enviarMensagem = (dados) => {
        instanciaSocket.enviar(dados);
    };

    // Retorno em PORTUGUÊS conforme solicitado
    return { mensagens, enviarMensagem, status };
};

export default useSocket;