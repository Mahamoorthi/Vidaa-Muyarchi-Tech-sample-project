from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.students import router as student_router
from app.api.auth import router as auth_router
from app.db.database import Base, engine
import app.db.models


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables when the app starts
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="Student Management System",
    version="1.0.0",
    description="Learning FastAPI with Docker and PostgreSQL",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins during development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(student_router)
app.include_router(auth_router)


@app.get("/")
async def home():
    return {"message": "Welcome to Student Management System"}