from memory.supabase_client import supabase


def create_tasks(session_id: str, tasks: list[str]):
    data = []

    for task in tasks:
        data.append({
            "session_id": session_id,
            "title": task
        })

    response = supabase.table("tasks").insert(data).execute()

    return response.data


def get_tasks_by_session(session_id: str):
    response = (
        supabase
        .table("tasks")
        .select("*")
        .eq("session_id", session_id)
        .execute()
    )

    return response.data

def mark_task_completed(task_id: str):

    response = (
        supabase
        .table("tasks")
        .update({"completed": True})
        .eq("id", task_id)
        .execute()
    )

    return response.data

def count_completed_tasks(session_id):

    res = supabase.table("tasks") \
        .select("*") \
        .eq("session_id", session_id) \
        .eq("completed", True) \
        .execute()

    return len(res.data)

def count_user_tasks(user_id):

    res = (
        supabase
        .table("tasks")
        .select("id", count="exact")
        .eq("completed", True)
        .execute()
    )

    return res.count or 0