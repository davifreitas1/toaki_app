
from ninja import Router, Schema
from django.contrib.auth import authenticate, login as dj_login
from django.contrib.auth import get_user_model
from ninja.errors import HttpError

Usuario = get_user_model()
router = Router()


class LoginIn(Schema):
    username: str
    password: str


class UserOut(Schema):
    id: int
    username: str
    email: str | None = None
    tipo_usuario: str


@router.post("/login", response=UserOut)
def login(request, payload: LoginIn):
    user = authenticate(
        request,
        username=payload.username,
        password=payload.password,
    )
    if not user:
        raise HttpError(401, "Credenciais inválidas")

    dj_login(request, user)  # cria sessão (cookie)
    return user


@router.get("/me", response=UserOut)
def me(request):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    return request.user
