# toaki_app/api/produtos.py
from ninja import Router, Schema
from typing import List
from ninja.errors import HttpError
from django.shortcuts import get_object_or_404
from decimal import Decimal, InvalidOperation
from ..models import Produto, PerfilVendedor

router = Router(tags=["produtos"])


class ProdutoIn(Schema):
    perfil_vendedor_id: str
    nome: str
    descricao: str | None = None
    preco: float


class ProdutoOut(Schema):
    id: str
    nome: str
    descricao: str | None
    preco: float
    perfil_vendedor_id: str

class ProdutoPutIn(Schema):
    perfil_vendedor_id: str
    nome: str
    descricao: str | None = None
    preco: float


@router.get("/", response=List[ProdutoOut])
def listar_produtos(request):
    produtos = Produto.objects.all()
    return [
        ProdutoOut(
            id=str(p.id),
            nome=p.nome,
            descricao=p.descricao,
            preco=float(p.preco),
            perfil_vendedor_id=str(p.perfil_vendedor_id),
        )
        for p in produtos
    ]


@router.post("/", response=ProdutoOut)
def criar_produto(request, payload: ProdutoIn):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")

    # Se quiser, pode validar se o request.user é realmente o dono (PerfilVendedor)
    produto = Produto.objects.create(
        perfil_vendedor_id=payload.perfil_vendedor_id,
        nome=payload.nome,
        descricao=payload.descricao or "",
        preco=payload.preco,
    )

    return ProdutoOut(
        id=str(produto.id),
        nome=produto.nome,
        descricao=produto.descricao,
        preco=float(produto.preco),
        perfil_vendedor_id=str(produto.perfil_vendedor_id),
    )


@router.delete("/{product_id}", response=ProdutoOut)
def deletar_produto(request, product_id: str):
    
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")

    produto = get_object_or_404(Produto, pk=product_id)

    # Permissão: dono do perfil_vendedor do produto OU admin
    user = request.user
    perfil_user = getattr(user, "perfil_vendedor", None)

    is_owner = False
    if perfil_user is not None:
        try:
            # compara PKs (UUID) como strings
            is_owner = str(perfil_user.pk) == str(produto.perfil_vendedor_id)
        except Exception:
            is_owner = False

    is_admin = getattr(user, "is_staff", False)

    if not (is_owner or is_admin):
        raise HttpError(403, "Somente o dono do produto (ou admin) pode deletar este produto")

    # captura dados antes de deletar
    deleted_data = ProdutoOut(
        id=str(produto.id),
        nome=produto.nome,
        descricao=produto.descricao,
        preco=float(produto.preco),
        perfil_vendedor_id=str(produto.perfil_vendedor_id),
    )

    produto.delete()

    # retorna os dados do produto apagado
    return deleted_data


@router.put("/{product_id}", response=ProdutoOut)
def atualizar_produto(request, product_id: str, payload: ProdutoPutIn):
    """
    Substituição completa do produto (PUT).
    - Admins podem alterar qualquer campo, inclusive perfil_vendedor_id.
    - Donos (user.perfil_vendedor) podem alterar campos, MAS NÃO podem alterar perfil_vendedor_id.
    """
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")

    produto = get_object_or_404(Produto, pk=product_id)

    # checar permissão: admin ou dono
    user = request.user
    is_admin = getattr(user, "is_staff", False)
    perfil_v = getattr(user, "perfil_vendedor", None)
    is_owner = perfil_v is not None and str(getattr(perfil_v, "pk")) == str(getattr(produto, "perfil_vendedor_id", getattr(produto, "perfil_vendedor", None).pk if getattr(produto, "perfil_vendedor", None) else ""))

    if not (is_admin or is_owner):
        raise HttpError(403, "Somente admin ou dono pode alterar este produto")

    # valida preco
    try:
        preco_dec = Decimal(str(payload.preco))
    except (InvalidOperation, TypeError):
        raise HttpError(400, "preco inválido")
    if preco_dec < 0:
        raise HttpError(400, "preco deve ser >= 0")

    # Se o usuário NÃO for admin, ele não pode alterar perfil_vendedor_id
    if not is_admin and str(payload.perfil_vendedor_id) != str(getattr(produto, "perfil_vendedor_id", "")):
        raise HttpError(403, "Somente administradores podem alterar o perfil_vendedor")

    # validar existência do PerfilVendedor
    if not PerfilVendedor.objects.filter(pk=payload.perfil_vendedor_id).exists():
        raise HttpError(404, "Perfil vendedor não encontrado")

    # Atribui todos os campos (substituição completa)
    produto.perfil_vendedor_id = payload.perfil_vendedor_id
    produto.nome = payload.nome
    produto.descricao = payload.descricao or ""
    produto.preco = preco_dec  # guardar Decimal

    produto.save()

    return ProdutoOut(
        id=str(produto.id),
        nome=produto.nome,
        descricao=produto.descricao,
        preco=float(produto.preco),
        perfil_vendedor_id=str(produto.perfil_vendedor_id),
    )