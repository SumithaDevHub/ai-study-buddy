from fastapi import APIRouter
from pydantic import BaseModel
from agents.planner import planner

router = APIRouter(prefix="/planner", tags=["Planner"])


class PlannerRequest(BaseModel):
    goal: str
    duration: int
    difficulty: str


@router.post("/generate")
def generate_plan(data: PlannerRequest):

    result = planner(
        data.goal,
        data.duration,
        data.difficulty
    )

    return result