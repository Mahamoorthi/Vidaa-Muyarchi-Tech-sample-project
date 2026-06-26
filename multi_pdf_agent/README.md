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
What is Bert?
```

---

## Output

```

Source : BERT.pdf
Page   : 4
Text   : nput token
as Ti ∈RH.
For a given token, its input representation is
constructed by summing the corresponding token,
segment, and position embeddings. A visualiza-
tion of this construction can be seen in Figure 2.
3.1
Pre-training BERT
Unlike Peters et al. (2018a) and Radford et al.
(2018), we do not use traditional left-to-right or
right-to-left language models to pre-train BERT.
Instead, we pre-train BERT using two unsuper-
vised tasks, described in this section. This step
is presented in the
----------------------------------------------------------------------
Source : BERT.pdf
Page   : 3
Text   : ized with the same pre-trained parameters. The
question-answering example in Figure 1 will serve
as a running example for this section.
A distinctive feature of BERT is its uniﬁed ar-
chitecture across different tasks. There is mini-
mal difference between the pre-trained architec-
ture and the ﬁnal downstream architecture.
Model Architecture
BERT’s model architec-
ture is a multi-layer bidirectional Transformer en-
coder based on the original implementation de-
scribed in Vaswani et al. (2017)
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
