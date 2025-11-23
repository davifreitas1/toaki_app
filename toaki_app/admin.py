from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.gis import admin as gis_admin
from .models import Usuario, PerfilVendedor, PerfilCliente

# 1. Configuração do Usuário (Auth)
@admin.register(Usuario)
class UsuarioAdmin(UserAdmin):
    # Adicionamos o campo 'tipo_usuario' no display e nos filtros
    list_display = ('username', 'email', 'tipo_usuario', 'is_staff')
    list_filter = ('tipo_usuario', 'is_staff', 'is_active')
    fieldsets = UserAdmin.fieldsets + (
        ('Informações Extras', {'fields': ('tipo_usuario',)}),
    )

# 2. Configuração do Perfil Vendedor (Com Mapa)
@admin.register(PerfilVendedor)
class PerfilVendedorAdmin(gis_admin.GISModelAdmin):
    list_display = ('nome_fantasia', 'usuario', 'esta_online')
    list_filter = ('esta_online',)
    search_fields = ('nome_fantasia', 'usuario__username')

# 3. Configuração do Perfil Cliente (Com Mapa)
@admin.register(PerfilCliente)
class PerfilClienteAdmin(gis_admin.GISModelAdmin):
    list_display = ('usuario', 'get_lat_lon')
    search_fields = ('usuario__username',)

    def get_lat_lon(self, obj):
        if obj.localizacao_atual:
            return f"{obj.localizacao_atual.y:.5f}, {obj.localizacao_atual.x:.5f}"
        return "-"
    get_lat_lon.short_description = "Localização Atual"