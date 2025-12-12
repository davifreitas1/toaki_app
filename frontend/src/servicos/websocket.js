import { obterUrlWs } from '../uteis/apiConfig';

class ServicoWebSocket {
    constructor() {
        this.socketRef = null;
        this.aoReceberMensagem = null; // Callback de mensagens
        this.aoMudarStatus = null;     // Callback de status
        this.urlAtual = null;
        this.timerReconexao = null;
        this.tentativas = 0;
        this.deveReconectar = false;
    }

    conectar(rota) {
        const url = obterUrlWs(rota);
        const rotaMudou = this.urlAtual && this.urlAtual !== url;

        // Reinicia estado caso esteja trocando de rota (evita reconectar na URL antiga)
        if (rotaMudou) {
            this.desconectar();
        }

        this.urlAtual = url;
        this.deveReconectar = true;
        this.tentativas = 0;

        this.#abrirConexao();
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
        this.deveReconectar = false;
        this.tentativas = 0;

        if (this.timerReconexao) {
            clearTimeout(this.timerReconexao);
            this.timerReconexao = null;
        }

        if (this.socketRef) {
            this.socketRef.close();
        }
                this.socketRef = null;
    }

    #abrirConexao() {
        if (!this.urlAtual) return;

        if (
            this.socketRef &&
            (this.socketRef.readyState === WebSocket.OPEN ||
                this.socketRef.readyState === WebSocket.CONNECTING)
        ) {
            return;
        }

        this.socketRef = new WebSocket(this.urlAtual);

        this.socketRef.onopen = () => {
            console.log('WebSocket conectado!');
            this.tentativas = 0;
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
            if (this.deveReconectar) {
                this.#agendarReconexao();
            }

            this.socketRef = null;
        };
    }

    #agendarReconexao() {
        const atraso = Math.min(1000 * 2 ** this.tentativas, 10000);
        this.tentativas += 1;
        if (this.timerReconexao) {
            clearTimeout(this.timerReconexao);
        }
        this.timerReconexao = setTimeout(() => {
            this.#abrirConexao();
        }, atraso);
    }
}

const instanciaSocket = new ServicoWebSocket();
export default instanciaSocket;
