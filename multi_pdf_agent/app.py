import os
import fitz

from qdrant_client import QdrantClient, models
from sentence_transformers import SentenceTransformer


# -----------------------------
# Load embedding model
# -----------------------------
encoder = SentenceTransformer("all-MiniLM-L6-v2")


# -----------------------------
# Initialize Qdrant
# -----------------------------
qdrant = QdrantClient(path="./qdrant_db")

collection_name = "multi_pdf_agent"

# Delete old collection to avoid duplicate vectors
if qdrant.collection_exists(collection_name):
    qdrant.delete_collection(collection_name)

qdrant.create_collection(
    collection_name=collection_name,
    vectors_config=models.VectorParams(
        size=encoder.get_embedding_dimension(),
        distance=models.Distance.COSINE,
    ),
)


# -----------------------------
# Load all PDFs
# -----------------------------
def load_pdfs(folder="papers"):

    docs = []

    if not os.path.exists(folder):
        print(f"Folder '{folder}' not found.")
        return docs

    for file in os.listdir(folder):

        if file.lower().endswith(".pdf"):

            path = os.path.join(folder, file)

            with fitz.open(path) as pdf:

                print(f"Loading {file}")

                for page_num, page in enumerate(pdf):

                    text = page.get_text().strip()

                    if not text:
                        continue

                    docs.append(
                        {
                            "text": text,
                            "source": file,
                            "page": page_num + 1,
                        }
                    )

    return docs


# -----------------------------
# Chunking
# -----------------------------
def chunk_text(text, chunk_size=500, overlap=100):

    chunks = []

    start = 0

    while start < len(text):

        end = start + chunk_size

        chunks.append(text[start:end])

        start = end - overlap

    return chunks


# -----------------------------
# Ingest PDFs
# -----------------------------
def ingest():

    docs = load_pdfs()

    points = []

    corpus = []

    point_id = 0

    for doc in docs:

        chunks = chunk_text(doc["text"])

        for chunk in chunks:

            clean_text = chunk.strip()

            if not clean_text:
                continue

            corpus.append(clean_text)

            vector = encoder.encode(clean_text).tolist()

            points.append(
                models.PointStruct(
                    id=point_id,
                    vector=vector,
                    payload={
                        "text": clean_text,
                        "source": doc["source"],
                        "page": doc["page"],
                    },
                )
            )

            point_id += 1

    if points:

        qdrant.upsert(
            collection_name=collection_name,
            points=points,
        )

    print(f"\nInserted {len(points)} chunks.")

    return corpus


# -----------------------------
# Agent Router
# -----------------------------
def agent_router(query):

    q = query.lower()

    if "compare" in q:
        return "compare"

    elif "summary" in q:
        return "summary"

    elif "what is" in q:
        return "definition"

    elif "explain" in q:
        return "explain"

    return "general"


# -----------------------------
# Vector Search
# -----------------------------
def vector_search(query):

    q_vec = encoder.encode(query).tolist()

    results = qdrant.query_points(
        collection_name=collection_name,
        query=q_vec,
        limit=5,
        with_payload=True,
    ).points

    return results


# -----------------------------
# Filter Search
# -----------------------------
def filter_search(query, source_name):

    q_vec = encoder.encode(query).tolist()

    results = qdrant.query_points(
        collection_name=collection_name,
        query=q_vec,
        limit=5,
        query_filter=models.Filter(
            must=[
                models.FieldCondition(
                    key="source",
                    match=models.MatchValue(value=source_name),
                )
            ]
        ),
        with_payload=True,
    ).points

    return results


# -----------------------------
# Agent Executor
# -----------------------------
def agent_executor(query):

    mode = agent_router(query)

    print("\nMODE:", mode)

    return vector_search(query)


# -----------------------------
# Build Answer
# -----------------------------
def build_answer(results):

    return "\n\n".join(r.payload["text"] for r in results)


# -----------------------------
# Main
# -----------------------------
print("\nIngesting PDFs...\n")

ingest()

print("\nMulti PDF Agent Ready!")

while True:

    query = input("\nAsk: ")

    if query.lower() == "exit":
        break

    results = agent_executor(query)

    print("\nTop Results\n")

    for r in results:

        print("Source :", r.payload["source"])
        print("Page   :", r.payload["page"])
        print("Text   :", r.payload["text"])
        print("-" * 70)