from ninja.security import HttpBearer
from django.contrib.auth import get_user_model
from toaki_app.jwt_utils import decode_token

User = get_user_model()

class JWTAuth(HttpBearer):
    def authenticate(self, request, token):
        try:
            payload = decode_token(token)
            user_id = payload.get("sub")
            if not user_id:
                return None
            return User.objects.get(id=int(user_id))
        except Exception:
            return None
