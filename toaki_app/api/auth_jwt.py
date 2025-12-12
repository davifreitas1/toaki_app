# toaki_app/api/auth_jwt.py
from ninja.security import HttpBearer
from django.contrib.auth import get_user_model
from typing import Optional
from toaki_app.jwt_utils import decode_token

User = get_user_model()


class JWTAuth(HttpBearer):
    def authenticate(self, request, token: str) -> Optional[User]:
        payload = decode_token(token)
        if not payload:
            return None

        user_id = payload.get("sub")
        if not user_id:
            return None

        try:
            return User.objects.get(pk=int(user_id))
        except Exception:
            return None
