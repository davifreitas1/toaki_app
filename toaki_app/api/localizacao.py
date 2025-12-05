
from ninja import Router, Schema
from typing import List
from ninja.errors import HttpError

from django.contrib.gis.geos import Point

from ..models import PerfilVendedor
from ..servicos.geolocalizacao import ServicoGeolocalizacao  

router = Router(tags=["localizacao"])


class LocalizacaoIn(Schema):
    latitude: float
    longitude: float


class VendedorProximoOut(Schema):
    id: str
    nome_fantasia: str
    latitude: float
    longitude: float


@router.post("/atualizar", response=List[VendedorProximoOut])
def atualizar_localizacao(request, payload: LocalizacaoIn):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")

    ServicoGeolocalizacao.atualizar_posicao_usuario(
        usuario=request.user,
        latitude=payload.latitude,
        longitude=payload.longitude,
    )

    vendedores = PerfilVendedor.objects.buscar_online_proximos(
        latitude=payload.latitude,
        longitude=payload.longitude,
        raio_km=1,
    )

    saida: list[VendedorProximoOut] = []
    for v in vendedores:
        if v.localizacao_atual:
            saida.append(
                VendedorProximoOut(
                    id=str(v.id),
                    nome_fantasia=v.nome_fantasia,
                    latitude=v.localizacao_atual.y,
                    longitude=v.localizacao_atual.x,
                )
            )

    return saida
