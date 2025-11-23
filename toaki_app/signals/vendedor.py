from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import geohash as pgh

# Importações absolutas para evitar confusão de path
from toaki_app.models.perfil_vendedor import PerfilVendedor
from toaki_app.serializers.perfil_vendedor import PerfilVendedorSerializer

@receiver(post_save, sender=PerfilVendedor)
def notificar_movimentacao_vendedor(sender, instance, created, **kwargs):
    """
    Trigger: Sempre que o model PerfilVendedor for salvo (insert ou update).
    Ação: Serializa os dados e envia para o grupo WebSocket da área (Geohash).
    """
    # Se não tem localização ou não está online, não faz sentido avisar o mapa
    if not instance.localizacao_atual or not instance.esta_online:
        return

    # --- 1. Padronização de Dados (SSOT) ---
    # Usamos o serializer para garantir que o formato do JSON seja IDÊNTICO
    # ao que o frontend receberia numa chamada REST normal.
    serializer = PerfilVendedorSerializer(instance)
    dados_padronizados = serializer.data

    # --- 2. Lógica de Roteamento (Geohash) ---
    # Extrai lat/lon do PointField (x=lon, y=lat)
    lat = instance.localizacao_atual.y
    lon = instance.localizacao_atual.x
    
    # Precisão 6 define a "sala" onde o vendedor está (~1.2km)
    codigo_area = pgh.encode(lat, lon, precision=6)
    nome_da_sala = f"area_{codigo_area}"

    # --- 3. Broadcast (Envio) ---
    channel_layer = get_channel_layer()
    
    # O async_to_sync é necessário pois signals rodam em contexto síncrono (DB),
    # mas o Channels roda em contexto assíncrono (ASGI).
    async_to_sync(channel_layer.group_send)(
        nome_da_sala,
        {
            # 'type' define qual método do Consumer será chamado.
            # No nosso Consumer, criamos o método 'evento_broadcast' para isso.
            "type": "evento.broadcast",
            
            # Action e Payload seguem o nosso protocolo "ToAki"
            "action": "vendedorAtualizado",
            "payload": dados_padronizados
        }
    )
    
    # Log de Debug (remover em produção ou usar biblioteca logging)
    print(f"📡 Signal: Vendedor '{instance.nome_fantasia}' avisou a sala '{nome_da_sala}'")