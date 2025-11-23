import os
from pathlib import Path
import environ # Biblioteca django-environ

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
DEBUG = env('DEBUG')

# Permite acesso de qualquer lugar (necessário para Docker/React Native/Leaflet)
ALLOWED_HOSTS = ['*']

# 3. Aplicações Instaladas
INSTALLED_APPS = [
    # 'daphne' DEVE ser o primeiro para assumir o controle do comando 'runserver'
    # e permitir WebSockets no desenvolvimento.
    'daphne',
    
    # Apps padrão do Django
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # --- GEODJANGO ---
    'django.contrib.gis',

    # --- API REST ---
    'rest_framework',
    'rest_framework_gis',

    # --- WEBSOCKETS ---
    'channels',

    # --- SEUS APPS ---
    'toaki_app',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [], # Adicione pastas de templates globais aqui se precisar
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
# Onde está o objeto 'application' do Channels (criaremos este arquivo depois)
ASGI_APPLICATION = 'core.asgi.application'

# 5. Banco de Dados (PostGIS)
# Lendo as variáveis passadas pelo docker-compose.yml
DATABASES = {
    'default': {
        # ENGINE CRUCIAL: Use o backend do PostGIS, não o do Postgres comum
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        
        'NAME': env('DB_NAME'),
        'USER': env('DB_USER'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST'), # Nome do serviço no docker-compose ('db')
        'PORT': env('DB_PORT'),
    }
}

# 6. Configuração do Channels (Redis)
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels_redis.core.RedisChannelLayer",
        "CONFIG": {
            # Lê a URL do Redis do docker-compose (redis://redis:6379/0)
            "hosts": [env('REDIS_URL')],
        },
    },
}

# 7. Validadores de Senha (Padrão)
AUTH_PASSWORD_VALIDATORS = [
    { 'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator', },
    { 'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator', },
]

# 8. Internacionalização
LANGUAGE_CODE = 'pt-br'
TIME_ZONE = 'America/Sao_Paulo'
USE_I18N = True
USE_TZ = True

# 9. Arquivos Estáticos
STATIC_URL = 'static/'
# Onde o Django coletará os estáticos em produção (dentro do container)
STATIC_ROOT = BASE_DIR / 'staticfiles' 

# Configuração do ID do campo padrão
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

AUTH_USER_MODEL = 'toaki_app.Usuario'