from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.student import (
    StudentCreate,
    StudentUpdate,
    StudentResponse
)

from app.repositories.student_repository import (
    create_student,
    get_all_students,
    get_student_by_id,
    update_student,
    delete_student
)

router = APIRouter(
    prefix="/students",
    tags=["Students"]
)


# -------------------------
# Create Student
# -------------------------
@router.post("/", response_model=StudentResponse)
def add_student(
    student: StudentCreate,
    db: Session = Depends(get_db)
):
    new_student = create_student(db, student)

    if new_student is None:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    return new_student


# -------------------------
# Get All Students
# -------------------------
@router.get("/", response_model=list[StudentResponse])
def read_students(
    db: Session = Depends(get_db)
):
    return get_all_students(db)


# -------------------------
# Get Student By ID
# -------------------------
@router.get("/{student_id}", response_model=StudentResponse)
def read_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    student = get_student_by_id(db, student_id)

    if student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return student


# -------------------------
# Update Student
# -------------------------
@router.put("/{student_id}", response_model=StudentResponse)
def edit_student(
    student_id: int,
    student: StudentUpdate,
    db: Session = Depends(get_db)
):
    # Check if student exists
    existing_student = get_student_by_id(db, student_id)

    if existing_student is None:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    updated_student = update_student(
        db,
        student_id,
        student
    )

    if updated_student is None:
        raise HTTPException(
            status_code=409,
            detail="Email already exists"
        )

    return updated_student


# -------------------------
# Delete Student
# -------------------------
@router.delete("/{student_id}")
def remove_student(
    student_id: int,
    db: Session = Depends(get_db)
):
    deleted = delete_student(
        db,
        student_id
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    return {
        "message": "Student deleted successfully"
    }