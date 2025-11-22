import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D # 'D' é usado para distâncias (km, m)
from .models import Vendedor
from .serializers import VendedorSerializer
import geohash as pgh

class MapaConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        # Aceita a conexão imediatamente
        await self.accept()

    async def receive_json(self, content):
        # 1. Recebe a localização do usuário
        if content.get('type') == 'user_location':
            lat = content.get('lat')
            lon = content.get('lon')
            
            # 2. Adiciona ao grupo do Geohash (para atualizações futuras)
            user_geohash = pgh.encode(lat, lon, precision=6)
            self.group_name = f"mapa_{user_geohash}"
            await self.channel_layer.group_add(self.group_name, self.channel_name)

            # 3. BUSCA VENDEDORES PRÓXIMOS (Raio de 5km)
            # Precisamos usar await porque o banco de dados é síncrono
            vendedores_proximos = await self.get_vendedores_proximos(lat, lon)

            # 4. Envia a lista para o Frontend
            await self.send_json({
                'type': 'initial_providers', # O JS vai escutar esse tipo
                'providers': vendedores_proximos
            })

            print(f"Usuário adicionado ao geohash: {user_geohash}")

    # --- Métodos Auxiliares ---

    @database_sync_to_async
    def get_vendedores_proximos(self, lat, lon):
        user_point = Point(lon, lat, srid=4326)
        
        # Encontra vendedores onde a localização está a menos de 5km do ponto do usuário
        queryset = Vendedor.objects.filter(
            localizacao__distance_lte=(user_point, D(km=5))
        )
        
        # Serializa para GeoJSON
        serializer = VendedorSerializer(queryset, many=True)
        return serializer.data

    async def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def broadcast_localizacao(self, event):
        # Envia dados recebidos do grupo para o navegador
        await self.send_json(event['message'])