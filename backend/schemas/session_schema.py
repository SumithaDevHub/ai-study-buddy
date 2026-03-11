from pydantic import BaseModel
from typing import List, Optional
from uuid import UUID

class StartSessionRequest(BaseModel):
    goal: str
    duration: int
    room_type: str
    tasks: Optional[List[str]] = []

class EndSessionRequest(BaseModel):
    session_id: UUID
    avg_focus_score: int
    