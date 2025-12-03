from django.db import models

from .base import ModeloBase
from .pedido import Pedido
from .perfil_cliente import PerfilCliente
from .perfil_vendedor import PerfilVendedor


class Avaliacao(ModeloBase):
    perfil_cliente = models.ForeignKey(
        PerfilCliente,
        on_delete=models.CASCADE,
        related_name="avaliacoes_realizadas",
    )
    perfil_vendedor = models.ForeignKey(
        PerfilVendedor,
        on_delete=models.CASCADE,
        related_name="avaliacoes_recebidas",
    )
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name="avaliacoes",
    )
    nota = models.PositiveSmallIntegerField()
    comentario = models.TextField(blank=True)

    class Meta:
        verbose_name = "Avaliação"
        verbose_name_plural = "Avaliações"
        db_table = "avaliacoes"

    def __str__(self):
        return (
            f"Avaliação {self.nota} do pedido {self.pedido_id} "
            f"de {self.perfil_cliente} para {self.perfil_vendedor}"
        )