from qdrant_client import QdrantClient
from sentence_transformers import SentenceTransformer
from app.llm.answer import generate_answer


client = QdrantClient(
    url="http://localhost:6333"
)


model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


COLLECTION_NAME = "resume"


def search_resume(question):

    vector = model.encode(question)


    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=vector.tolist(),
        limit=3
    )


    context = ""

    for result in results.points:
        context += result.payload["text"] + "\n"


    answer = generate_answer(
        question,
        context
    )


    print("\nAnswer:\n")
    print(answer)



question = input(
    "Ask about resume: "
)

search_resume(question)