from fastapi import APIRouter, HTTPException
from schemas.auth_schema import UserSignup, UserLogin, TokenResponse
from services.auth_service import signup, login
from services.auth_dependency import get_current_user
from fastapi import Depends

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=TokenResponse)
def signup_route(data: UserSignup):
    try:
        token = signup(data.name, data.email, data.password)
        return {"access_token": token}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login", response_model=TokenResponse)
def login_route(data: UserLogin):
    try:
        token = login(data.email, data.password)
        return {"access_token": token}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    
@router.get("/me")
def get_current_user_data(user=Depends(get_current_user)):
    return user