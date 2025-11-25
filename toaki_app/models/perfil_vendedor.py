from django.contrib.gis.db import models
from django.contrib.gis.geos import Point
from django.contrib.gis.measure import D
from .usuario import Usuario

class VendedorManager(models.Manager):
    def buscar_online_proximos(self, latitude, longitude, raio_km=1):
        """
        Retorna apenas vendedores que estão ONLINE e dentro do raio especificado.
        """
        if not latitude or not longitude:
            return self.none() # Retorna queryset vazia se não tiver coordenadas

        ponto_referencia = Point(float(longitude), float(latitude), srid=4326)
        
        return self.filter(
            esta_online=True,
            localizacao_atual__distance_lte=(ponto_referencia, D(km=raio_km))
        )

class PerfilVendedor(models.Model):
    usuario = models.OneToOneField(
        Usuario, 
        on_delete=models.CASCADE, 
        related_name='perfil_vendedor'
    )
    nome_fantasia = models.CharField(max_length=150)
    localizacao_atual = models.PointField(srid=4326, null=True, blank=True)
    esta_online = models.BooleanField(default=False)
    
    # Injeção do Manager
    objects = VendedorManager()
    
    class Meta:
        verbose_name = "Vendedor"
        verbose_name_plural = "Vendedores"
        db_table = "perfis_vendedores"

    def __str__(self):
        return f"Vendedor: {self.nome_fantasia}"