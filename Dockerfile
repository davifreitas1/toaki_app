FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Dependências do sistema (GeoDjango)
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

# Garantir permissão ao entrypoint
RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

# EXECUTA o entrypoint (migra -> superuser -> daphne)
ENTRYPOINT ["./entrypoint.sh"]