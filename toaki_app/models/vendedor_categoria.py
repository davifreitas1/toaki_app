from django.db import models
from .base import ModeloBase


class VendedorCategoria(ModeloBase):
    class CategoriaTipo(models.TextChoices):
        COMIDA = "COMIDA", "Comida"
        VESTUARIO = "VESTUARIO", "Vestuário"
        ACESSORIOS = "ACESSORIOS", "Acessórios"
        BEBIDAS = "BEBIDAS", "Bebidas"
        SORVETES = "SORVETES", "Sorvetes"
        OUTROS = "OUTROS", "Outros"

    perfil_vendedor = models.ForeignKey(
        "toaki_app.PerfilVendedor",
        on_delete=models.CASCADE,
        related_name="categorias",
    )

    categoria = models.CharField(
        max_length=20,
        choices=CategoriaTipo.choices,
    )

    class Meta:
        verbose_name = "Categoria do Vendedor"
        verbose_name_plural = "Categorias dos Vendedores"
        db_table = "vendedores_categorias"
        unique_together = ("perfil_vendedor", "categoria")

    def __str__(self):
        return f"{self.perfil_vendedor.nome_fantasia} - {self.get_categoria_display()}"
