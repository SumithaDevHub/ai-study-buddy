from fastapi import APIRouter
from schemas.focus_schema import FocusSignal, FocusResponse
from services.focus_service import receive_signal

router = APIRouter(prefix="/focus", tags=["Focus Tracker"])


@router.post("/update", response_model=FocusResponse)
def update_focus(signal: FocusSignal):

    alert = receive_signal(signal)

    return FocusResponse(alert=alert)