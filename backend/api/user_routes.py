from fastapi import APIRouter, Depends

from services.auth_dependency import get_current_user
from repositories.user_stats_repository import get_user_stats
from repositories.task_repository import count_user_tasks

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/stats")
def get_user_stats_route(user = Depends(get_current_user)):

    user_id = user["id"]

    stats = get_user_stats(user_id)

    if not stats:
        return {
            "level": 0,
            "total_xp": 0,
            "current_streak": 0,
            "tower_blocks": 0,
            "total_sessions": 0,
            "tasks_done": 0
        }

    tasks_done = count_user_tasks(user_id)

    return {
        "level": stats["level"],
        "total_xp": stats["total_xp"],
        "current_streak": stats["current_streak"],
        "tower_blocks": stats["tower_blocks"],
        "total_sessions": stats["total_sessions"],
        "tasks_done": tasks_done
    }