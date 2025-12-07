
from decimal import Decimal
from typing import List

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
    itens: List[ItemIn]


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

    if not payload.itens:
        raise HttpError(400, "O pedido precisa ter pelo menos um item")

    # Buscar todos os produtos de uma vez
    produtos_ids = [item.produto_id for item in payload.itens]

    # Filtra pelo id em string/UUID e monta um mapa com chave em str(id)
    produtos = Produto.objects.filter(id__in=produtos_ids)
    produtos_map = {str(p.id): p for p in produtos}  # dict: {"uuid-str": Produto}

    # Validação de produtos inexistentes e quantidades
    for item in payload.itens:
        produto = produtos_map.get(item.produto_id)
        if produto is None:
            raise HttpError(400, f"Produto {item.produto_id} não encontrado")

        if item.quantidade <= 0:
            raise HttpError(400, "Quantidade deve ser maior que zero")

    with transaction.atomic():
        valor_total = Decimal("0.00")
        itens_para_criar: list[PedidoProduto] = []

        # Primeiro criamos o pedido com valor_total 0, depois ajustamos
        pedido = Pedido.objects.create(
            perfil_cliente=perfil_cliente,
            perfil_vendedor=perfil_vendedor,
            valor_total=Decimal("0.00"),
        )

        for item in payload.itens:
            produto = produtos_map[item.produto_id]

            # Ajuste aqui conforme o campo de preço do seu Produto
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

        # Atualiza o valor_total do pedido com o somatório real
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
