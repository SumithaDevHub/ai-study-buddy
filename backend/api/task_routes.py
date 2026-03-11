from fastapi import APIRouter
from services.task_service import get_tasks_for_session

router = APIRouter(prefix="/tasks", tags=["Tasks"])


@router.get("/{session_id}")
def get_tasks(session_id: str):
    return get_tasks_for_session(session_id)