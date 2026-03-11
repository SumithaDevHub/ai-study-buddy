from fastapi import APIRouter
from schemas.session_schema import EndSessionRequest
from services.session_service import end_session

router = APIRouter(prefix="/session", tags=["Session"])


@router.post("/end")
def end_study_session(req: EndSessionRequest):

    result = end_session(req.session_id, req.avg_focus_score)

    return {
        "message": "Session ended",
        **result
    }