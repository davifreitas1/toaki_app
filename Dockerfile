FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instalação das dependências do sistema (GeoDjango)
RUN apt-get update && apt-get install -y \
    binutils \
    libproj-dev \
    gdal-bin \
    libgdal-dev \
    python3-gdal \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . /app/

# >>> ADICIONE ESTA LINHA AQUI <<<
RUN python manage.py collectstatic --noinput

# >>> MIGRAÇÕES AQUI TAMBÉM <<<
RUN python manage.py migrate

EXPOSE 8000

# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "core.asgi:application"]
# Se o asgi estiver em outro módulo, troque acima para, por exemplo:
# CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "toaki_app.asgi:application"]