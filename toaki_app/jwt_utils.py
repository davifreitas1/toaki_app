import time
import jwt
from django.conf import settings

def create_access_token(user_id: int) -> str:
    now = int(time.time())
    payload = {
        "sub": str(user_id),
        "iat": now,
        "exp": now + int(getattr(settings, "JWT_ACCESS_TTL_SECONDS", 60 * 60 * 24)),
    }
    secret = getattr(settings, "JWT_SECRET_KEY", settings.SECRET_KEY)
    alg = getattr(settings, "JWT_ALGORITHM", "HS256")
    return jwt.encode(payload, secret, algorithm=alg)

def decode_token(token: str) -> dict:
    secret = getattr(settings, "JWT_SECRET_KEY", settings.SECRET_KEY)
    alg = getattr(settings, "JWT_ALGORITHM", "HS256")
    return jwt.decode(token, secret, algorithms=[alg])
