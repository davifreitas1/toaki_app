from django.db import models

from .base import ModeloBase
from .perfil_cliente import PerfilCliente
from .perfil_vendedor import PerfilVendedor
from .usuario import Usuario


class Mensagem(ModeloBase):
    class AutorTipo(models.TextChoices):
        CLIENTE = Usuario.TipoUsuario.CLIENTE, "Cliente"
        VENDEDOR = Usuario.TipoUsuario.VENDEDOR, "Vendedor"

    perfil_vendedor = models.ForeignKey(
        PerfilVendedor,
        on_delete=models.CASCADE,
        related_name="mensagens_enviadas",
        null=True,
        blank=True,
    )
    perfil_cliente = models.ForeignKey(
        PerfilCliente,
        on_delete=models.CASCADE,
        related_name="mensagens_enviadas",
        null=True,
        blank=True,
    )
    conteudo = models.TextField()
    autor_tipo_usuario = models.CharField(
        max_length=20,
        choices=AutorTipo.choices,
    )

    class Meta:
        verbose_name = "Mensagem"
        verbose_name_plural = "Mensagens"
        db_table = "mensagens"

    def __str__(self):
        return f"Mensagem de {self.get_autor_tipo_usuario_display()}"