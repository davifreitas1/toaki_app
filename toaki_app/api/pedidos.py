# toaki_app/api/pedidos.py
from ninja import Router, Schema
from typing import List
from ninja.errors import HttpError

from ..models import Pedido, PerfilCliente, PerfilVendedor

router = Router(tags=["pedidos"])


class PedidoIn(Schema):
    perfil_vendedor_id: str
    valor_total: float


class PedidoOut(Schema):
    id: str
    perfil_cliente_id: str
    perfil_vendedor_id: str
    valor_total: float
    status: str
    pedido_visto: bool


@router.post("/", response=PedidoOut)
def criar_pedido(request, payload: PedidoIn):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")

    # achar perfil_cliente a partir do usuário logado
    try:
        perfil_cliente = request.user.perfil_cliente
    except PerfilCliente.DoesNotExist:
        raise HttpError(400, "Usuário não possui perfil de cliente")

    # validar vendedor
    try:
        perfil_vendedor = PerfilVendedor.objects.get(id=payload.perfil_vendedor_id)
    except PerfilVendedor.DoesNotExist:
        raise HttpError(404, "Vendedor não encontrado")

    pedido = Pedido.objects.create(
        perfil_cliente=perfil_cliente,
        perfil_vendedor=perfil_vendedor,
        valor_total=payload.valor_total,
    )

    return PedidoOut(
        id=str(pedido.id),
        perfil_cliente_id=str(pedido.perfil_cliente_id),
        perfil_vendedor_id=str(pedido.perfil_vendedor_id),
        valor_total=float(pedido.valor_total),
        status=pedido.status,
        pedido_visto=pedido.pedido_visto,
    )


@router.get("/", response=List[PedidoOut])
def listar_pedidos_cliente(request):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")

    # listar pedidos do cliente logado
    try:
        perfil_cliente = request.user.perfil_cliente
    except PerfilCliente.DoesNotExist:
        raise HttpError(400, "Usuário não possui perfil de cliente")

    pedidos = Pedido.objects.filter(perfil_cliente=perfil_cliente)

    return [
        PedidoOut(
            id=str(p.id),
            perfil_cliente_id=str(p.perfil_cliente_id),
            perfil_vendedor_id=str(p.perfil_vendedor_id),
            valor_total=float(p.valor_total),
            status=p.status,
            pedido_visto=p.pedido_visto,
        )
        for p in pedidos
    ]
