from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def validate_goal(goal, duration):

    goal_lower = goal.lower()

    if len(goal.split()) <= 1:
        return "Goal may be too broad. Try specifying a topic."

    if duration <= 15 and "machine learning" in goal_lower:
        return "Machine learning may be too large for 15 minutes."

    return None


def get_task_count(duration):

    if duration <= 15:
        return 2
    elif duration <= 30:
        return 3
    elif duration <= 60:
        return 6
    else:
        return 8


def generate_tasks(goal, duration, difficulty):

    task_count = get_task_count(duration)

    prompt = f"""
You are an AI study planner.

Goal: {goal}
Duration: {duration} minutes
Difficulty: {difficulty}

Generate EXACTLY {task_count} study tasks.

Rules:
- Return only task titles
- No numbering
- No explanations
- Each task must be short (max 8 words)
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    tasks_text = response.choices[0].message.content

    tasks = [
        t.strip()
        for t in tasks_text.split("\n")
        if t.strip() != ""
    ]

    return tasks


def planner(goal, duration, difficulty):

    warning = validate_goal(goal, duration)

    tasks = generate_tasks(goal, duration, difficulty)

    return {
        "status": "ok",
        "warning": warning,
        "tasks": tasks
    }