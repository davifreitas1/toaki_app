# toaki_app/api/localizacao.py
from typing import List, Optional
from ninja import Router, Schema
from ninja.errors import HttpError
from pydantic import Field
from django.contrib.gis.geos import Point

from ..models import PerfilVendedor

router = Router(tags=["localizacao"])


class VendedorAllOut(Schema):
    id: str
    nome_fantasia: str
    esta_online: bool
    categorias: List[str] = Field(default_factory=list)   # sempre presente
    latitude: float = 0.0                                  # sempre presente
    longitude: float = 0.0                                 # sempre presente


@router.get("/vendedores", response=List[VendedorAllOut])
def listar_vendedores(request, ativos: Optional[bool] = None):
    """
    Lista vendedores.
    - Query param `ativos=true` retorna apenas os vendedores com esta_online=True.
    - `ativos=false` retorna apenas os inativos.
    - `ativos` omitido retorna todos.
    """
    # buscar todos (prefetch para categorias para evitar N+1)
    qs = PerfilVendedor.objects.all().prefetch_related("categorias")

    # filtrar por status se solicitado
    if ativos is True:
        qs = qs.filter(esta_online=True)
    elif ativos is False:
        qs = qs.filter(esta_online=False)

    # ordenar por ativo primeiro (opcional)
    qs = qs.order_by("-esta_online", "id")

    resultados: List[VendedorAllOut] = []
    for v in qs:
        # latitude / longitude (se não existir, retornamos 0.0)
        lat = float(v.localizacao_atual.y) if getattr(v, "localizacao_atual", None) else 0.0
        lon = float(v.localizacao_atual.x) if getattr(v, "localizacao_atual", None) else 0.0

        # pega categorias: prefere categorias_list (property), senão pega relacionamento
        categorias = getattr(v, "categorias_list", None)
        if categorias is None:
            # 'categorias' existe como related manager quando o campo existe no model
            if hasattr(v, "categorias"):
                categorias = [
                    (c.get_categoria_display() if hasattr(c, "get_categoria_display") else str(c))
                    for c in v.categorias.all()
                ]
            else:
                categorias = []

        resultados.append(
            VendedorAllOut(
                id=str(v.pk),
                nome_fantasia=v.nome_fantasia,
                esta_online=bool(v.esta_online),
                categorias=categorias,
                latitude=lat,
                longitude=lon,
            )
        )

    return resultados
