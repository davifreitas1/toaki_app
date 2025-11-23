# toaki_app/websocket_urls.py

from django.urls import re_path
# Importamos o novo Consumer da pasta socket
from .websocket.consumer import ToAkiConsumer 

websocket_urlpatterns = [
    # Mantemos a mesma rota, mas agora aponta para o Consumer "Porteiro"
    re_path(r'ws/mapa/$', ToAkiConsumer.as_asgi()),
]