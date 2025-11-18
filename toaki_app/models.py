from django.contrib.gis.db import models

class Vendedor(models.Model):
    nome = models.CharField(max_length=100)
    localizacao = models.PointField() 
    
    def __str__(self):
        return self.nome
