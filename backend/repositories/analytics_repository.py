from memory.supabase_client import supabase
from dateutil import parser


class AnalyticsRepository:

    # ---------------- SUMMARY ---------------- #

    def get_summary(self, user_id: str):

        sessions_res = (
            supabase.table("sessions")
            .select("id, duration_minutes, avg_focus_score, xp_earned")
            .eq("user_id", user_id)
            .execute()
        )

        session_rows = sessions_res.data if sessions_res.data else []

        total_sessions = len(session_rows)

        total_minutes = sum((s.get("duration_minutes") or 0) for s in session_rows)

        total_xp = sum((s.get("xp_earned") or 0) for s in session_rows)

        avg_focus = 0
        if total_sessions > 0:
            avg_focus = sum((s.get("avg_focus_score") or 0) for s in session_rows) / total_sessions

        session_ids = [s["id"] for s in session_rows]

        quiz_rows = []

        if session_ids:
            quizzes_res = (
                supabase.table("quiz_attempts")
                .select("score_percent")
                .in_("session_id", session_ids)
                .execute()
            )

            quiz_rows = quizzes_res.data if quizzes_res.data else []

        avg_quiz = 0
        if quiz_rows:
            avg_quiz = sum((q.get("score_percent") or 0) for q in quiz_rows) / len(quiz_rows)

        return {
            "total_study_minutes": total_minutes,
            "total_sessions": total_sessions,
            "avg_focus_score": round(avg_focus, 2),
            "avg_quiz_accuracy": round(avg_quiz, 2),
            "total_xp": total_xp
        }


    # ---------------- WEEKLY STUDY ---------------- #

    def get_weekly_study(self, user_id):

        res = supabase.table("sessions") \
            .select("start_time, duration_minutes") \
            .eq("user_id", user_id) \
            .execute()

        rows = res.data if res.data else []

        days = {
            "Mon": 0,
            "Tue": 0,
            "Wed": 0,
            "Thu": 0,
            "Fri": 0,
            "Sat": 0,
            "Sun": 0
        }

        for r in rows:

            if not r.get("start_time"):
                continue

            d = parser.parse(r["start_time"])
            day = d.strftime("%a")

            days[day] += r.get("duration_minutes") or 0

        return [{"day": k, "minutes": v} for k, v in days.items()]


    # ---------------- FOCUS TREND ---------------- #

    def get_focus_trend(self, user_id):

        res = supabase.table("sessions") \
            .select("start_time, avg_focus_score") \
            .eq("user_id", user_id) \
            .execute()

        rows = res.data if res.data else []

        data = []

        for r in rows:

            if not r.get("start_time"):
                continue

            d = parser.parse(r["start_time"])

            data.append({
                "date": d.strftime("%b %d"),
                "focus": r.get("avg_focus_score") or 0
            })

        return data[-14:]


    # ---------------- WEAK TOPICS ---------------- #

    def get_weak_topics(self):

        res = supabase.table("quiz_attempts") \
            .select("score_percent, tasks(title)") \
            .execute()

        rows = res.data if res.data else []

        topic_errors = {}

        for r in rows:

            task = r.get("tasks")

            if not task:
                continue

            topic = task.get("title")

            score = r.get("score_percent") or 0
            error = 100 - score

            if topic not in topic_errors:
                topic_errors[topic] = []

            topic_errors[topic].append(error)

        results = []

        for topic, errors in topic_errors.items():

            avg = sum(errors) / len(errors)

            results.append({
                "topic": topic,
                "error_rate": round(avg, 1)
            })

        results.sort(key=lambda x: x["error_rate"], reverse=True)

        return results[:5]

        res = supabase.table("quiz_attempts") \
            .select("task_id, score_percent") \
            .execute()

        rows = res.data if res.data else []

        topic_errors = {}

        for r in rows:

            topic = r["task_id"]
            score = r.get("score_percent") or 0

            error = 100 - score

            if topic not in topic_errors:
                topic_errors[topic] = []

            topic_errors[topic].append(error)

        results = []

        for topic, errors in topic_errors.items():

            avg = sum(errors) / len(errors)

            results.append({
                "topic": topic,
                "error_rate": round(avg, 1)
            })

        results.sort(key=lambda x: x["error_rate"], reverse=True)

        return results[:5]