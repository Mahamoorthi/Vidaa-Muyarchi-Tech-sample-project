# 📄 Multi-PDF Research Agent using Qdrant Vector Database

🚀 A beginner-friendly AI-powered Multi-PDF Research Agent built using Python, Qdrant Vector Database, Sentence Transformers, and PyMuPDF.

The system indexes multiple PDF documents, converts them into vector embeddings, stores them in Qdrant, and performs semantic search to retrieve the most relevant information based on user queries.

---

# 📖 Project Overview

Traditional keyword-based search only finds exact word matches, making it difficult to retrieve information expressed differently.

This project solves that problem using **Semantic Search**.

Instead of searching for exact keywords, the system understands the meaning of the user's query by converting both PDF text and the query into embeddings.

The embeddings are stored inside Qdrant Vector Database, allowing fast similarity search across multiple PDF documents.

---

# ⚙️ How the Project Works

The project follows the following workflow:

1. Read all PDF files from the `papers/` folder.
2. Extract text from every page using PyMuPDF.
3. Split large text into smaller chunks.
4. Convert every chunk into vector embeddings using Sentence Transformers.
5. Store embeddings and metadata inside Qdrant.
6. Accept a natural language question from the user.
7. Convert the query into an embedding.
8. Perform semantic similarity search.
9. Return the most relevant PDF chunks along with the source document and page number.

---

# 🧠 Key Concepts Used

## 📌 Vector Database (Qdrant)

- Collections
- Points
- Payload Metadata
- Upsert
- Similarity Search
- Cosine Distance

---

## 📌 Embeddings

Sentence Transformer (`all-MiniLM-L6-v2`) converts text into dense vector representations that capture semantic meaning.

---

## 📌 Semantic Search

Instead of exact keyword matching, similar meanings are compared using vector similarity.

---

## 📌 Text Chunking

Large PDF pages are divided into overlapping chunks for better retrieval accuracy.

---

## 📌 Metadata Filtering

Each stored vector contains metadata such as:

- PDF file name
- Page number
- Original text

This allows results to show exactly where the answer came from.

---

# ✨ Features

- Process multiple PDF files automatically
- Extract text from every page
- Automatic text chunking
- Dense embedding generation
- Local Qdrant vector database
- Semantic similarity search
- Source document tracking
- Page number retrieval
- Simple command-line interface
- Beginner-friendly implementation

---

# 🧠 Technologies Used

## Main Technologies

- Python
- Qdrant Vector Database
- Sentence Transformers
- PyMuPDF (fitz)

## Python Libraries

- qdrant-client
- sentence-transformers
- PyMuPDF
- torch
- transformers
- numpy

---

# 🗂️ Project Structure

```

multi-pdf-agent/
│
├── papers/
│ ├── BERT.pdf
│ ├── Embed.pdf
│ ├── sample.pdf
│ ├── FewShot.pdf
│ └── RAG.pdf
├── qdrant_db/
├── app.py
├── requirements.txt
├── README.md
```

---

# ▶️ How to Run the Project

## 1️⃣ Clone the Repository

```

git clone <repository-url>
```

---

## 2️⃣ Install Dependencies

```

pip install -r requirements.txt
```

---

## 3️⃣ Place PDF Files

Copy all PDF files into the `papers/` folder.

Example:

```

papers/
├── paper1.pdf
├── paper2.pdf
└── paper3.pdf
```

---

## 4️⃣ Run the Project

```

python app.py
```

---

# 💬 Example

## Input

```

Ask:
define fewshot?
```

---

## Output

```

MODE: general

Top Results

Source : FewShot.pdf
Page   : 6
Text   : his is how many examples can ﬁt in the model’s context window
(nctx = 2048). The main advantages of few-shot are a major reduction in the need for task-speciﬁc data and
reduced potential to learn an overly narrow distribution from a large but narrow ﬁne-tuning dataset. The main
disadvantage is that results from this method have so far been much worse than state-of-the-art ﬁne-tuned
models. Also, a small amount of task speciﬁc data is still required. As indicated by the name, few-shot
learning as
----------------------------------------------------------------------
Source : FewShot.pdf
Page   : 6
Text   : few-shot except that only one demonstration is allowed, in addition to a natural
language description of the task, as shown in Figure 1. The reason to distinguish one-shot from few-shot and
zero-shot (below) is that it most closely matches the way in which some tasks are communicated to humans.
For example, when asking humans to generate a dataset on a human worker service (for example Mechanical
Turk), it is common to give one demonstration of the task. By contrast it is sometimes difﬁcult to c
----------------------------------------------------------------------
Source : FewShot.pdf
Page   : 10
Text   : the
few-shot, one-shot, and zero-shot settings.
10
----------------------------------------------------------------------
Source : FewShot.pdf
Page   : 6
Text   : small amount of task speciﬁc data is still required. As indicated by the name, few-shot
learning as described here for language models is related to few-shot learning as used in other contexts in
ML [HYC01, VBL+16] – both involve learning based on a broad distribution of tasks (in this case implicit in
the pre-training data) and then rapidly adapting to a new task.
• One-Shot (1S) is the same as few-shot except that only one demonstration is allowed, in addition to a natural
language descriptio
----------------------------------------------------------------------
Source : FewShot.pdf
Page   : 13
Text   : the few-shot setting approaches the performance of
state-of-the-art ﬁne-tuned models. Notably, compared to TriviaQA, WebQS shows a much larger gain from zero-shot to
few-shot (and indeed its zero-shot and one-shot performance are poor), perhaps suggesting that the WebQs questions
13
----------------------------------------------------------------------
```

---

# 🎯 Learning Outcomes

This project helps understand:

- Vector Databases
- Dense Embeddings
- Semantic Search
- Similarity Search
- Qdrant Collections
- Payload Metadata
- Upsert Operations
- Vector Retrieval
- PDF Text Extraction
- Text Chunking
- Python Data Processing
- AI-based Document Retrieval

---

# 🚨 Limitations

Current version:

- Uses only Dense Embeddings
- Command-line interface only
- No Large Language Model (LLM) response generation
- No web interface
- No hybrid search

---

# 🔮 Future Improvements

Possible enhancements:

- Hybrid Search (Dense + Sparse Vectors)
- LLM Answer Generation
- Streamlit Web Interface
- PDF Upload Feature
- Conversation Memory
- Reranking
- Metadata-based Filtering
- Support for DOCX and TXT files
- Multi-user Support
- Cloud-hosted Qdrant Database

---

# 👨‍💻 Conclusion

The Multi-PDF Research Agent demonstrates how Vector Databases and Sentence Transformers can be combined to build an efficient semantic search system.

Instead of relying on keyword matching, the system retrieves information based on meaning, making document search faster, smarter, and more accurate. It serves as a strong foundation for building Retrieval-Augmented Generation (RAG) applications and AI-powered document assistants.
