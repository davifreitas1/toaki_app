from channels.generic.websocket import AsyncJsonWebsocketConsumer
from .roteador import RoteadorSocket

class ToAkiConsumer(AsyncJsonWebsocketConsumer):
    """
    Gateway WebSocket.
    Não contém regras de negócio. Apenas gerencia conexão e chama o Dispatcher.
    """


    async def connect(self):
        user = self.scope.get("user", None)
        print("User no connect:", user)

        if not user:
            print("Conexão WS rejeitada: token inválido ou ausente.")
            await self.close()
            return

        self.user = user
        print("Conexão WS aceita para:", self.user)

        await self.accept()
        self.roteador = RoteadorSocket(self)


    async def disconnect(self, close_code):
        # Lógica de limpeza de grupos (Redis) virá aqui
        pass

    async def receive_json(self, content):
        await self.roteador.rotear(content)

    async def enviar_sucesso(self, action_original, dados, request_id=None):
        response = {"status": "success", "action": action_original, "payload": dados}
        if request_id:
            response["requestId"] = request_id
        await self.send_json(response)

    async def enviar_erro(self, mensagem, request_id=None):
        response = {"status": "error", "message": mensagem}
        if request_id:
            response["requestId"] = request_id
        await self.send_json(response)

    async def evento_broadcast(self, event):
        payload_limpo = {k: v for k, v in event.items() if k != "type"}
        await self.send_json(payload_limpo)
