from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.database.connection import engine, Base

# Import models so SQLAlchemy can create tables
from backend.app.models.candidate import Candidate

# Import API routers
from backend.app.api.upload import router as upload_router
from backend.app.api.ats import router as ats_router
from backend.app.api.candidates import router as candidate_router

# Create all database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Resume Screening & ATS System",
    description="AI-powered Resume Screening, ATS Scoring & Candidate Management System",
    version="1.0.0",
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(
    upload_router,
    prefix="/api",
    tags=["Resume Upload"],
)

app.include_router(
    ats_router,
    prefix="/api",
    tags=["ATS Score"],
)

app.include_router(
    candidate_router,
    prefix="/api",
    tags=["Candidates"],
)


@app.get("/", tags=["Default"])
def home():
    return {
        "message": "Welcome to AI Resume Screening & ATS System"
    }


@app.get("/health", tags=["Default"])
def health():
    return {
        "status": "OK",
        "database": "Connected"
    }