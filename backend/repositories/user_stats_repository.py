from memory.supabase_client import supabase


def get_user_stats(user_id):

    res = supabase.table("user_stats") \
        .select("*") \
        .eq("user_id", user_id) \
        .execute()

    data = res.data

    if not data:
        return None

    return data[0]

    res = supabase.table("user_stats") \
        .select("*") \
        .eq("user_id", user_id) \
        .single() \
        .execute()

    return res.data


def update_user_stats(user_id, data):

    res = supabase.table("user_stats") \
        .update(data) \
        .eq("user_id", user_id) \
        .execute()

    return res.data

def create_user_stats(user_id):

    supabase.table("user_stats").insert({
        "user_id": user_id,
        "total_xp": 0,
        "level": 0,
        "tower_blocks": 0,
        "current_streak": 0,
        "longest_streak": 0
    }).execute()