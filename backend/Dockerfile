FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/code

WORKDIR /code

RUN apt-get update && apt-get install -y --no-install-recommends \
    default-mysql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /code/scripts/start.sh && \
    useradd -m appuser && \
    chown -R appuser:appuser /code

USER appuser

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Entrypoint to handle migrations and startup
ENTRYPOINT ["/code/scripts/start.sh"]
