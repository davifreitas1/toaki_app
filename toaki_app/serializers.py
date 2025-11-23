from rest_framework_gis.serializers import GeoFeatureModelSerializer
from .models import Vendedor

class VendedorSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Vendedor
        fields = ('id', 'nome', 'localizacao')
        geo_field = 'localizacao'