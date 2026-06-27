from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import os
import shutil

from backend.app.database.connection import get_db
from backend.app.models.candidate import Candidate
from backend.app.services.parser import extract_text
from backend.app.services.extractor import extract_resume_details
from backend.app.services.ats import calculate_ats

router = APIRouter()

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    # Save uploaded file
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text from resume
    text = extract_text(file_path)

    # Extract resume details
    data = extract_resume_details(text)

    name = data.get("name", "")
    email = data.get("email", "")
    phone = data.get("phone", "")
    skills = data.get("skills", [])

    # Sample Job Description
    job_description = """
    Looking for a Data Analyst with experience in:

    - Python
    - SQL
    - Power BI
    - Excel
    - Git
    - Docker
    - PostgreSQL
    - FastAPI
    - Redis
    """

    # Calculate ATS Score
    ats_result = calculate_ats(
        resume_skills=skills,
        job_description=job_description
    )

    ats_score = ats_result["ats_score"]
    recommendation = ats_result["recommendation"]
    matched_skills = ats_result["matched_skills"]
    missing_skills = ats_result["missing_skills"]

    # Check if candidate already exists
    existing = db.query(Candidate).filter(
        Candidate.email == email
    ).first()

    if existing:
        existing.name = name
        existing.phone = phone
        existing.skills = skills
        existing.ats_score = ats_score

        db.commit()
        db.refresh(existing)

        return {
            "id": existing.id,
            "name": existing.name,
            "email": existing.email,
            "phone": existing.phone,
            "skills": existing.skills,
            "ats_score": existing.ats_score,
            "recommendation": recommendation,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "message": "Candidate updated successfully"
        }

    # Create new candidate
    candidate = Candidate(
        name=name,
        email=email,
        phone=phone,
        skills=skills,
        ats_score=ats_score
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return {
        "id": candidate.id,
        "name": candidate.name,
        "email": candidate.email,
        "phone": candidate.phone,
        "skills": candidate.skills,
        "ats_score": candidate.ats_score,
        "recommendation": recommendation,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "message": "Candidate saved successfully"
    }