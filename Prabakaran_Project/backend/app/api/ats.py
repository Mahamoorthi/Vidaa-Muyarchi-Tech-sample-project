from fastapi import APIRouter
from pydantic import BaseModel
from backend.app.services.ats import calculate_ats

router = APIRouter()

class ATSRequest(BaseModel):
    resume_skills: list[str]
    job_description: str

@router.post("/ats")
def calculate(request: ATSRequest):
    return calculate_ats(
        request.resume_skills,
        request.job_description
    )