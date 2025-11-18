from django.contrib.gis import admin
from .models import Vendedor

# GISModelAdmin transforma o campo de texto em um Mapa Interativo (OpenStreetMap)
@admin.register(Vendedor)
class VendedorAdmin(admin.GISModelAdmin):
    list_display = ('nome', 'localizacao')
