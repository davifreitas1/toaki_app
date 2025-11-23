from django.contrib.gis.db import models
from .usuario import Usuario

class PerfilCliente(models.Model):
    """
    Model de Domínio.
    Responsabilidade: Regras de negócio do Cliente.
    """
    usuario = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='perfil_cliente'
    )
    
    localizacao_atual = models.PointField(srid=4326, null=True, blank=True)
    
    class Meta:
        verbose_name = "Cliente"
        verbose_name_plural = "Clientes"
        db_table = "perfis_clientes"

    def __str__(self):
        return f"Cliente: {self.usuario.username}"