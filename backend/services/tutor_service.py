from memory.tutor_memory import get_memory, add_message
from agents.tutor import generate_tutor_response


HELP_MESSAGE = """
I can help you learn in different ways:

1️⃣ give me a hint  
2️⃣ explain in simple terms  
3️⃣ give a real world example  
4️⃣ break it step by step  
5️⃣ ask me questions  
6️⃣ direct answer

Just tell me how you'd like to learn.
"""


def tutor_chat(session_id, user_message):

    user_message_lower = user_message.lower()

    if user_message_lower.strip() == "help":

        return HELP_MESSAGE

    memory = get_memory(session_id)

    add_message(session_id, "user", user_message)

    response = generate_tutor_response(memory)

    add_message(session_id, "assistant", response)

    return response