from memory.supabase_client import supabase
from datetime import datetime


# ---------------- CREATE SESSION ---------------- #

def create_session(session):

    data = {
        "goal": session["goal"],
        "duration": session["duration"],
        "room_type": session["room_type"],
        "status": session["status"],
        "user_id": session["user_id"],
        "start_time": datetime.utcnow().isoformat()
    }

    response = supabase.table("sessions").insert(data).execute()

    return response.data[0]


# ---------------- GET SESSION ---------------- #

def get_session(session_id):

    res = supabase.table("sessions") \
        .select("*") \
        .eq("id", session_id) \
        .single() \
        .execute()

    return res.data


# ---------------- END SESSION UPDATE ---------------- #

def end_session_update(session_id, duration, tasks_completed, avg_focus_score, xp, quiz_accuracy):

    update_data = {
        "end_time": datetime.utcnow().isoformat(),
        "duration_minutes": duration,
        "tasks_completed": tasks_completed,
        "avg_focus_score": avg_focus_score,
        "xp_earned": xp,
        "quiz_accuracy": quiz_accuracy,
        "status": "completed"
    }
    
    supabase.table("sessions") \
        .update(update_data) \
        .eq("id", session_id) \
        .execute()
    
# ---------------- GET USER SESSIONS ---------------- #
def get_user_sessions(user_id: str):

    response = (
        supabase
        .table("sessions")
        .select("""
            id,
            goal,
            start_time,
            duration_minutes,
            tasks_completed,
            avg_focus_score,
            xp_earned,
            quiz_accuracy
        """)
        .eq("user_id", user_id)
        .order("start_time", desc=True)
        .execute()
    )

    return response.data

    response = (
        supabase
        .table("sessions")
        .select("*")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .execute()
    )

    return response.data