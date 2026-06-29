def generate_answer(question, context):

    prompt = f"""
You are a resume assistant.

Answer the question using only the resume information.

Question:
{question}

Resume:
{context}

Answer:
"""

    # temporary simple answer
    return context
