from memory.supabase_client import supabase


def create_session_report(data):

    response = supabase.table("session_reports") \
        .insert(data) \
        .execute()

    return response.data


def get_session_report(session_id):

    res = supabase.table("session_reports") \
        .select("*") \
        .eq("session_id", session_id) \
        .execute()
    
    if not res.data:
        return None

    return res.data[0]

