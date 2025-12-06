// src/servicos/socketMapaClient.js

export class SocketMapaClient {
  constructor(url, onMessageCallback, onOpenCallback) {
    this.url = url;
    this.onMessage = onMessageCallback;
    this.onOpen = onOpenCallback;
    this.socket = null;
    this.deveReconectar = true;
  }

  conectar() {
    this.deveReconectar = true;
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      console.log('Socket Mapa conectado');
      if (this.onOpen) this.onOpen();
    };

    this.socket.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        this.onMessage && this.onMessage(data);
      } catch (err) {
        console.error('Erro ao parsear mensagem do socket:', err);
      }
    };

    this.socket.onclose = () => {
      console.log('Socket Mapa desconectado');
      if (this.deveReconectar) {
        setTimeout(() => this.conectar(), 3000);
      }
    };
  }

  desconectar() {
    this.deveReconectar = false;
    if (this.socket) {
      this.socket.close();
    }
  }

  enviar(action, payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          action,
          payload,
          requestId: crypto.randomUUID(),
        })
      );
    }
  }
}
