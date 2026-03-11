from services.auth_dependency import get_current_user
from fastapi import APIRouter, Depends
from schemas.session_schema import StartSessionRequest
from services.session_service import start_session_service

from repositories.session_repository import get_session
from repositories.session_report_repository import get_session_report
from repositories.quiz_repository import get_quiz_attempts

router = APIRouter(prefix="/session", tags=["Session"])


@router.post("/start")
def start_session(
    data: StartSessionRequest,
    user=Depends(get_current_user)
):
    user_id = user["id"]
    return start_session_service(data, user_id)


@router.get("/sessions/{session_id}")
def get_session_detail(session_id: str):

    session = get_session(session_id)
    report = get_session_report(session_id)
    quizzes = get_quiz_attempts(session_id)

    return {
        **session,
        "report": report,
        "quiz_attempts": quizzes
    }