from app.vector.qdrant_db import client
from app.embeddings.embedder import create_embedding


def store_text(text, point_id):

    vector = create_embedding(text)


    client.upsert(

        collection_name="documents",

        points=[

            {
                "id": point_id,

                "vector": vector,

                "payload":
                {
                    "text": text,
                    "source": "manual"
                }
            }

        ]
    )


    print("Stored:", text)



store_text(
    "FastAPI is a Python framework for creating APIs",
    1
)


store_text(
    "Qdrant is a vector database used for similarity search",
    2
)


store_text(
    "Python is a popular programming language",
    3
)