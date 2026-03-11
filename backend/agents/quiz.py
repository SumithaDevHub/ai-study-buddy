from groq import Groq
import os
import json

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def get_question_count(duration: int):

    if duration <= 10:
        return 3
    elif duration <= 30:
        return 5
    else:
        return 7


def generate_quiz(task_title: str, duration: int, difficulty: str):

    num_questions = get_question_count(duration)

    prompt = f"""
You are an AI quiz generator.

Task: {task_title}
Difficulty: {difficulty}

Generate {num_questions} quiz questions.

Rules:
- Mix MCQ and True/False questions
- Every question MUST include options
- MCQ must have exactly 4 options
- True/False questions MUST have options ["True","False"]
- Provide the correct answer
- Provide a short explanation
- Questions must test understanding of the task
- ALWAYS return the answer as the FULL OPTION TEXT
- NEVER return numeric answers like 1,2,3,4. Only return the option text.

Return STRICT JSON ONLY.

Format:

{{
 "questions":[
  {{
   "type":"mcq",
   "question":"",
   "options":["","","",""],
   "answer":"",
   "explanation":""
  }},
  {{
   "type":"true_false",
   "question":"",
   "options":["True","False"],
   "answer":"",
   "explanation":""
  }}
 ]
}}
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4
    )

    content = response.choices[0].message.content

    try:
        return json.loads(content)
    except:
        return {"questions": []}