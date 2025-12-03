import uuid
from django.contrib.auth import login
from django.contrib.auth.views import LoginView
from django.shortcuts import redirect
from django.views.generic import View, CreateView, FormView
from django.conf import settings
from ..forms import CadastroUsuarioForm, ConvidadoForm
from ..models import Usuario

class ToakiLoginView(LoginView):
    """
    Login Padrão.
    O template envia 'username' (que o usuário preenche com email) e 'password'.
    O Django valida nativamente.
    """
    template_name = 'pages/login.html'
    redirect_authenticated_user = True

    def get_success_url(self):
        user = self.request.user
        if user.tipo_usuario == Usuario.TipoUsuario.VENDEDOR:
            return '/dashboard/' # Futuro
        return '/' # Mapa

    def get_context_data(self, **kwargs):
        # Injeção de configuração para o Frontend
        context = super().get_context_data(**kwargs)
        context['google_api_key'] = getattr(settings, 'GOOGLE_MAPS_API_KEY', '')
        context['ws_url'] = getattr(settings, 'WEBSOCKET_URL', '')
        return context
