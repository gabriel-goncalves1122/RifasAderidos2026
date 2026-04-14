# Usamos um "mini-Ubuntu" já com Python mais recente (3.12)
FROM python:3.12-slim

# O resto continua igual...
RUN apt-get update && apt-get install -y tesseract-ocr poppler-utils
# ...
# Criamos a nossa pasta de trabalho
WORKDIR /app

# Copiamos a lista de dependências e instalamos
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos o resto do código da IA
COPY . .

# Limitamos a 1 worker (para não estourar a RAM), usamos threads para concorrência
# e damos 120 segundos de timeout (o Tesseract pode demorar no plano free)
CMD ["sh", "-c", "gunicorn --workers 1 --threads 2 --timeout 120 --access-logfile - --bind 0.0.0.0:${PORT:-10000} api:app"]