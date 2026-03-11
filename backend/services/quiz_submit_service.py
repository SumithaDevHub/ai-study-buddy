from repositories.quiz_repository import create_quiz_attempt
from repositories.task_repository import mark_task_completed


PASSING_SCORE = 55


def calculate_score(correct, total):

    if total == 0:
        return 0

    return (correct / total) * 100


def calculate_xp(score, attempt_type):

    if attempt_type == "skip":
        return 20

    return int(score * 0.5)


def submit_quiz_service(data):

    score = calculate_score(data.correct_answers, data.total_questions)

    xp = calculate_xp(score, data.attempt_type)

    passed = score >= PASSING_SCORE

    if passed or data.attempt_type == "skip":
        mark_task_completed(data.task_id)

    quiz_attempt = {
        "task_id": data.task_id,
        "session_id": data.session_id,
        "total_questions": data.total_questions,
        "correct_answers": data.correct_answers,
        "score_percent": score,
        "attempt_type": data.attempt_type,
        "xp_awarded": xp,
        "question_results": data.question_results        
    }

    create_quiz_attempt(quiz_attempt)

    return {
        "passed": passed,
        "score": score,
        "xp_awarded": xp
    }