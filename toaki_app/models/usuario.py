from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

class Usuario(AbstractUser):
    """
    Model de Autenticação (Core).
    Responsabilidade: Apenas credenciais e identificação de acesso.
    """
    class TipoUsuario(models.TextChoices):
        CLIENTE = 'CLIENTE', _('Cliente')
        VENDEDOR = 'VENDEDOR', _('Vendedor')
        ADMIN = 'ADMIN', _('Administrador')

    tipo_usuario = models.CharField(
        max_length=20,
        choices=TipoUsuario.choices,
        default=TipoUsuario.CLIENTE,
        help_text="Define o perfil principal de acesso do usuário"
    )

    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name=_('groups'),
        blank=True,
        help_text=_('The groups this user belongs to.'),
        related_name="usuario_set",
        related_query_name="usuario",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name=_('user permissions'),
        blank=True,
        help_text=_('Specific permissions for this user.'),
        related_name="usuario_set",
        related_query_name="usuario",
    )

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Base Usuarios"
        db_table = "usuarios"