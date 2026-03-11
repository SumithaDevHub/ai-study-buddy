from repositories.session_repository import create_session, get_session, end_session_update
from repositories.task_repository import create_tasks, count_completed_tasks
from repositories.quiz_repository import (
    sum_session_xp,
    get_session_quiz_accuracy,
    get_session_quiz_results
)
from repositories.session_report_repository import create_session_report
from agents.session_report import generate_session_report

from datetime import datetime
from dateutil.parser import parse

from agents.gamify import (
    calculate_xp,
    calculate_level,
    calculate_tower_blocks,
    update_streak
)

from repositories.user_stats_repository import (
    get_user_stats,
    update_user_stats
)


# ---------------- START SESSION ---------------- #

def start_session_service(data,user_id):

    session = {
        "goal": data.goal,
        "duration": data.duration,
        "room_type": data.room_type,
        "status": "active",
        "user_id": user_id
    }

    # create session row
    created_session = create_session(session)

    session_id = created_session["id"]

    # create tasks if planner returned any
    if hasattr(data, "tasks") and data.tasks:
        create_tasks(session_id, data.tasks)

    return created_session


# ---------------- END SESSION ---------------- #

def end_session(session_id, avg_focus_score):

    # fetch session
    session = get_session(session_id)

    if not session:
        raise Exception("Session not found")

    # Supabase timestamp is returned as string
    start_time_str = session["start_time"]

    # safely parse timestamp
    start_time = parse(start_time_str)

    # compute duration
    now = datetime.utcnow()
    duration_minutes = int((now - start_time).total_seconds() / 60)

    # completed tasks
    tasks_completed = count_completed_tasks(session_id)

    # total xp from quiz attempts
    xp_earned = sum_session_xp(session_id)

    # calculate quiz accuracy
    quiz_accuracy = get_session_quiz_accuracy(session_id)

    # get question-level quiz results
    quiz_results = get_session_quiz_results(session_id)

    # update session row
    end_session_update(
        session_id=session_id,
        duration=duration_minutes,
        tasks_completed=tasks_completed,
        avg_focus_score=avg_focus_score,
        xp=xp_earned,
        quiz_accuracy=quiz_accuracy
    )

    # ---------------- GAMIFY AGENT ---------------- #

    user_id = session["user_id"]

    user_stats = get_user_stats(user_id)

    if not user_stats:
        from repositories.user_stats_repository import create_user_stats
        create_user_stats(user_id)
        user_stats = get_user_stats(user_id)

    xp_earned = calculate_xp(
        duration_minutes,
        tasks_completed,
        quiz_accuracy,
        avg_focus_score,
        session["room_type"]
    )

    total_xp = user_stats["total_xp"] + xp_earned

    level = calculate_level(total_xp)

    tower_blocks = calculate_tower_blocks(total_xp)

    new_streak = update_streak(
        user_stats["last_study_date"],
        user_stats["current_streak"]
    )

    update_user_stats(user_id, {
        "total_xp": total_xp,
        "level": level,
        "tower_blocks": tower_blocks,
        "current_streak": new_streak,
        "last_study_date": datetime.utcnow().date().isoformat()
    })

    print("END SESSION REACHED REPORT STEP")

    # ---------------- GENERATE AI SESSION REPORT ---------------- #

    report_input = {
        "duration": duration_minutes,
        "tasks_completed": tasks_completed,
        "focus_score": avg_focus_score,
        "quiz_accuracy": quiz_accuracy,
        "xp_earned": xp_earned,
        "quiz_results": quiz_results
    }

    report = generate_session_report(report_input)

    create_session_report({
        "session_id": str(session_id),
        "summary": report["summary"],
        "learning_insights": report["learning_insights"],
        "strengths": report["strengths"],
        "weaknesses": report["weaknesses"],
        "recommendations": report["recommendations"]
    })


    # ---------------- FINAL RESPONSE ---------------- #

    return {
        "study_duration": duration_minutes,
        "tasks_completed": tasks_completed,
        "focus_score": avg_focus_score,
        "quiz_accuracy": quiz_accuracy,
        "xp_earned": xp_earned,
        "level": level,
        "tower_blocks": tower_blocks,
        "streak": new_streak,
        "report": report
    }