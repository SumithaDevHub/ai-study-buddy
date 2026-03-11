from memory.supabase_client import supabase

def get_user_by_id(user_id):

    res = supabase.table("users") \
        .select("*") \
        .eq("id", user_id) \
        .execute()

    if not res.data:
        return None

    return res.data[0]

def get_user_by_email(email: str):
    response = supabase.table("users").select("*").eq("email", email).execute()
    return response.data[0] if response.data else None


def create_user(name,email: str, password_hash: str):
    response = supabase.table("users").insert({
        "name" : name,
        "email": email,
        "password_hash": password_hash
    }).execute()

    return response.data[0]