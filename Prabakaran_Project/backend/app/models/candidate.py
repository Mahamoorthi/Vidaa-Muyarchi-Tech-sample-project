from sqlalchemy import Column, Integer, String, JSON
from backend.app.database.connection import Base


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    email = Column(String(200), unique=True, nullable=False)
    phone = Column(String(30), nullable=True)

    # Store skills as JSON
    skills = Column(JSON, nullable=False)

    ats_score = Column(Integer, default=0)