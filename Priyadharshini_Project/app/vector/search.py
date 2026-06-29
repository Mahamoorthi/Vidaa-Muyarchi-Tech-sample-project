from app.vector.qdrant_db import client
from app.embeddings.embedder import create_embedding


question = "How do I build an API?"


query_vector = create_embedding(question)


results = client.query_points(

    collection_name="documents",

    query=query_vector,

    limit=3
)


for result in results.points:

    print("----------------")

    print("Score:", result.score)

    print("Text:")

    print(result.payload["text"])