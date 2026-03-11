from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class FocusSignal(BaseModel):
    session_id: UUID
    face_present: bool
    eyes_closed: bool
    blink_rate: int
    head_down: bool
    idle_seconds: int


class FocusResponse(BaseModel):
    alert: Optional[str] = None