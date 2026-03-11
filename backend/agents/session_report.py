from groq import Groq
import os
import json

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_session_report(data):

    prompt = f"""
You are an AI study coach.

Analyze the study session and return a learning report.

Study Duration: {data['duration']} minutes
Tasks Completed: {data['tasks_completed']}
Focus Score: {data['focus_score']}%
Quiz Accuracy: {data['quiz_accuracy']}%
XP Earned: {data['xp_earned']}

Quiz Details:
{data['quiz_results']}

Return ONLY valid JSON in this format:

{{
 "summary": "...",
 "strengths": "...",
 "weaknesses": "...",
 "learning_insights": "...",
 "recommendations": "..."
}}

Do not include explanations.
Do not include markdown.
Return only JSON.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4
    )

    text = response.choices[0].message.content.strip()

    # parse JSON safely
    try:
        report = json.loads(text)
    except:
        report = {
            "summary": text,
            "strengths": "",
            "weaknesses": "",
            "learning_insights": "",
            "recommendations": ""
        }

    return report