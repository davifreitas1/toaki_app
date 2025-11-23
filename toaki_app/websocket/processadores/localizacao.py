import logging
import geohash as pgh
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from channels.db import database_sync_to_async
from ...models import PerfilCliente, PerfilVendedor, Usuario
from ...serializers.perfil_vendedor import PerfilVendedorSerializer

logger = logging.getLogger(__name__)

class ProcessadorLocalizacao:
    """
    Processador responsável por receber dados brutos de GPS e 
    aplicar as regras de negócio de geolocalização.
    """

    def __init__(self, consumer):
        self.consumer = consumer
        self.usuario = consumer.scope["user"]

    async def processar_atualizacao(self, payload, request_id):
        """
        Ação: 'atualizarLocalizacao'
        O que faz: Grava no banco e define em qual 'sala' (geohash) o usuário está.
        """
        try:
            lat = float(payload.get("lat"))
            lon = float(payload.get("lon"))
        except (ValueError, TypeError):
            await self.consumer.enviar_erro("Latitude ou Longitude inválidas", request_id)
            return

        # 1. Persistência (Salvar no Banco)
        perfil = await self._salvar_no_banco(lat, lon)
        
        if not perfil:
            await self.consumer.enviar_erro("Perfil de usuário não encontrado", request_id)
            return

        # 2. Lógica de Salas (Geohash)
        # Calcula o código da área (ex: '6gyf4c')
        novo_geohash = pgh.encode(lat, lon, precision=6)
        nome_da_sala = f"area_{novo_geohash}"

        # Se mudou de área, sai da antiga e entra na nova
        if hasattr(self.consumer, 'sala_atual') and self.consumer.sala_atual != nome_da_sala:
            await self.consumer.channel_layer.group_discard(
                self.consumer.sala_atual, 
                self.consumer.channel_name
            )
            logger.info(f"Usuário {self.usuario.username} mudou para a área {nome_da_sala}")

        await self.consumer.channel_layer.group_add(nome_da_sala, self.consumer.channel_name)
        self.consumer.sala_atual = nome_da_sala

        # 3. Confirmação para o Frontend
        await self.consumer.enviar_sucesso("atualizarLocalizacao", {
            "mensagem": "Localização processada com sucesso",
            "area_codigo": novo_geohash
        }, request_id)

        # 4. Fofoca (Broadcast): Se for vendedor, avisa quem está na sala
        if self.usuario.tipo_usuario == Usuario.TipoUsuario.VENDEDOR:
            await self._avisar_vizinhos(nome_da_sala, perfil, lat, lon)


    async def buscar_vendedores_proximos(self, payload, request_id):
        """
        Ação: 'buscarVendedores'
        O que faz: Retorna lista de vendedores num raio de km.
        """
        lat = payload.get("lat")
        lon = payload.get("lon")
        raio = payload.get("raioKm", 1)

        if not lat or not lon:
            await self.consumer.enviar_erro("Localização obrigatória para busca", request_id)
            return

        lista_vendedores = await self._consultar_banco_vendedores(lat, lon, raio)
        
        await self.consumer.enviar_sucesso("buscarVendedores", {
            "vendedores": lista_vendedores
        }, request_id)


    # --- Métodos Internos (Acesso ao Banco de Dados) ---
    
    @database_sync_to_async
    def _salvar_no_banco(self, lat, lon):
        ponto = Point(lon, lat, srid=4326)
        
        if self.usuario.tipo_usuario == Usuario.TipoUsuario.VENDEDOR:
            perfil, _ = PerfilVendedor.objects.get_or_create(usuario=self.usuario)
            perfil.localizacao_atual = ponto
            perfil.esta_online = True 
            perfil.save()
            return perfil
            
        elif self.usuario.tipo_usuario == Usuario.TipoUsuario.CLIENTE:
            perfil, _ = PerfilCliente.objects.get_or_create(usuario=self.usuario)
            perfil.localizacao_atual = ponto
            perfil.save()
            return perfil
        return None

    @database_sync_to_async
    def _consultar_banco_vendedores(self, lat, lon, raio_km):
        ponto_usuario = Point(lon, lat, srid=4326)
        
        # Busca espacial: vendedores dentro do raio e online
        qs = PerfilVendedor.objects.filter(
            localizacao_atual__distance_lte=(ponto_usuario, D(km=raio_km)),
            esta_online=True
        )
        return PerfilVendedorSerializer(qs, many=True).data

    async def _avisar_vizinhos(self, nome_sala, perfil, lat, lon):
        """
        Envia um aviso para todos conectados na mesma 'sala' (área).
        """
        mensagem = {
            "type": "evento.broadcast", # Chama o método no Consumer
            "action": "vendedorMovimentou",
            "payload": {
                "id": perfil.id,
                "nome": perfil.nome_fantasia,
                "lat": lat,
                "lon": lon
            }
        }
        await self.consumer.channel_layer.group_send(nome_sala, mensagem)