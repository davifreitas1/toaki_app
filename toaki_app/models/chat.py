# chat.py
from django.db import models
from .base import ModeloBase

class Chat(ModeloBase):
    pedido = models.OneToOneField(
        "toaki_app.Pedido",
        on_delete=models.CASCADE,
        related_name="chat",
    )

    class Meta:
        verbose_name = "Chat"
        verbose_name_plural = "Chats"
        db_table = "chat"

    def __str__(self):
        return f"Chat do pedido {self.pedido_id}"