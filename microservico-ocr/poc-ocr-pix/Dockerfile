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

# Comando para ligar o garçom (Gunicorn) na porta que o Render escolher
CMD ["sh", "-c", "gunicorn --access-logfile - --bind 0.0.0.0:${PORT:-10000} api:app"]