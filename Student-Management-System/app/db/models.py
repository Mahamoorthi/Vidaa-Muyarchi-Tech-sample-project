from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.database import Base


class Student(Base):

    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)

    first_name = Column(String)

    last_name = Column(String)

    email = Column(String, unique=True)

    phone = Column(String)

    age = Column(Integer)

    gender = Column(String)

    department = Column(String)

    year = Column(Integer)