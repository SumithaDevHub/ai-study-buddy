from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta

from repositories.user_repository import get_user_by_email, create_user

SECRET_KEY = "studybuddysecret"
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str):
    password = password[:72]
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str):
    password = password[:72]
    return pwd_context.verify(password, password_hash)


def create_token(user_id: str):
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def signup(name:str, email: str, password: str):

    existing = get_user_by_email(email)

    if existing:
        raise Exception("User already exists")

    password_hash = hash_password(password)

    user = create_user(name, email, password_hash)

    token = create_token(user["id"])

    return token


def login(email: str, password: str):

    user = get_user_by_email(email)

    if not user:
        raise Exception("Invalid credentials")

    if not verify_password(password, user["password_hash"]):
        raise Exception("Invalid credentials")

    token = create_token(user["id"])

    return token