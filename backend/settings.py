from dotenv import load_dotenv
import os

load_dotenv()

APP_NAME=os.getenv("APP_NAME")
DATABASE_URL = os.getenv("DATABASE_URL")

NEXTAUTH_SECRET=os.getenv("NEXTAUTH_SECRET")
ALGORITHM=os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES=os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)

GOOGLE_CLIENT_ID=os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET=os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI=os.getenv("GOOGLE_REDIRECT_URI")

DEFAULT_ADMIN_EMAIL=os.getenv("DEFAULT_ADMIN_EMAIL")
DEFAULT_ADMIN_PASSWORD=os.getenv("DEFAULT_ADMIN_PASSWORD")

_default_origins=[
    "http://localhost:3000",
    # "http://[IP_ADDRESS]",
    # "http://[IP_ADDRESS]",
]
_raw = os.getenv("ALLOWED_ORIGINS", _default_origins).strip()
ALLOWED_ORIGINS = [
    o.strip() for o in _raw.split(",") if o.strip()
] or _default_origins.split(",")
