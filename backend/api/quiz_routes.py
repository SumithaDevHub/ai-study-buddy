from fastapi import APIRouter
from pydantic import BaseModel
from services.quiz_service import generate_quiz_service

router = APIRouter(prefix="/quiz", tags=["Quiz"])


class QuizRequest(BaseModel):
    task_title: str
    duration: int
    difficulty: str


@router.post("/generate")
def generate_quiz(data: QuizRequest):

    return generate_quiz_service(data)