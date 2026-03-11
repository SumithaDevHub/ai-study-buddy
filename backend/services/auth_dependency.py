from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt

from repositories.user_repository import get_user_by_id

SECRET_KEY = "studybuddysecret"
ALGORITHM = "HS256"

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = get_user_by_id(user_id)

        if not user:
            raise HTTPException(status_code=401, detail="User not found")

        return user

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")