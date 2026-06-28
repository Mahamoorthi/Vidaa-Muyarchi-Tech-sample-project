from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.db.models import Student
from app.schemas.student import StudentCreate, StudentUpdate


def create_student(db: Session, student: StudentCreate):
    db_student = Student(
        first_name=student.first_name,
        last_name=student.last_name,
        email=student.email,
        phone=student.phone,
        age=student.age,
        gender=student.gender,
        department=student.department,
        year=student.year,
    )

    try:
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        return db_student

    except IntegrityError:
        db.rollback()
        return None


def get_all_students(db: Session):
    return db.query(Student).all()


def get_student_by_id(db: Session, student_id: int):
    return db.query(Student).filter(
        Student.id == student_id
    ).first()


def update_student(
    db: Session,
    student_id: int,
    student: StudentUpdate
):
    db_student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if db_student is None:
        return None

    db_student.first_name = student.first_name
    db_student.last_name = student.last_name
    db_student.email = student.email
    db_student.phone = student.phone
    db_student.age = student.age
    db_student.gender = student.gender
    db_student.department = student.department
    db_student.year = student.year

    try:
        db.commit()
        db.refresh(db_student)
        return db_student

    except IntegrityError:
        db.rollback()
        return None


def delete_student(
    db: Session,
    student_id: int
):
    student = db.query(Student).filter(
        Student.id == student_id
    ).first()

    if student is None:
        return False

    db.delete(student)
    db.commit()

    return True