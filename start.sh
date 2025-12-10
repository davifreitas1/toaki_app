#!/usr/bin/env bash
set -o errexit  # se der erro, para

echo "==> Rodando migrações..."
python manage.py migrate --noinput

echo "==> Criando/atualizando superusuário..."
python manage.py shell << 'EOF'
from django.contrib.auth import get_user_model
import os

User = get_user_model()

username = os.getenv("DJANGO_SUPERUSER_USERNAME", "root")
email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "Senha123")

if not username or not password:
    print("Variáveis de superusuário não definidas, ignorando criação.")
else:
    user, created = User.objects.get_or_create(
        username=username,
        defaults={"email": email},
    )
    user.email = email
    user.set_password(password)
    user.is_superuser = True
    user.is_staff = True
    user.save()

    if created:
        print("Superusuário criado.")
    else:
        print("Superusuário atualizado (senha redefinida).")
EOF

echo "==> Iniciando servidor..."
python manage.py runserver 0.0.0.0:${PORT}
