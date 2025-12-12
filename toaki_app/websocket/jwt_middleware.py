from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async

from toaki_app.jwt_utils import decode_token


User = get_user_model()


@database_sync_to_async
def get_user_by_id(user_id: int):
    try:
        return User.objects.get(id=user_id)
    except User.DoesNotExist:
        return AnonymousUser()


class JwtAuthMiddleware:
    """
    Autentica o WebSocket via token JWT no querystring:

    wss://.../ws/mapa/?token=SEU_TOKEN
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        scope["user"] = AnonymousUser()

        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token = (params.get("token") or [None])[0]

        if token:
            try:
                payload = decode_token(token)
                sub = payload.get("sub")
                if sub:
                    scope["user"] = await get_user_by_id(int(sub))
            except Exception:
                scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)
