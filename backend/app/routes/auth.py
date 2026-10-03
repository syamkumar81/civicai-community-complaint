from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..database import supabase


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================
# REQUEST SCHEMAS
# =========================

class RegisterRequest(BaseModel):
    name: str
    email: str
    password: str
    phone: str
    state: str
    district: str
    village: str
    pincode: str


class LoginRequest(BaseModel):
    email: str
    password: str


# =========================
# REGISTER
# =========================

@router.post("/register")
def register_user(data: RegisterRequest):

    try:
        # Check whether email already exists
        existing = (
            supabase
            .table("users")
            .select("id")
            .eq("email", data.email)
            .execute()
        )

        if existing.data:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )

        # Insert user
        response = (
            supabase
            .table("users")
            .insert({
                "name": data.name,
                "email": data.email,
                "password": data.password,
                "phone": data.phone,
                "state": data.state,
                "district": data.district,
                "village": data.village,
                "pincode": data.pincode
            })
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=500,
                detail="User registration failed"
            )

        user = response.data[0]

        return {
            "success": True,
            "message": "Registration successful",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"],
                "state": user["state"],
                "district": user["district"],
                "village": user["village"],
                "pincode": user["pincode"]
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# =========================
# LOGIN
# =========================

@router.post("/login")
def login_user(data: LoginRequest):

    try:
        response = (
            supabase
            .table("users")
            .select("*")
            .eq("email", data.email)
            .eq("password", data.password)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )

        user = response.data[0]

        return {
            "success": True,
            "message": "Login successful",
            "user": {
                "id": user["id"],
                "name": user["name"],
                "email": user["email"],
                "phone": user["phone"],
                "state": user["state"],
                "district": user["district"],
                "village": user["village"],
                "pincode": user["pincode"]
            }
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )