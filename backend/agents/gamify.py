from datetime import datetime, timedelta


# ---------------- BASE XP ---------------- #

def calculate_base_xp(tasks_completed):
    return tasks_completed * 10


# ---------------- FOCUS MULTIPLIER ---------------- #

def focus_multiplier(focus_score):

    if focus_score >= 90:
        return 1.3
    elif focus_score >= 80:
        return 1.2
    elif focus_score >= 70:
        return 1.1
    else:
        return 1.0


# ---------------- QUIZ MULTIPLIER ---------------- #

def quiz_multiplier(quiz_accuracy):

    if quiz_accuracy >= 90:
        return 1.3
    elif quiz_accuracy >= 80:
        return 1.2
    elif quiz_accuracy >= 60:
        return 1.1
    else:
        return 1.0


# ---------------- ROOM MULTIPLIER ---------------- #

def room_multiplier(room_type):

    multipliers = {
        "individual": 1.0,
        "group": 1.0,
        "global": 0.4
    }

    return multipliers.get(room_type, 1.0)


# ---------------- DURATION BONUS ---------------- #

def duration_bonus(duration_minutes):

    if duration_minutes >= 90:
        return 30
    elif duration_minutes >= 60:
        return 20
    elif duration_minutes >= 30:
        return 10
    else:
        return 0


# ---------------- FINAL XP CALCULATION ---------------- #

def calculate_xp(duration_minutes, tasks_completed, quiz_accuracy, focus_score, room_type):

    base_xp = calculate_base_xp(tasks_completed)

    f_mult = focus_multiplier(focus_score)
    q_mult = quiz_multiplier(quiz_accuracy)
    r_mult = room_multiplier(room_type)

    xp = base_xp * f_mult * q_mult * r_mult

    xp += duration_bonus(duration_minutes)

    return int(xp)


# ---------------- LEVEL SYSTEM ---------------- #

def calculate_level(total_xp):

    return total_xp // 200


# ---------------- LEGO TOWER ---------------- #

def calculate_tower_blocks(total_xp):

    return total_xp // 100


# ---------------- STREAK SYSTEM ---------------- #

def update_streak(last_study_date, current_streak):

    today = datetime.utcnow().date()

    if last_study_date is None:
        return 1

    if last_study_date == today:
        return current_streak

    if last_study_date == today - timedelta(days=1):
        return current_streak + 1

    return 1