from urllib.parse import parse_qs
from django.contrib.auth import get_user_model
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from toaki_app.jwt_utils import decode_token

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token: str):
    try:
        payload = decode_token(token)
        return User.objects.get(id=payload["user_id"])
    except Exception:
        return None

class JwtAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = scope.get("query_string", b"").decode()
        params = parse_qs(query_string)
        token_list = params.get("token")

        user = None
        if token_list:
            token = token_list[0]
            user = await get_user_from_token(token)

        scope["user"] = user
        return await super().__call__(scope, receive, send)
