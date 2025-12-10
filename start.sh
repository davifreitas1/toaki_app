#!/usr/bin/env bash
set -o errexit  # se der erro no script, parar imediatamente

echo "==> Rodando migrações..."
python manage.py migrate --noinput

echo "==> Criando superusuário (se necessário)..."
python manage.py shell << 'EOF'
from django.contrib.auth import get_user_model
User = get_user_model()
import os

username = os.getenv("DJANGO_SUPERUSER_USERNAME")
email = os.getenv("DJANGO_SUPERUSER_EMAIL")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD")

if username and password:
    if not User.objects.filter(username=username).exists():
        User.objects.create_superuser(username=username, email=email, password=password)
        print("Superusuário criado.")
    else:
        print("Superusuário já existe.")
else:
    print("Variáveis de superusuário não definidas, ignorando criação.")
EOF

echo "==> Iniciando servidor..."
python manage.py runserver 0.0.0.0:${PORT}
