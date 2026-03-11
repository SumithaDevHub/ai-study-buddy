from fastapi import APIRouter, Depends
from services.analytics_service import AnalyticsService
from services.auth_dependency import get_current_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

service = AnalyticsService()


@router.get("/summary")
def analytics_summary(user=Depends(get_current_user)):

    user_id = user["id"]

    return service.get_summary(user_id)

@router.get("/weekly-study")
def weekly(user=Depends(get_current_user)):
    return service.weekly_study(user["id"])


@router.get("/focus-trend")
def focus(user=Depends(get_current_user)):
    return service.focus_trend(user["id"])


@router.get("/weak-topics")
def weak():
    return service.weak_topics()