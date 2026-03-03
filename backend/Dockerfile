FROM python:3.11-slim

ENV PYTHONUNBUFFERED True
WORKDIR /code
COPY . .

RUN pip install --upgrade pip && pip install --no-cache-dir --default-timeout=1000 -r requirements.txt

ENV PYTHONPATH=/code

# Cloud Run listens on port 8080 by default. --proxy-headers so redirects use HTTPS behind Nginx/certbot.
CMD exec uvicorn main:app --host 0.0.0.0 --port 8080 --proxy-headers --forwarded-allow-ips "*"
