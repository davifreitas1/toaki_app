#!/bin/bash
set -e

echo " Aplicando migrações..."
python manage.py migrate --noinput

echo " Criando superusuário (se não existir)..."
python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()
username = "root"
email = "admin@example.com"
password = "toakiadmin123"
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print("Superusuário criado.")
else:
    print("Superusuário já existe.")
EOF

echo " Iniciando servidor Daphne..."
exec daphne -b 0.0.0.0 -p 8000 core.asgi:application
