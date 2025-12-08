from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.gis import admin as gis_admin
from django.utils.html import mark_safe
import base64

from .models.usuario import Usuario
from .models.perfil_cliente import PerfilCliente
from .models.perfil_vendedor import PerfilVendedor
from .models.produto import Produto
from .models.pedido import Pedido
from .models.pedido_produto import PedidoProduto
from .models.avaliacao import Avaliacao
from .models.chat import Chat
from .models.mensagem import Mensagem
from .models.chat_mensagem import ChatMensagem
from .models.vendedor_categoria import VendedorCategoria



class VendedorCategoriaInline(admin.TabularInline):
    model = VendedorCategoria
    extra = 1

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

    inlines = [VendedorCategoriaInline]

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


@admin.register(Produto)
class ProdutoAdmin(admin.ModelAdmin):
    list_display = ('nome', 'perfil_vendedor', 'preco', 'criado_em', 'preview_foto')
    readonly_fields = ('preview_foto_admin',)

    fields = (
        'perfil_vendedor',
        'nome',
        'descricao',
        'preco',
        'preview_foto_admin',   # tiramos 'foto' daqui
    )

    def _foto_base64(self, obj):
        if not obj.foto:
            return None

        dados = obj.foto
        if isinstance(dados, memoryview):
            dados = dados.tobytes()

        return base64.b64encode(dados).decode('utf-8')

    def preview_foto(self, obj):
        b64 = self._foto_base64(obj)
        if b64:
            return mark_safe(
                f'<img src="data:image/jpeg;base64,{b64}" '
                f'width="70" height="70" style="object-fit: cover; border-radius: 5px;" />'
            )
        return "Sem foto"

    preview_foto.short_description = 'Foto'

    def preview_foto_admin(self, obj):
        b64 = self._foto_base64(obj)
        if b64:
            return mark_safe(
                f'<img src="data:image/jpeg;base64,{b64}" '
                f'width="200" style="border-radius: 5px;" />'
            )
        return "Nenhuma imagem carregada."

    preview_foto_admin.short_description = 'Pré-visualização'

    
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

class AvaliacaoInline(admin.StackedInline):
    model = Avaliacao
    extra = 0
    can_delete = True

class ChatInline(admin.StackedInline):
    model = Chat
    extra = 0
    can_delete = True


class PedidoProdutoInline(admin.TabularInline):
    model = PedidoProduto
    extra = 0
    fields = ("produto", "quantidade", "valor_unitario", "subtotal_readonly")
    readonly_fields = ("subtotal_readonly",)

    def subtotal_readonly(self, obj):
        return obj.subtotal if obj.id else "—"
    subtotal_readonly.short_description = "Subtotal"


@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "perfil_cliente",
        "perfil_vendedor",
        "valor_total",
        "status",
        "pedido_visto",
        "criado_em",
    )

    list_filter = (
        "status",
        "pedido_visto",
        "perfil_vendedor",
        "perfil_cliente",
    )

    search_fields = (
        "id",
        "perfil_cliente__usuario__username",
        "perfil_vendedor__usuario__username",
        "itens__produto__nome",  # via related_name="itens" em PedidoProduto
    )

    list_editable = (
        "status",
        "pedido_visto",
    )

    ordering = ("-criado_em",)

    inlines = [
        PedidoProdutoInline,
        ChatInline,
        AvaliacaoInline,
    ]



    def preview_foto_admin(self, obj):
        """Pré-visualização grande na página de edição."""
        if obj.foto:
            return mark_safe(
                f'<img src="{obj.foto.url}" width="200" '
                f'style="border-radius: 5px;" />'
            )
        return "Nenhuma imagem carregada."

    preview_foto_admin.short_description = 'Pré-visualização'

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

@admin.register(VendedorCategoria)
class VendedorCategoriaAdmin(admin.ModelAdmin):
    list_display = ("perfil_vendedor", "categoria", "criado_em")
    list_filter = ("categoria", "perfil_vendedor")
    search_fields = ("perfil_vendedor__nome_fantasia",)
    ordering = ("-criado_em",)