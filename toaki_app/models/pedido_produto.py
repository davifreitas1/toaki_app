from django.db import models

from .base import ModeloBase
from .pedido import Pedido
from .produto import Produto


class PedidoProduto(ModeloBase):
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name="itens",
    )
    produto = models.ForeignKey(
        Produto,
        on_delete=models.CASCADE,
        related_name="pedido_produtos",
    )
    quantidade = models.PositiveIntegerField(default=1)
    valor_unitario = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,     
    )
    class Meta:
        verbose_name = "Produto do Pedido"
        verbose_name_plural = "Produtos do Pedido"
        db_table = "pedido_produtos"

    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome}"
    
    @property
    def subtotal(self):
        return self.quantidade * self.valor_unitario