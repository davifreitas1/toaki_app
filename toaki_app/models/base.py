import uuid
from django.db import models

class ModeloBase(models.Model):
    """
    Model abstrata que serve de base para todas as entidades do sistema.
    Garante que tudo tenha UUID e timestamps.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    criado_em = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    atualizado_em = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")
    ativo = models.BooleanField(default=True, verbose_name="Ativo")

    class Meta:
        abstract = True # O Django não cria tabela para isso, apenas usa como molde