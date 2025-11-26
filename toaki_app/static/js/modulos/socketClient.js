export class SocketClient {
    constructor(url, onMessageCallback, onOpenCallback) {
        this.url = url;
        this.onMessage = onMessageCallback;
        this.onOpen = onOpenCallback;
        this.socket = null;
    }

    conectar() {
        this.socket = new WebSocket(this.url);
        this.socket.onopen = () => {
            console.log("Socket Conectado! :)");
            if (this.onOpen) this.onOpen();
        };
        this.socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            this.onMessage(data);
        };
        this.socket.onclose = () => {
            console.log("Reconectando... :/");
            setTimeout(() => this.conectar(), 3000);
        };
    }

    enviar(action, payload) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify({
                action: action,
                payload: payload,
                requestId: crypto.randomUUID()
            }));
        }
    }
}