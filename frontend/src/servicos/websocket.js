// src/servicos/websocket.js
import { obterUrlWs } from '../uteis/apiConfig';

class ServicoWebSocket {
    constructor() {
        this.socketRef = null;
        this.aoReceberMensagem = null; // Callback de mensagens
        this.aoMudarStatus = null;     // Callback de status
    }

    conectar(rota) {
        const url = obterUrlWs(rota);
        
        // Evita reconectar se já estiver conectado na mesma URL
        if (this.socketRef && this.socketRef.url === url && this.socketRef.readyState === WebSocket.OPEN) {
            return; 
        }

        this.socketRef = new WebSocket(url);

        this.socketRef.onopen = () => {
            console.log('WebSocket conectado!');
            if (this.aoMudarStatus) this.aoMudarStatus(true);
        };

        this.socketRef.onmessage = (evento) => {
            if (this.aoReceberMensagem) this.aoReceberMensagem(evento.data);
        };

        this.socketRef.onerror = (erro) => {
            console.error('WebSocket erro:', erro);
        };

        this.socketRef.onclose = () => {
            console.log('WebSocket desconectado.');
            if (this.aoMudarStatus) this.aoMudarStatus(false);
        };
    }

    definirCallbacks(callbackMensagem, callbackStatus) {
        this.aoReceberMensagem = callbackMensagem;
        this.aoMudarStatus = callbackStatus;
    }

    enviar(dados) {
        if (this.socketRef && this.socketRef.readyState === WebSocket.OPEN) {
            this.socketRef.send(JSON.stringify(dados));
        }
    }

    desconectar() {
        if (this.socketRef) {
            this.socketRef.close();
        }
    }
}

const instanciaSocket = new ServicoWebSocket();
export default instanciaSocket;