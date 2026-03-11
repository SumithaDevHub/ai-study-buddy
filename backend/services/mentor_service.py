import random
from datetime import datetime, timedelta

# store last alert time per session
last_alert = {}

ALERT_COOLDOWN_SECONDS = 180


def mentor_decision(session_id, signals):
    
    """
    signals example:
    {
        "face_present": True,
        "eyes_closed_duration": 0.2,
        "head_down_duration": 0.1,
        "idle_time": 3
    }
    """

    now = datetime.now()

    if session_id in last_alert:
        if now - last_alert[session_id] < timedelta(seconds=ALERT_COOLDOWN_SECONDS):
            return {"message": None}

    face_present = signals.get("face_present", True)
    idle_time = signals.get("idle_time", 0)
    eyes_closed = signals.get("eyes_closed_duration", 0)
    head_down = signals.get("head_down_duration", 0)

    message = None

    # camera issues
    if not face_present:
        message = random.choice([
            "I can't see you clearly. Maybe adjust your camera?",
            "Face not detected properly. Try adjusting your lighting."
        ])

    # idle detection
    elif idle_time > 20:
        message = random.choice([
            "You seem distracted. Want to refocus together?",
            "Looks like you've been idle for a bit. Ready to continue?"
        ])

    # possible drowsiness
    elif eyes_closed > 1.5:
        message = random.choice([
            "You seem a little sleepy. Maybe a quick stretch?",
            "Feeling tired? A short break might help."
        ])

    # head down distraction
    elif head_down > 2:
        message = random.choice([
            "Try keeping your head up and focused.",
            "You might be drifting away from the screen."
        ])

    # encouragement
    else:
        if random.random() < 0.15:
            message = random.choice([
                "Nice focus. Keep going!",
                "You're doing great. Stay in the flow.",
                "Good concentration!"
            ])

    if message:
        last_alert[session_id] = now

    return {"message": message}