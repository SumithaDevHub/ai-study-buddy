from repositories.task_repository import get_tasks_by_session


def get_tasks_for_session(session_id: str):
    return get_tasks_by_session(session_id)