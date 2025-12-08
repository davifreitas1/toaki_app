from django.db import models

from .base import ModeloBase
from .chat import Chat
from .mensagem import Mensagem


class ChatMensagem(ModeloBase):
    chat = models.ForeignKey(
        Chat,
        on_delete=models.CASCADE,
        related_name="mensagens",
    )
    mensagem = models.ForeignKey(
        Mensagem,
        on_delete=models.CASCADE,
        related_name="chats",
    )

    class Meta:
        verbose_name = "Mensagem do Chat"
        verbose_name_plural = "Mensagens do Chat"
        db_table = "chat_mensagens"

    def __str__(self):
        return f"Mensagem {self.mensagem_id} no chat {self.chat_id}"