
from ninja import Router, Schema
from django.contrib.auth import authenticate, login as dj_login
from django.contrib.auth import get_user_model
from ninja.errors import HttpError
from django.db import IntegrityError
from ninja import Router
from typing import List


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

class UserUpdateIn(Schema):
    username: str
    email: str
    tipo_usuario: str
    password: str | None = None



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

@router.put("/profile", response=UserOut)
def put_profile(request, payload: UserUpdateIn):
   
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")

    
    if not payload.username.strip():
        raise HttpError(400, "username inválido")
    if not payload.email.strip():
        raise HttpError(400, "email inválido")
    if not payload.tipo_usuario.strip():
        raise HttpError(400, "tipo_usuario inválido")

    user = request.user

    
    new_username = payload.username.strip()
    if Usuario.objects.filter(username=new_username).exclude(pk=user.pk).exists():
        raise HttpError(400, "Nome de usuário já em uso")
    user.username = new_username

    
    user.email = payload.email.strip()

    
    tipo = payload.tipo_usuario.strip()
    normalized = tipo.upper()
    if hasattr(Usuario, "TipoUsuario") and hasattr(Usuario.TipoUsuario, "values"):
        if normalized not in Usuario.TipoUsuario.values:
            raise HttpError(400, "Tipo de usuário inválido")
        user.tipo_usuario = normalized
    else:
        
        user.tipo_usuario = tipo

    
    if payload.password:
        user.set_password(payload.password)

    try:
        user.save()
    except IntegrityError:
        raise HttpError(400, "Erro de integridade ao salvar usuário")

    return user

@router.get("/profile", response=UserOut)
def read_profile(request):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")
    return request.user

@router.delete("/profile")
def delete_profile(request):
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")

    request.user.delete()
    return {"success": True}

@router.get("/users", response=List[UserOut])
def list_users(request):
   
    if not request.user.is_authenticated:
        raise HttpError(401, "Não autenticado")

    
    if not request.user.is_staff:
        raise HttpError(403, "Acesso negado: apenas administradores")

    users = Usuario.objects.all()
    
    return list(users)