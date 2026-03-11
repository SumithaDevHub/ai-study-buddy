from fastapi import APIRouter
from pydantic import BaseModel

from services.quiz_submit_service import submit_quiz_service

router = APIRouter(prefix="/quiz", tags=["Quiz"])


class QuizSubmitRequest(BaseModel):

    task_id: str
    session_id: str

    total_questions: int
    correct_answers: int

    attempt_type: str  # quiz | skip

    question_results: list


@router.post("/submit")
def submit_quiz(data: QuizSubmitRequest):

    return submit_quiz_service(data)