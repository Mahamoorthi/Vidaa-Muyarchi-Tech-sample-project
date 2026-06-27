from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import json

from backend.app.database.connection import get_db
from backend.app.models.candidate import Candidate

router = APIRouter()


@router.get("/candidates")
def get_candidates(db: Session = Depends(get_db)):
    candidates = db.query(Candidate).all()

    result = []

    for candidate in candidates:

        skills = candidate.skills

        # Convert JSON string to Python list if needed
        if isinstance(skills, str):
            try:
                skills = json.loads(skills)
            except Exception:
                skills = [s.strip() for s in skills.split(",")]

        result.append(
            {
                "id": candidate.id,
                "name": candidate.name,
                "email": candidate.email,
                "phone": candidate.phone,
                "skills": skills,
                "ats_score": candidate.ats_score,
            }
        )

    return result