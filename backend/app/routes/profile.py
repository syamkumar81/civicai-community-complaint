from fastapi import APIRouter, HTTPException
from ..database import supabase


router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


# =========================
# GET PROFILE BY EMAIL
# =========================

@router.get("")
def get_profile(email: str):
    """
    Retrieve a user's profile from public.users by email.
    NEVER returns the password column.
    """
    try:
        response = (
            supabase
            .table("users")
            .select(
                "id, name, email, phone, state, district, village, pincode"
            )
            .eq("email", email)
            .limit(1)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Profile not found"
            )

        return response.data[0]

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve profile"
        )