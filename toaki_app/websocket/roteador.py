import logging
# Importação atualizada para a nova estrutura
from .processadores.localizacao import ProcessadorLocalizacao

logger = logging.getLogger(__name__)

class RoteadorSocket:
    """
    Classe que funciona como uma telefonista:
    Olha para a 'action' da mensagem e conecta com o Processador correto.
    """
    
    def __init__(self, consumer):
        self.consumer = consumer
        # Inicializa os processadores
        self.proc_localizacao = ProcessadorLocalizacao(consumer)

    async def rotear(self, envelope: dict):
        action = envelope.get("action")
        payload = envelope.get("payload", {})
        request_id = envelope.get("requestId")

        # Mapa de Rotas: Qual ação chama qual método?
        mapa_de_rotas = {
            "atualizarLocalizacao": self.proc_localizacao.processar_atualizacao,
            "buscarVendedores": self.proc_localizacao.buscar_vendedores_proximos,
        }

        metodo_responsavel = mapa_de_rotas.get(action)

        if not metodo_responsavel:
            logger.warning(f"Ação sem rota definida: {action}")
            await self.consumer.enviar_erro(f"Ação '{action}' desconhecida", request_id)
            return

        try:
            # Executa o processador
            await metodo_responsavel(payload, request_id)
        except Exception as e:
            logger.error(f"Erro ao processar {action}: {e}", exc_info=True)
            await self.consumer.enviar_erro("Erro interno no servidor", request_id)