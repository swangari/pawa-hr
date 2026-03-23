#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Wait for the database to be ready
echo "Waiting for database..."
python << END
import sys
import pymysql
import os
import time

db_url = os.getenv("DATABASE_URL", "")
host = os.getenv("MYSQL_HOST", "db")
user = "root"
password = "root" # Defaulting to 'root' as set in docker-compose

while True:
    try:
        conn = pymysql.connect(host=host, user=user, password=password)
        conn.close()
        break
    except Exception as e:
        print(f"Waiting for DB... {e}")
        time.sleep(1)
END
echo "Database is up!"

# Run migrations
echo "Running migrations..."
alembic upgrade head

# Start the application
echo "Starting application..."
exec uvicorn main:app --host 0.0.0.0 --port 8080 --proxy-headers --forwarded-allow-ips "*"
