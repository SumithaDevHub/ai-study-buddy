from fastapi import APIRouter
from pydantic import BaseModel
from services.mentor_service import mentor_decision

router = APIRouter(prefix="/mentor", tags=["Mentor"])


class MentorRequest(BaseModel):

    session_id: str
    face_present: bool
    eyes_closed_duration: float
    head_down_duration: float
    idle_time: float


@router.post("/analyze")
def analyze_signals(data: MentorRequest):

    signals = {
        "face_present": data.face_present,
        "eyes_closed_duration": data.eyes_closed_duration,
        "head_down_duration": data.head_down_duration,
        "idle_time": data.idle_time
    }

    return mentor_decision(data.session_id, signals)