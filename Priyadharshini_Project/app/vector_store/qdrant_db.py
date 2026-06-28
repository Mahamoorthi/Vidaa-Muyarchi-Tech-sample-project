from qdrant_client import QdrantClient
from qdrant_client.models import (
    VectorParams,
    Distance,
    PointStruct
)


client = QdrantClient(
    url="http://localhost:6333"
)


COLLECTION_NAME = "resume"


def create_collection():

    collections = client.get_collections()

    exists = any(
        c.name == COLLECTION_NAME
        for c in collections.collections
    )

    if not exists:

        client.create_collection(
            collection_name=COLLECTION_NAME,

            vectors_config=VectorParams(
                size=384,
                distance=Distance.COSINE
            )
        )


def store_vectors(chunks, embeddings):

    points = []

    for i, vector in enumerate(embeddings):

        points.append(
            PointStruct(
                id=i,
                vector=vector.tolist(),
                payload={
                    "text": chunks[i]
                }
            )
        )


    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points
    )