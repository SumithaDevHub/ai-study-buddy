memory_store = {}

WINDOW_SIZE = 15


def get_memory(session_id):

    if session_id not in memory_store:
        memory_store[session_id] = []

    return memory_store[session_id]


def add_message(session_id, role, content):

    memory = get_memory(session_id)

    memory.append({
        "role": role,
        "content": content
    })

    if len(memory) > WINDOW_SIZE:
        memory_store[session_id] = memory[-WINDOW_SIZE:]