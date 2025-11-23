from rest_framework_gis.serializers import GeoFeatureModelSerializer
from ..models import PerfilVendedor

class PerfilVendedorSerializer(GeoFeatureModelSerializer):
    """
    Transforma o Model PerfilVendedor em GeoJSON.
    Usado para enviar dados ao Frontend.
    """
    class Meta:
        model = PerfilVendedor
        # Define qual campo contém a geometria (lat/lon)
        geo_field = 'localizacao_atual'
        # Campos que serão enviados no JSON
        fields = ('id', 'nome_fantasia', 'esta_online', 'localizacao_atual')