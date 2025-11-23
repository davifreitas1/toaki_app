from django.urls import path
from django.contrib.auth.views import LogoutView
from . import views

urlpatterns = [
    # Rota de Login
    path('login/', views.ToakiLoginView.as_view(), name='login'),
    
    # Rota de Logout (sempre bom ter para testar users diferentes)
    path('logout/', LogoutView.as_view(next_page='login'), name='logout'),

    # Rota Principal (Mapa)
    path('', views.mapa_em_tempo_real, name='mapa'),
]