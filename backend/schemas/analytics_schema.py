from pydantic import BaseModel
from typing import List


class AnalyticsSummary(BaseModel):
    total_study_minutes: int
    total_sessions: int
    avg_focus_score: float
    avg_quiz_accuracy: float
    total_xp: int


class WeeklyStudy(BaseModel):
    week: str
    study_minutes: int


class FocusTrend(BaseModel):
    date: str
    focus_score: float


class QuizTrend(BaseModel):
    date: str
    accuracy: float