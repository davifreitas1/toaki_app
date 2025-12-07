# toaki_app/api/__init__.py
from .base import api

from .auth import router as auth_router
from .localizacao import router as localizacao_router
from .produtos import router as produtos_router
from .pedidos import router as pedidos_router
from .perfis import router as perfis_router

api.add_router("", auth_router)
api.add_router("/localizacao", localizacao_router)
api.add_router("/produtos", produtos_router)
api.add_router("/pedidos", pedidos_router)
api.add_router("/perfis", perfis_router)
__all__ = ["api"]
