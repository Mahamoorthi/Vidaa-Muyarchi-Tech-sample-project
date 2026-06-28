from app.embeddings.embedder import create_embedding


text = "Python is a programming language"


result = create_embedding(text)


print(result)
print("Vector size:", len(result))