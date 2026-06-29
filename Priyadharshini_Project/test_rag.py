from app.utils.pdf_reader import read_pdf
from app.utils.text_splitter import split_text
from app.utils.embedding import create_embeddings
from app.vector_store.qdrant_db import (
    create_collection,
    store_vectors
)


pdf_path = r"E:\qdrant-ai-assistant\data\Priyadharshini_S_Resume.pdf.pdf"


# 1. Read PDF
print("Reading PDF...")
text = read_pdf(pdf_path)

print("Text length:", len(text))


# 2. Split into chunks
print("\nSplitting text...")
chunks = split_text(text)

print("Number of chunks:", len(chunks))

for i, chunk in enumerate(chunks):
    print("\nChunk", i)
    print(chunk)


# 3. Create embeddings
print("\nCreating embeddings...")
embeddings = create_embeddings(chunks)

print("Embedding size:", len(embeddings[0]))


# 4. Store in Qdrant
print("\nCreating Qdrant collection...")
create_collection()

print("Storing vectors...")
store_vectors(
    chunks,
    embeddings
)

print("\nDONE - PDF stored in Qdrant")