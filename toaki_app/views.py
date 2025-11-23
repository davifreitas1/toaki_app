from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView
from django.contrib.auth.decorators import login_required
from django.conf import settings

class ToakiLoginView(LoginView):
    """
    View de Login nativa customizada.
    Redireciona para o mapa automaticamente após sucesso.
    """
    template_name = 'toaki_app/login.html'
    redirect_authenticated_user = True

    def get_success_url(self):
        return '/' # Redireciona para a raiz (nosso mapa)

@login_required(login_url='/login/')
def mapa_em_tempo_real(request):
    """
    Entrega o HTML do mapa apenas para usuários autenticados.
    Injeta a API Key do Google e o ID do usuário para o JS usar.
    """
    context = {
        # Passamos a chave via contexto para não hardcoder no HTML
        # Idealmente viria de settings.GOOGLE_MAPS_API_KEY
        'google_api_key': getattr(settings, 'GOOGLE_MAPS_API_KEY', 'AIzaSyAUJn-i6MImc7AEWVVJ2L08hdvRsWjmygQ'),
        'user_id': request.user.id,
        'tipo_usuario': request.user.tipo_usuario, # Para logica visual (Vendedor x Cliente)
    }
    return render(request, 'toaki_app/mapa.html', context)