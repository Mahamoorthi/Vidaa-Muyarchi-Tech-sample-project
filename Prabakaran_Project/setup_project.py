import os

files = {
    "backend/app/main.py": """from fastapi import FastAPI
from backend.app.api.upload import router as upload_router

app = FastAPI(
    title="AI Resume Screening & ATS System",
    version="1.0.0"
)

app.include_router(upload_router, prefix="/api")

@app.get("/")
def home():
    return {
        "message": "Welcome to AI Resume Screening & ATS System",
        "status": "Running Successfully"
    }

@app.get("/health")
def health():
    return {
        "status": "Healthy"
    }
""",

    "backend/app/api/upload.py": """from fastapi import APIRouter, UploadFile, File
import os
import shutil

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {
        "filename": file.filename,
        "message": "Resume uploaded successfully"
    }
""",

    "backend/app/api/routes.py": "",
    "backend/app/models/resume.py": "",
    "backend/app/services/parser.py": "",
    "backend/app/services/ats.py": "",
    "backend/app/services/embedding.py": "",
    "backend/app/services/cache.py": "",
    "backend/app/database/connection.py": "",
    "backend/app/utils/helpers.py": "",
    "backend/app/utils/logger.py": "",
    "backend/app/config.py": "",
    "backend/app/database.py": "",
}

for path, content in files.items():
    os.makedirs(os.path.dirname(path), exist_ok=True)

    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

os.makedirs("uploads", exist_ok=True)

print("=" * 50)
print("AI Resume Screening Project Generated Successfully")
print("=" * 50)
print("Backend Files Created")
print("Upload API Created")
print("Uploads Folder Created")
print("=" * 50)