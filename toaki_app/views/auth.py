from django.shortcuts import render, redirect
from django.contrib.auth.views import LoginView

class ToakiLoginView(LoginView):
    """
    Gerencia o fluxo de entrada do usuário.
    """
    template_name = 'pages/login.html'
    redirect_authenticated_user = True

    def get_success_url(self):
        return '/' # Redireciona para a raiz (mapa)