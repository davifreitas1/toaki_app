from django.db import models

from .base import ModeloBase
from .pedido import Pedido


class Chat(ModeloBase):
    pedido = models.ForeignKey(
        Pedido,
        on_delete=models.CASCADE,
        related_name="chats",
    )

    class Meta:
        verbose_name = "Chat"
        verbose_name_plural = "Chats"
        db_table = "chat"

    def __str__(self):
        return f"Chat do pedido {self.pedido_id}"
    
