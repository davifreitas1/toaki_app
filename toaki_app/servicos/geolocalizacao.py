from django.contrib.gis.geos import Point
from ..models import Usuario, PerfilCliente, PerfilVendedor

class ServicoGeolocalizacao:
    """
    Camada de Domínio: Centraliza TODA a lógica relacionada a posicionamento.
    """

    @staticmethod
    def atualizar_posicao_usuario(usuario: Usuario, lat: float, lon: float):
        """
        Identifica o tipo de usuário e atualiza a tabela correta.
        """
        ponto = Point(float(lon), float(lat), srid=4326)
        perfil = None

        if usuario.tipo_usuario == Usuario.TipoUsuario.VENDEDOR:
            # get_or_create: Robustez caso o perfil ainda não exista
            perfil, _ = PerfilVendedor.objects.get_or_create(usuario=usuario)
            perfil.localizacao_atual = ponto
            perfil.esta_online = True # Regra de Negócio: Se mandou GPS, está online
            perfil.save()
            
        elif usuario.tipo_usuario == Usuario.TipoUsuario.CLIENTE:
            perfil, _ = PerfilCliente.objects.get_or_create(usuario=usuario)
            perfil.localizacao_atual = ponto
            perfil.save()
            
        return perfil

    @staticmethod
    def listar_vendedores_vizinhos(lat: float, lon: float, raio_km: float):
        """
        Fachada para a consulta complexa do Manager.
        """
        # Aqui poderíamos aplicar regras extras antes de buscar.
        # Ex: "Não mostrar vendedores bloqueados" ou "Filtrar por categoria"
        return PerfilVendedor.objects.buscar_online_proximos(lat, lon, raio_km)