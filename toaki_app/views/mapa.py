from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.conf import settings

@login_required(login_url='/login/')
def mapa_em_tempo_real(request):
    """
    Renderiza a SPA (Single Page Application) do mapa.
    Injeta configurações iniciais no contexto.
    """
    print(request.user, request.session.session_key)
    context = {
        # Boa prática: Usar getattr para evitar erro 500 se a chave não existir
        'google_api_key': getattr(settings, 'GOOGLE_MAPS_API_KEY', ''),
        'user_id': request.user.id,
        'tipo_usuario': request.user.tipo_usuario,
        'ws_url': getattr(settings, 'WEBSOCKET_URL', None),
    }
    return render(request, 'pages/mapa.html', context)