# toaki_app/api/produtos.py
from ninja import Router, Schema
from typing import List
from ninja.errors import HttpError

from ..models import Produto

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
