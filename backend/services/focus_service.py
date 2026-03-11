from collections import deque
from typing import Dict
from schemas.focus_schema import FocusSignal
import time

# store rolling focus signals per session
focus_buffer: Dict[str, deque] = {}
last_alert_time = {}
ALERT_COOLDOWN = 30

WINDOW_SIZE = 6  # 6 signals = 30 seconds


def receive_signal(signal: FocusSignal):

    session_id = str(signal.session_id)

    if session_id not in focus_buffer:
        focus_buffer[session_id] = deque(maxlen=WINDOW_SIZE)

    focus_buffer[session_id].append(signal)

    alert = detect_patterns(session_id)

    if alert:
        now = time.time()
        last_time = last_alert_time.get(session_id, 0)

        if now - last_time < ALERT_COOLDOWN:
            return None

        last_alert_time[session_id] = now

    return alert

    session_id = str(signal.session_id)

    if session_id not in focus_buffer:
        focus_buffer[session_id] = deque(maxlen=WINDOW_SIZE)

    focus_buffer[session_id].append(signal)

    return detect_patterns(session_id)


def detect_patterns(session_id: str):

    signals = list(focus_buffer.get(session_id, []))

    if len(signals) < 3:
        return None

    # ---------- FACE ABSENT ----------
    if all(not s.face_present for s in signals[-3:]):
        return "Hey, I can't see you. Still studying?"

    # ---------- EYES CLOSED ----------
    if all(s.eyes_closed for s in signals[-2:]):
        return "Feeling sleepy? Maybe stretch for 30 seconds."

    # ---------- HIGH BLINK RATE ----------
    high_blink = [s for s in signals if s.blink_rate > 25]
    if len(high_blink) >= 3:
        return "Your eyes look tired. Consider a short break."

    # ---------- HEAD DOWN ----------
    if all(s.head_down for s in signals[-3:]):
        return "Stay with the material. You got this."

    # ---------- IDLE ----------
    if signals[-1].idle_seconds > 60:
        return "You've been idle for a minute."

    return None