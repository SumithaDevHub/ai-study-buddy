from memory.supabase_client import supabase


# ---------------- CREATE QUIZ ATTEMPT ---------------- #

def create_quiz_attempt(data):
    """
    Stores a quiz attempt in Supabase.

    Expected fields inside `data`:
    - task_id
    - session_id
    - total_questions
    - correct_answers
    - score_percent
    - attempt_type
    - xp_awarded
    - question_results (jsonb)
    """

    response = supabase.table("quiz_attempts") \
        .insert(data) \
        .execute()

    return response.data


# ---------------- SUM SESSION XP ---------------- #

def sum_session_xp(session_id):
    """
    Returns total XP earned in a session.
    """

    res = supabase.table("quiz_attempts") \
        .select("xp_awarded") \
        .eq("session_id", session_id) \
        .execute()

    if not res.data:
        return 0

    xp = sum([row.get("xp_awarded", 0) or 0 for row in res.data])

    return xp


# ---------------- QUIZ ACCURACY ---------------- #

def get_session_quiz_accuracy(session_id):
    """
    Calculates overall quiz accuracy for a session.
    """

    res = supabase.table("quiz_attempts") \
        .select("total_questions, correct_answers") \
        .eq("session_id", session_id) \
        .execute()

    if not res.data:
        return 0

    total_questions = 0
    correct_answers = 0

    for row in res.data:
        total_questions += row.get("total_questions", 0) or 0
        correct_answers += row.get("correct_answers", 0) or 0

    if total_questions == 0:
        return 0

    accuracy = (correct_answers / total_questions) * 100

    return int(accuracy)


# ---------------- GET QUIZ DETAILS (FOR AI REPORT) ---------------- #

def get_session_quiz_results(session_id):
    """
    Returns question-level results for AI session analysis.
    """

    res = supabase.table("quiz_attempts") \
        .select("question_results") \
        .eq("session_id", session_id) \
        .execute()

    results = []

    if not res.data:
        return results

    for row in res.data:
        if row.get("question_results"):
            results.extend(row["question_results"])

    return results

# ---------------- GET QUIZ ATTEMPTS FOR SESSION ---------------- #

def get_quiz_attempts(session_id):
    """
    Returns all quiz attempts for a session.
    Used by session detail page.
    """

    res = supabase.table("quiz_attempts") \
        .select("*") \
        .eq("session_id", session_id) \
        .execute()

    return res.data if res.data else []