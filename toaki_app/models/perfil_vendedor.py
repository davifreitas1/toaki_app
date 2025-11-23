from django.contrib.gis.db import models
from .usuario import Usuario

class PerfilVendedor(models.Model):
    """
    Model de Domínio.
    Responsabilidade: Regras de negócio do Vendedor e Geolocalização.
    """
    usuario = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='perfil_vendedor'
    )
    
    nome_fantasia = models.CharField(max_length=150)
    
    # SRID 4326 = GPS (WGS 84)
    localizacao_atual = models.PointField(srid=4326, null=True, blank=True)
    
    esta_online = models.BooleanField(default=False)
    
    class Meta:
        verbose_name = "Vendedor"
        verbose_name_plural = "Vendedores"
        db_table = "perfis_vendedores"

    def __str__(self):
        return f"Vendedor: {self.nome_fantasia}"