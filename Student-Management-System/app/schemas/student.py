from pydantic import BaseModel, EmailStr


# Used when creating a student
class StudentCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    age: int
    gender: str
    department: str
    year: int


# Used when updating a student
class StudentUpdate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    age: int
    gender: str
    department: str
    year: int


# Used when sending data back to the client
class StudentResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str
    age: int
    gender: str
    department: str
    year: int

    class Config:
        from_attributes = True