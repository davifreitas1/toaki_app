import logging
import geohash as pgh
from channels.db import database_sync_to_async
from ...models import Usuario
from ...serializers.perfil_vendedor import PerfilVendedorSerializer
from ...servicos.geolocalizacao import ServicoGeolocalizacao

logger = logging.getLogger(__name__)

class ProcessadorLocalizacao:
    """
    Processador responsável apenas pela camada de transporte (WebSocket).
    Gerencia Salas (Geohash simples) e delega regras de negócio para o Serviço.
    """

    def __init__(self, consumer):
        self.consumer = consumer
        self.usuario = consumer.scope["user"]

    async def processar_atualizacao(self, payload, request_id):
        """
        Action: 'atualizarLocalizacao'
        """
        lat = payload.get("lat")
        lon = payload.get("lon")
        print(f"capturei latitude { lat } e longitude { lon }")

        # --- CAMADA 1: DELEGAÇÃO AO SERVIÇO (Negócio/Banco) ---
        perfil = await database_sync_to_async(ServicoGeolocalizacao.atualizar_posicao_usuario)(
            self.usuario, lat, lon
        )
        
        if not perfil:
            await self.consumer.enviar_erro("Dados inválidos ou erro ao salvar", request_id)
            return

        # --- CAMADA 2: LÓGICA DE TRANSPORTE ---
        try:
            novo_geohash = pgh.encode(float(lat), float(lon), precision=6)
            nome_da_sala = f"area_{novo_geohash}"
            print(f"{nome_da_sala}")
            # Troca de sala se mudou de Geohash
            if hasattr(self.consumer, 'sala_atual') and self.consumer.sala_atual != nome_da_sala:
                await self.consumer.channel_layer.group_discard(
                    self.consumer.sala_atual, 
                    self.consumer.channel_name
                )
                print(f"Usuário mudou para: {nome_da_sala}")
                logger.info(f"Usuário mudou para: {nome_da_sala}")

            await self.consumer.channel_layer.group_add(nome_da_sala, self.consumer.channel_name)
            self.consumer.sala_atual = nome_da_sala

            # Resposta
            await self.consumer.enviar_sucesso("atualizarLocalizacao", {
                "mensagem": "OK",
                "area_codigo": novo_geohash
            }, request_id)
            print("enviei consumer.enviar_sucesso")

        except Exception as e:
            logger.error(f"Erro no cálculo de Geohash: {e}")
            await self.consumer.enviar_erro("Erro interno de processamento", request_id)

    async def buscar_vendedores_proximos(self, payload, request_id):
        """
        Action: 'buscarVendedores'
        """
        lat = payload.get("lat")
        lon = payload.get("lon")
        raio = payload.get("raioKm", 1)

        # --- CAMADA 1: DELEGAÇÃO AO SERVIÇO ---
        qs_vendedores = await database_sync_to_async(ServicoGeolocalizacao.listar_vendedores_vizinhos)(
            lat, lon, raio
        )
        
        # Serialização
        data = await database_sync_to_async(
            lambda: PerfilVendedorSerializer(qs_vendedores, many=True).data
        )()
        
        await self.consumer.enviar_sucesso("buscarVendedores", {
            "vendedores": data
        }, request_id)
