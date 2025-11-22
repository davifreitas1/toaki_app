from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Vendedor
import geohash as pgh

@receiver(post_save, sender=Vendedor)
def notificar_atualizacao_vendedor(sender, instance, created, **kwargs):
    if not instance.localizacao:
        return

    lon = instance.localizacao.x
    lat = instance.localizacao.y

    # Geohash com precisão 6
    user_geohash = pgh.encode(lat, lon, precision=6)
    group_name = f"mapa_{user_geohash}"

    message_data = {
        'type': 'provider_update',
        'id': instance.id,
        'nome': instance.nome,
        'lat': lat,
        'lon': lon
    }

    print(f"Signal disparado: Vendedor {instance.nome} atualizado no grupo {group_name}")

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            'type': 'broadcast_localizacao', 
            'message': message_data 
        }
    )