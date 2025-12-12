# toaki_app/websocket_urls.py
from django.urls import re_path
from toaki_app.websocket.consumer import ToAkiConsumer

websocket_urlpatterns = [
    re_path(r"ws/mapa/$", ToAkiConsumer.as_asgi()),
]
