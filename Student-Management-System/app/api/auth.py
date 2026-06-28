from fastapi import APIRouter

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register")
async def register():
    return {
        "message": "Student Registered Successfully"
    }


@router.post("/login")
async def login():
    return {
        "message": "Login Successful"
    }