from django.db import models

from .base import ModeloBase
from .perfil_vendedor import PerfilVendedor


class Produto(ModeloBase):
    perfil_vendedor = models.ForeignKey(
        PerfilVendedor,
        on_delete=models.CASCADE,
        related_name="produtos",
    )
    nome = models.CharField(max_length=150)
    descricao = models.TextField(blank=True)
    foto = models.BinaryField(blank=True, null=True)
    preco = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"
        db_table = "produtos"

    def __str__(self):
        return self.nome