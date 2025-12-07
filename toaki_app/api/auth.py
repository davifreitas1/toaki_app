
from ninja import Router, Schema
from django.contrib.auth import authenticate, login as dj_login
from django.contrib.auth import get_user_model
from ninja.errors import HttpError
from django.db import IntegrityError
from ninja import Router

Usuario = get_user_model()
router = Router()


class LoginIn(Schema):
    username: str
    password: str


class RegisterIn(Schema):
    username: str
    password: str
    email: str | None = None
    tipo_usuario: str | None = None


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


@router.post("/register", response=UserOut)
def register(request, payload: RegisterIn):
    tipo_usuario = payload.tipo_usuario or Usuario.TipoUsuario.CLIENTE
    if tipo_usuario not in Usuario.TipoUsuario.values:
        raise HttpError(400, "Tipo de usuário inválido")
    try:
        user = Usuario.objects.create_user(
            username=payload.username,
            email=payload.email,
            password=payload.password,
            tipo_usuario=tipo_usuario,
        )
    except IntegrityError:
        raise HttpError(400, "Usuário já existe")
    return user


@router.get("/me", response=UserOut)
def me(request):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    return request.user
