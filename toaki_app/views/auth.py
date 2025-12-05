import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt # Apenas para facilitar o teste inicial (em prod usamos CSRF token)
def login_view(request):
    if request.method == 'POST':
        dados = json.loads(request.body)
        username = dados.get('username')
        password = dados.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user) 
            return JsonResponse({'status': 'sucesso', 'mensagem': 'Login realizado!'})
        else:
            return JsonResponse({'status': 'erro', 'mensagem': 'Credenciais inválidas'}, status=401)
    
    return JsonResponse({'status': 'erro', 'metodo': 'Metodo não permitido'}, status=405)

def logout_view(request):
    logout(request) # Apaga o cookie e a sessão no banco
    return JsonResponse({'status': 'sucesso', 'mensagem': 'Logout realizado!'})

# Endpoint auxiliar para verificar se o usuário JÁ está logado (útil para o React ao recarregar a pág)
def check_auth_view(request):
    if request.user.is_authenticated:
        return JsonResponse({'autenticado': True, 'usuario': request.user.username})
    else:
        return JsonResponse({'autenticado': False}, status=401)