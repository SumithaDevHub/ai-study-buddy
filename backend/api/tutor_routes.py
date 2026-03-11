from fastapi import APIRouter
from pydantic import BaseModel
from services.tutor_service import tutor_chat

router = APIRouter(prefix="/tutor", tags=["Tutor"])


class TutorRequest(BaseModel):

    session_id: str
    message: str


@router.post("/chat")
def tutor_message(data: TutorRequest):

    response = tutor_chat(
        data.session_id,
        data.message
    )

    return {"response": response}