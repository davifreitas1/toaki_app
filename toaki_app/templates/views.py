from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.gis.geos import Point
from ..models import Vendedor

def mapa_cliente_view(request):
    """
    Renderiza o template HTML que contém o mapa e a lógica JavaScript.
    """
    return render(request, 'toaki_mapa/mapa.html', {})

# 2. View da API (Recebe a Localização do Vendedor)
class AtualizarLocalizacaoAPI(APIView):
    """
    API que recebe dados do App do Vendedor.
    Ao salvar, o Signal (que criamos em signals.py) dispara o WebSocket automaticamente.
    """
    def post(self, request):
        # Pega o ID do corpo da requisição
        vendedor_id = request.data.get('id')
        
        # Tenta converter lat/lon para garantir que são números válidos
        try:
            lat = float(request.data.get('lat'))
            lon = float(request.data.get('lon'))
        except (TypeError, ValueError):
            return Response({"status": "erro", "mensagem": "Lat/Lon inválidos ou ausentes"}, status=400)

        try:
            # Busca o vendedor no banco de dados
            vendedor = Vendedor.objects.get(id=vendedor_id)
            
            # Atualiza a posição espacial no PostGIS
            # O SRID 4326 é o padrão para GPS (WGS 84) - (Longitude, Latitude)
            vendedor.localizacao = Point(lon, lat, srid=4326)
            
            # O .save() é o gatilho crucial!
            # Ele aciona o 'signals.py', que por sua vez avisa o WebSocket.
            vendedor.save() 
            
            return Response({"status": "sucesso", "mensagem": "Localização atualizada"})
            
        except Vendedor.DoesNotExist:
            return Response({"status": "erro", "mensagem": "Vendedor não encontrado"}, status=404)