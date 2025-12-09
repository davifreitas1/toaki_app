import os
from pathlib import Path
import environ  # Biblioteca django-environ

# 1. Configuração do Environ (Para ler variáveis do Docker)
env = environ.Env(
    # Define valores padrão caso não estejam no ambiente (fallback)
    DEBUG=(bool, False)
)

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# 2. Segurança e Debug
# Lê a SECRET_KEY do docker-compose.yml
SECRET_KEY = env('SECRET_KEY', default='django-insecure-change-me-now')

# Lê o DEBUG do docker-compose.yml (True em dev)
DEBUG = env('DEBUG', default=False)

# Permite acesso de qualquer lugar (necessário para Docker/React Native/Leaflet)
ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["*"])

# 3. Aplicações Instaladas
INSTALLED_APPS = [
    'daphne',  # DEVE ser o primeiro para WebSockets
    "corsheaders",
    # Apps padrão do Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # GEODJANGO
    'django.contrib.gis',

    # API REST
    'rest_framework',
    'rest_framework_gis',

    # WEBSOCKETS
    'channels',
    'ninja',

    # SEUS APPS
    'toaki_app',
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
    "https://toaki-app.vercel.app",
    
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://toaki-app.vercel.app/",
    "https://toaki-app-mk4r.onrender.com",
]

CORS_ALLOW_CREDENTIALS = True

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Adicione pastas de templates globais aqui se precisar
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# 4. Configuração WSGI e ASGI
WSGI_APPLICATION = 'core.wsgi.application'
ASGI_APPLICATION = 'core.asgi.application'

# 5. Banco de Dados (PostGIS)
DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "NAME": env("DB_NAME", default="toaki_db"),
        "USER": env("DB_USER", default="toaki_user"),
        "PASSWORD": env("DB_PASSWORD", default="toaki_pass"),
        "HOST": env("DB_HOST", default="localhost"),
        "PORT": env("DB_PORT", default="5432"),
    }
}

# 6. Channels (Redis)
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            "hosts": [env("REDIS_URL", default="redis://localhost:6379/0")],
        },
    },
}

# 7. Validação de senha
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# 8. Internacionalização
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

# 9. Arquivos Estáticos
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# 10. Arquivos de mídia (uploads de usuários)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'toaki_app.Usuario'

GOOGLE_MAPS_API_KEY = env('GOOGLE_MAPS_API_KEY', default='')
