from django.db import models

from .base import ModeloBase
from .perfil_cliente import PerfilCliente
from .perfil_vendedor import PerfilVendedor


class Pedido(ModeloBase):
    class Status(models.TextChoices):
        PENDENTE = "PENDENTE", "Pendente"
        CONFIRMADO = "CONFIRMADO", "Confirmado"
        EM_ANDAMENTO = "EM_ANDAMENTO", "Em andamento"
        CONCLUIDO = "CONCLUIDO", "Concluído"
        CANCELADO = "CANCELADO", "Cancelado"

    perfil_vendedor = models.ForeignKey(
        PerfilVendedor,
        on_delete=models.CASCADE,
        related_name="pedidos",
    )
    perfil_cliente = models.ForeignKey(
        PerfilCliente,
        on_delete=models.CASCADE,
        related_name="pedidos",
    )

    valor_total = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDENTE)
    pedido_visto = models.BooleanField(default=False)

    chat_principal = models.OneToOneField(
        "toaki_app.Chat",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="pedido_principal",
        help_text="Chat principal associado a este pedido (se existir).",
    )

    avaliacao_principal = models.OneToOneField(
        "toaki_app.Avaliacao",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="pedido_avaliado",
        help_text="Avaliação principal associada a este pedido (se existir).",
    )
    

    class Meta:
        verbose_name = "Pedido"
        verbose_name_plural = "Pedidos"
        db_table = "pedidos"

    def __str__(self):
        return f"Pedido {self.id} - {self.get_status_display()}"
    
    @property
    def quantidade_itens(self):
        return self.itens.count()

    @property
    def calcular_total(self):
        return sum(item.subtotal for item in self.itens.all())

