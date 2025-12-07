# toaki_app/api/perfis.py
from typing import List, Optional
from ninja import Router, Schema
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from pydantic import Field
from django.db import IntegrityError, transaction
from django.db.models import Q

from ..models import PerfilVendedor, PerfilCliente  # não importamos Categoria diretamente

router = Router(tags=["perfis"])


# ----------------------
# Schemas
# ----------------------
class PerfilVendedorIn(Schema):
    nome_fantasia: str
    latitude: float | None = None
    longitude: float | None = None


class PerfilClienteIn(Schema):
    nome: str | None = None
    telefone: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class LocalizacaoIn(Schema):
    latitude: float
    longitude: float


class OnlineIn(Schema):
    esta_online: bool | None = None  # se None => toggle


class CategoriaIn(Schema):
    # agora categoria é string: o valor das choices (ex.: "COMIDA", "BEBIDAS")
    categoria: str


class PerfilVendedorOut(Schema):
    id: str
    nome_fantasia: str
    latitude: float
    longitude: float
    esta_online: bool
    categorias: List[str]


class PerfilClienteOut(Schema):
    id: str
    nome: str
    telefone: str | None = None
    latitude: float = 0.0
    longitude: float = 0.0


class VendedorAllOut(Schema):
    id: str
    nome_fantasia: str
    esta_online: bool
    categorias: List[str] = Field(default_factory=list)
    latitude: float = 0.0
    longitude: float = 0.0
    distancia_km: float = 0.0


# ----------------------
# Helpers defensivos
# ----------------------
def _get_categorias_para_perfil(perfil: PerfilVendedor) -> List[str]:
    """
    Retorna lista de categorias (string) do vendedor.
    Estratégia:
     1) property 'categorias_list'
     2) related manager 'categorias' (M2M)
     3) model VendedorCategoria com campo 'categoria' (CharField choices) — retorna valores display quando possível
     4) []
    """
    # 1) property preferida
    categorias = getattr(perfil, "categorias_list", None)
    if categorias is not None:
        return list(categorias or [])

    # 2) related manager 'categorias' (M2M)
    if hasattr(perfil, "categorias"):
        try:
            return [
                (c.get_categoria_display() if hasattr(c, "get_categoria_display") else str(c))
                for c in perfil.categorias.all()
            ]
        except Exception:
            pass

    # 3) tentar model VendedorCategoria (campo 'categoria' como str)
    try:
        from ..models import VendedorCategoria

        q = VendedorCategoria.objects.filter(perfil_vendedor=getattr(perfil, "pk", None))
        result = []
        for vc in q:
            # se VC tem método get_categoria_display (choices na field), use-o
            if hasattr(vc, "get_categoria_display"):
                try:
                    result.append(vc.get_categoria_display())
                except Exception:
                    # fallback para raw value
                    result.append(str(getattr(vc, "categoria", vc.pk)))
            else:
                # tenta atributo 'categoria' ou 'nome'
                if hasattr(vc, "categoria"):
                    result.append(str(getattr(vc, "categoria")))
                elif hasattr(vc, "nome"):
                    result.append(str(getattr(vc, "nome")))
                else:
                    result.append(str(vc.pk))
        if result:
            return result
    except Exception:
        pass

    return []


def _perfil_vendedor_to_out_safe(p: PerfilVendedor) -> PerfilVendedorOut:
    lat = float(p.localizacao_atual.y) if getattr(p, "localizacao_atual", None) else 0.0
    lon = float(p.localizacao_atual.x) if getattr(p, "localizacao_atual", None) else 0.0
    categorias = _get_categorias_para_perfil(p)
    return PerfilVendedorOut(
        id=str(p.pk),
        nome_fantasia=getattr(p, "nome_fantasia", "") or "",
        latitude=lat,
        longitude=lon,
        esta_online=bool(getattr(p, "esta_online", False)),
        categorias=categorias,
    )


def _perfil_cliente_to_out_safe(p: PerfilCliente) -> PerfilClienteOut:
    lat = float(p.localizacao_atual.y) if getattr(p, "localizacao_atual", None) else 0.0
    lon = float(p.localizacao_atual.x) if getattr(p, "localizacao_atual", None) else 0.0
    nome = getattr(p, "nome", None)
    telefone = getattr(p, "telefone", None)
    if not nome:
        nome = getattr(getattr(p, "usuario", None), "username", "") or ""
    return PerfilClienteOut(
        id=str(p.pk),
        nome=nome,
        telefone=telefone,
        latitude=lat,
        longitude=lon,
    )


def _perfil_vendedor_to_basic_out_safe(p: PerfilVendedor, distancia_km: float = 0.0) -> VendedorAllOut:
    lat = float(p.localizacao_atual.y) if getattr(p, "localizacao_atual", None) else 0.0
    lon = float(p.localizacao_atual.x) if getattr(p, "localizacao_atual", None) else 0.0
    categorias = _get_categorias_para_perfil(p)
    return VendedorAllOut(
        id=str(p.pk),
        nome_fantasia=getattr(p, "nome_fantasia", "") or "",
        esta_online=bool(getattr(p, "esta_online", False)),
        categorias=categorias,
        latitude=lat,
        longitude=lon,
        distancia_km=float(distancia_km or 0.0),
    )


# ----------------------
# CRUD Perfis
# ----------------------
@router.post("/perfis/vendedor", response=PerfilVendedorOut, status_code=201)
def criar_perfil_vendedor(request, payload: PerfilVendedorIn):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    if getattr(request.user, "perfil_vendedor", None):
        raise HttpError(400, "Usuário já possui perfil de vendedor")
    try:
        with transaction.atomic():
            perfil = PerfilVendedor.objects.create(
                usuario=request.user,
                nome_fantasia=payload.nome_fantasia,
                localizacao_atual=Point(float(payload.longitude), float(payload.latitude), srid=4326)
                if payload.latitude is not None and payload.longitude is not None
                else None,
            )
    except IntegrityError:
        raise HttpError(400, "Erro ao criar perfil vendedor")
    return _perfil_vendedor_to_out_safe(perfil)


@router.post("/perfis/cliente", response=PerfilClienteOut, status_code=201)
def criar_perfil_cliente(request, payload: PerfilClienteIn):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    if getattr(request.user, "perfil_cliente", None):
        raise HttpError(400, "Usuário já possui perfil de cliente")
    try:
        with transaction.atomic():
            kwargs = {}
            if hasattr(PerfilCliente, "nome"):
                kwargs["nome"] = payload.nome or ""
            if hasattr(PerfilCliente, "telefone"):
                kwargs["telefone"] = payload.telefone
            perfil = PerfilCliente.objects.create(usuario=request.user, **kwargs)
            if payload.latitude is not None and payload.longitude is not None:
                perfil.localizacao_atual = Point(float(payload.longitude), float(payload.latitude), srid=4326)
                perfil.save()
    except IntegrityError:
        raise HttpError(400, "Erro ao criar perfil cliente")
    return _perfil_cliente_to_out_safe(perfil)


@router.get("/perfis/cliente", response=PerfilClienteOut)
def get_perfil_cliente_logado(request):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    perfil = getattr(request.user, "perfil_cliente", None)
    if not perfil:
        raise HttpError(404, "Perfil cliente não encontrado")
    return _perfil_cliente_to_out_safe(perfil)


@router.get("/perfis/vendedor", response=PerfilVendedorOut)
def get_perfil_vendedor_logado(request):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    perfil = getattr(request.user, "perfil_vendedor", None)
    if not perfil:
        raise HttpError(404, "Perfil vendedor não encontrado")
    return _perfil_vendedor_to_out_safe(perfil)


@router.get("/vendedores/{vendor_id}", response=PerfilVendedorOut)
def get_perfil_vendedor_admin(request, vendor_id: int):
    perfil = get_object_or_404(PerfilVendedor, pk=vendor_id)
    return _perfil_vendedor_to_out_safe(perfil)


# ----------------------
# Localização / online
# ----------------------
@router.put("/localizacao/cliente", response={"200": dict})
def atualizar_localizacao_cliente(request, payload: LocalizacaoIn):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    perfil = getattr(request.user, "perfil_cliente", None)
    if not perfil:
        raise HttpError(404, "Perfil cliente não encontrado")
    perfil.localizacao_atual = Point(float(payload.longitude), float(payload.latitude), srid=4326)
    perfil.save()
    return {"ok": True, "latitude": float(perfil.localizacao_atual.y), "longitude": float(perfil.localizacao_atual.x)}


@router.put("/localizacao/vendedor", response=PerfilVendedorOut)
def atualizar_localizacao_vendedor(request, payload: LocalizacaoIn):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    perfil = getattr(request.user, "perfil_vendedor", None)
    if not perfil:
        raise HttpError(404, "Perfil vendedor não encontrado")
    perfil.localizacao_atual = Point(float(payload.longitude), float(payload.latitude), srid=4326)
    perfil.save()
    return _perfil_vendedor_to_out_safe(perfil)


@router.patch("/vendedores/{vendor_id}/online", response=PerfilVendedorOut)
def set_online_vendedor(request, vendor_id: int, payload: OnlineIn):
    perfil = get_object_or_404(PerfilVendedor, pk=vendor_id)
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    if not (
        request.user.is_staff
        or (getattr(request.user, "perfil_vendedor", None) and str(getattr(request.user.perfil_vendedor, "pk")) == str(vendor_id))
    ):
        raise HttpError(403, "Somente admin ou o próprio vendedor pode alterar o status")
    if payload.esta_online is None:
        perfil.esta_online = not perfil.esta_online
    else:
        perfil.esta_online = bool(payload.esta_online)
    perfil.save()
    return _perfil_vendedor_to_out_safe(perfil)


# ----------------------
# Categorias (adicionar / remover / listar) - com categoria:str
# ----------------------
@router.get("/vendedores/{vendor_id}/categorias", response=List[str])
def listar_categorias_vendedor(request, vendor_id: int):
    perfil = get_object_or_404(PerfilVendedor, pk=vendor_id)
    categorias = _get_categorias_para_perfil(perfil)
    return categorias


@router.post("/vendedores/{vendor_id}/categorias", status_code=201)
def add_categoria_vendedor(request, vendor_id: int, payload: CategoriaIn):
    """
    Adiciona categoria (string) para o vendedor usando VendedorCategoria.categoria.
    Valida contra VendedorCategoria.CategoriaTipo when possible.
    """
    perfil = get_object_or_404(PerfilVendedor, pk=vendor_id)

    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    if not (request.user.is_staff or (getattr(request.user, "perfil_vendedor", None) and request.user.perfil_vendedor.pk == perfil.pk)):
        raise HttpError(403, "Somente admin ou dono pode adicionar categoria")

    categoria_val = (payload.categoria or "").strip()
    if not categoria_val:
        raise HttpError(400, "campo 'categoria' é obrigatório")

    # Trabalhar com VendedorCategoria (espera-se campo `categoria` CharField com choices)
    try:
        from ..models import VendedorCategoria
    except Exception:
        raise HttpError(500, "VendedorCategoria model não disponível no projeto")

    # Validar contra choices se existir CategoriaTipo
    valid_vals = None
    if hasattr(VendedorCategoria, "CategoriaTipo"):
        # extrai os valores das choices
        try:
            valid_vals = [str(c[0]) for c in getattr(VendedorCategoria, "CategoriaTipo").choices]
        except Exception:
            valid_vals = None

    # match case-insensitive: encontra o valor oficial das choices
    if valid_vals:
        match = None
        for v in valid_vals:
            if v.lower() == categoria_val.lower():
                match = v
                break
        if not match:
            raise HttpError(400, f"Categoria inválida. Valores válidos: {valid_vals}")
        categoria_to_store = match
    else:
        # sem choices disponíveis, armazena o raw (mas limpa)
        categoria_to_store = categoria_val

    # Evitar duplicata: verificar se já existe
    exists = VendedorCategoria.objects.filter(perfil_vendedor=perfil.pk, categoria__iexact=categoria_to_store).exists()
    if exists:
        return {"ok": True, "msg": "Categoria já vinculada"}

    try:
        VendedorCategoria.objects.create(perfil_vendedor=perfil, categoria=categoria_to_store)
    except Exception as e:
        raise HttpError(400, f"Erro ao adicionar categoria: {e}")

    return {"ok": True}

@router.delete("/vendedores/{vendor_id}/categorias/{categoria_val}", status_code=204)
def remove_categoria_vendedor(request, vendor_id: int, categoria_val: str):
    """
    Remove a categoria (string) do vendedor. URL usa o valor string da categoria.
    Ex: DELETE /vendedores/1/categorias/COMIDA
    """
    perfil = get_object_or_404(PerfilVendedor, pk=vendor_id)

    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    if not (request.user.is_staff or (getattr(request.user, "perfil_vendedor", None) and request.user.perfil_vendedor.pk == perfil.pk)):
        raise HttpError(403, "Somente admin ou dono pode remover categoria")

    categoria_val = (categoria_val or "").strip()
    if not categoria_val:
        raise HttpError(400, "categoria inválida na URL")

    try:
        from ..models import VendedorCategoria
    except Exception:
        raise HttpError(500, "VendedorCategoria model não disponível")

    # tenta remover case-insensitive
    qs = VendedorCategoria.objects.filter(perfil_vendedor=perfil.pk).filter(categoria__iexact=categoria_val)
    deleted, _ = qs.delete()
    if deleted:
        return None

    # se não removeu, pode ser que stored value uses specific case, tentamos validar choices and remove exact
    # (já usamos iexact, então se chegou aqui não existe)
    raise HttpError(404, "Associação de categoria não encontrada")

# ----------------------
@router.get("/localizacao/vendedores", response=List[VendedorAllOut])
def listar_vendedores(
    request,
    ativos: Optional[bool] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    raio_km: float = 1.0,
):
    qs = PerfilVendedor.objects.all()

    if ativos is True:
        qs = qs.filter(esta_online=True)
    elif ativos is False:
        qs = qs.filter(esta_online=False)

    if hasattr(PerfilVendedor, "categorias"):
        qs = qs.prefetch_related("categorias")

    if latitude is not None and longitude is not None:
        if ativos is True:
            try:
                qs = PerfilVendedor.objects.buscar_online_proximos(latitude, longitude, raio_km=raio_km)
            except Exception:
                qs = qs.filter(esta_online=True)

        ponto = Point(float(longitude), float(latitude), srid=4326)
        qs_with_loc = qs.exclude(localizacao_atual__isnull=True)
        try:
            qs_distance = qs_with_loc.annotate(distance=Distance("localizacao_atual", ponto)).order_by("distance")
        except Exception:
            qs_distance = qs_with_loc.order_by("-esta_online", "id")

        perfiles_with_loc = list(qs_distance)
        perfiles_without_loc = list(qs.filter(localizacao_atual__isnull=True).order_by("-esta_online", "id"))
        ordered = perfiles_with_loc + perfiles_without_loc
    else:
        ordered = list(qs.order_by("-esta_online", "id"))

    resultados: List[VendedorAllOut] = []
    for v in ordered:
        distancia_km = 0.0
        if hasattr(v, "distance") and getattr(v, "distance") is not None:
            try:
                distancia_km = float(v.distance.km)
            except Exception:
                distancia_km = 0.0
        resultados.append(_perfil_vendedor_to_basic_out_safe(v, distancia_km=distancia_km))

    return resultados
