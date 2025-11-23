from django.urls import path
from .templates import views

urlpatterns = [
    # Rota para o frontend do cliente (ex: http://localhost:8000/)
    path('', views.mapa_cliente_view, name='mapa_cliente'),
]