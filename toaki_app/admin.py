from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.gis import admin as gis_admin
from .models import Avaliacao, PerfilCliente, PerfilVendedor, Usuario, Produto, Pedido, Chat, Mensagem, PedidoProduto, ChatMensagem

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


@admin.register(Avaliacao)
class AvaliacaoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'perfil_cliente',
        'perfil_vendedor',
        'pedido',
        'nota',
        'comentario_curto',
        'criado_em',
    )

    search_fields = (
        'perfil_cliente__usuario__username',
        'perfil_vendedor__usuario__username',
        'pedido__id',
        'comentario',
    )

    list_filter = ('nota',)

    def comentario_curto(self, obj):
        if obj.comentario:
            return obj.comentario[:30] + "..." if len(obj.comentario) > 30 else obj.comentario
        return "-"
    comentario_curto.short_description = "Comentário"

@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'perfil_vendedor', 'preco', 'criado_em')
    search_fields = ('nome', 'perfil_vendedor__nome_fantasia')
    list_filter = ('perfil_vendedor',)


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'perfil_cliente',
        'perfil_vendedor',
        'valor_total',
        'status',
        'pedido_visto',
        'criado_em',
    )

    list_filter = (
        'status',
        'pedido_visto',
        'perfil_vendedor',
        'perfil_cliente',
    )

    search_fields = (
        'id',
        'perfil_cliente__usuario__username',
        'perfil_vendedor__usuario__username',
    )

    list_editable = (
        'status',
        'pedido_visto',
    )

    ordering = ('-criado_em',)

@admin.register(PedidoProduto)
class PedidoProdutoAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'pedido',
        'produto',
        'quantidade',
        'criado_em',
    )

    list_filter = (
        'produto',
        'pedido',
    )

    search_fields = (
        'pedido__id',
        'produto__nome',
    )

    ordering = ('-criado_em',)

@admin.register(Mensagem)
class MensagemAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'autor_tipo_usuario',
        'perfil_cliente',
        'perfil_vendedor',
        'conteudo_resumido',
        'criado_em',
    )

    list_filter = (
        'autor_tipo_usuario',
        'perfil_cliente',
        'perfil_vendedor',
    )

    search_fields = (
        'conteudo',
        'perfil_cliente__usuario__username',
        'perfil_vendedor__usuario__username',
    )

    ordering = ('-criado_em',)

    def conteudo_resumido(self, obj):
        if obj.conteudo:
            return (obj.conteudo[:40] + '...') if len(obj.conteudo) > 40 else obj.conteudo
        return "-"
    conteudo_resumido.short_description = "Conteúdo"

@admin.register(Chat)
class ChatAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'pedido',
        'criado_em',
    )

    search_fields = (
        'pedido__id',
        'pedido__perfil_cliente__usuario__username',
        'pedido__perfil_vendedor__usuario__username',
    )

    list_filter = (
        'pedido__perfil_cliente',
        'pedido__perfil_vendedor',
    )

    ordering = ('-criado_em',)

@admin.register(ChatMensagem)
class ChatMensagemAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'chat',
        'mensagem',
        'criado_em',
    )
    search_fields = (
        'chat__id',
        'mensagem__conteudo',
    )
    list_filter = (
        'chat',
    )
    ordering = ('-criado_em',)

