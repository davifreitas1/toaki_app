
from decimal import Decimal
from typing import List
from django.shortcuts import get_object_or_404

from django.db import transaction
from ninja import Router, Schema
from ninja.errors import HttpError

from ..models import Pedido, PerfilCliente, PerfilVendedor, Produto, PedidoProduto


router = Router(tags=["pedidos"])


class ItemIn(Schema):
    produto_id: str
    quantidade: int


class PedidoIn(Schema):
    perfil_vendedor_id: str
    itens: List[ItemIn] | None = None


class PedidoOut(Schema):
    id: str
    perfil_cliente_id: str
    perfil_vendedor_id: str
    valor_total: float
    status: str
    pedido_visto: bool

class PedidoUpdateIn(Schema):
    status: str | None = None
    pedido_visto: bool | None = None

    # ainda em pedidos.py
class ChamarVendedorIn(Schema):
    perfil_vendedor_id: str

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

    itens = payload.itens or []

    # 👉 CASO 1: apenas “chamar vendedor” (sem itens)
    if not itens:
        pedido = Pedido.objects.create(
            perfil_cliente=perfil_cliente,
            perfil_vendedor=perfil_vendedor,
            valor_total=Decimal("0.00"),
        )

        return PedidoOut(
            id=str(pedido.id),
            perfil_cliente_id=str(pedido.perfil_cliente_id),
            perfil_vendedor_id=str(pedido.perfil_vendedor_id),
            valor_total=float(pedido.valor_total),
            status=pedido.status,
            pedido_visto=pedido.pedido_visto,
        )

    # 👉 CASO 2: fluxo atual, com itens (mantém o que já existe hoje)
    # Buscar todos os produtos de uma vez
    produtos_ids = [item.produto_id for item in itens]

    produtos = Produto.objects.filter(id__in=produtos_ids)
    produtos_map = {str(p.id): p for p in produtos}

    for item in itens:
        produto = produtos_map.get(item.produto_id)
        if produto is None:
            raise HttpError(400, f"Produto {item.produto_id} não encontrado")

        if item.quantidade <= 0:
            raise HttpError(400, "Quantidade deve ser maior que zero")

    with transaction.atomic():
        valor_total = Decimal("0.00")
        itens_para_criar: list[PedidoProduto] = []

        pedido = Pedido.objects.create(
            perfil_cliente=perfil_cliente,
            perfil_vendedor=perfil_vendedor,
            valor_total=Decimal("0.00"),
        )

        for item in itens:
            produto = produtos_map[item.produto_id]
            preco_unitario = Decimal(str(produto.preco))
            subtotal = preco_unitario * item.quantidade
            valor_total += subtotal

            itens_para_criar.append(
                PedidoProduto(
                    pedido=pedido,
                    produto=produto,
                    quantidade=item.quantidade,
                    valor_unitario=preco_unitario,
                )
            )

        PedidoProduto.objects.bulk_create(itens_para_criar)
        pedido.valor_total = valor_total
        pedido.save(update_fields=["valor_total"])

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

    pedidos = (
        Pedido.objects
        .filter(perfil_cliente=perfil_cliente)
        .order_by("-criado_em")
    )

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


@router.delete("/{pedido_id}", response=PedidoOut)
def deletar_pedido(request, pedido_id: str):
    # Se o router /pedidos estiver com auth=SessionAuth(),
    # aqui já temos request.user autenticado.

    pedido = get_object_or_404(Pedido, pk=pedido_id)
    user = request.user

    # Tenta pegar os perfis (nem todo user vai ter os dois)
    perfil_cliente = getattr(user, "perfil_cliente", None)
    perfil_vendedor = getattr(user, "perfil_vendedor", None)

    # Cliente que fez o pedido
    is_cliente_dono = (
        perfil_cliente is not None
        and str(perfil_cliente.pk) == str(pedido.perfil_cliente_id)
    )

    # Vendedor dono do pedido
    is_vendedor_dono = (
        perfil_vendedor is not None
        and str(perfil_vendedor.pk) == str(pedido.perfil_vendedor_id)
    )

    # Admin (opcional manter)
    is_admin = getattr(user, "is_staff", False)

    if not (is_cliente_dono or is_vendedor_dono or is_admin):
        raise HttpError(
            403,
            "Somente o cliente, o vendedor responsável ou um admin podem deletar este pedido",
        )

    # Guarda os dados antes de deletar, para poder retornar
    resposta = PedidoOut(
        id=str(pedido.id),
        perfil_cliente_id=str(pedido.perfil_cliente_id),
        perfil_vendedor_id=str(pedido.perfil_vendedor_id),
        valor_total=float(pedido.valor_total),
        status=pedido.status,
        pedido_visto=pedido.pedido_visto,
    )

    pedido.delete()

    return resposta


@router.put("/{pedido_id}", response=PedidoOut)
def atualizar_pedido(request, pedido_id: str, payload: PedidoUpdateIn):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")

    pedido = get_object_or_404(Pedido, pk=pedido_id)

    user = request.user
    perfil_vendedor = getattr(user, "perfil_vendedor", None)

    
    is_owner = False
    if perfil_vendedor is not None:
        try:
            is_owner = str(perfil_vendedor.pk) == str(pedido.perfil_vendedor_id)
        except Exception:
            is_owner = False

    is_admin = getattr(user, "is_staff", False)

    if not (is_owner or is_admin):
        raise HttpError(403, "Somente o dono do pedido (ou admin) pode atualizar este pedido")

    
    if payload.status is None and payload.pedido_visto is None:
        raise HttpError(400, "Nada para atualizar")

        # Atualizar status (se enviado)
    if payload.status is not None:
        # valida se está dentro das choices
        valid_status = {choice[0] for choice in Pedido.Status.choices}
        if payload.status not in valid_status:
            raise HttpError(400, f"Status inválido: {payload.status}")
        pedido.status = payload.status

    # Atualizar flag de visualização (se enviado)
    if payload.pedido_visto is not None:
        pedido.pedido_visto = payload.pedido_visto

    pedido.save()

    return PedidoOut(
        id=str(pedido.id),
        perfil_cliente_id=str(pedido.perfil_cliente_id),
        perfil_vendedor_id=str(pedido.perfil_vendedor_id),
        valor_total=float(pedido.valor_total),
        status=pedido.status,
        pedido_visto=pedido.pedido_visto,
    )





    
