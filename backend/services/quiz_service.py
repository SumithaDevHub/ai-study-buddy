from agents.quiz import generate_quiz


def generate_quiz_service(data):

    quiz = generate_quiz(
        task_title=data.task_title,
        duration=data.duration,
        difficulty=data.difficulty
    )

    return quiz