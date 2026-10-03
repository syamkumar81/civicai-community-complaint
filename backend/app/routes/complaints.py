from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
import uuid

from ..database import supabase
from ..ml.predictor import predict_priority


router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)


# ============================================================
# REQUEST MODEL
# ============================================================

class ComplaintCreate(BaseModel):

    # Supabase Auth user.id is a UUID string
    user_id: str

    title: str
    description: str
    category: str

    state: str
    district: str
    village: str
    pincode: str

    location_type: str = "Urban"
    emergency: str = "No"

    affected_people: int = 1
    severity_score: float = 5
    safety_risk_score: float = 5

    repeat_complaints: int = 0
    estimated_cost_inr: float = 0

    submission_channel: str = "Web"


# ============================================================
# CREATE COMPLAINT
# ============================================================

@router.post("/")
def create_complaint(complaint: ComplaintCreate):

    # --------------------------------------------------------
    # Validate user
    # --------------------------------------------------------

    if not complaint.user_id:
        raise HTTPException(
            status_code=401,
            detail="User authentication required."
        )

    # --------------------------------------------------------
    # Generate complaint ID
    # --------------------------------------------------------

    complaint_id = (
        f"CMP-{datetime.now().strftime('%Y%m%d')}-"
        f"{uuid.uuid4().hex[:6].upper()}"
    )

    # --------------------------------------------------------
    # ML PRIORITY PREDICTION
    # --------------------------------------------------------

    try:

        predicted_priority = predict_priority(
            complaint
        )

        print(
            f"Predicted priority for "
            f"{complaint_id}: "
            f"{predicted_priority}"
        )

    except Exception as e:

        print(
            "ML PREDICTION FAILED:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail="Unable to predict complaint priority."
        )

    # --------------------------------------------------------
    # Prepare database data
    # --------------------------------------------------------

    complaint_data = {

        "complaint_id": complaint_id,

        # IMPORTANT:
        # Store the Supabase Auth user's ID
        "user_id": complaint.user_id,

        "title": complaint.title,
        "description": complaint.description,
        "category": complaint.category,

        "state": complaint.state,
        "district": complaint.district,
        "village": complaint.village,
        "pincode": complaint.pincode,

        "priority": predicted_priority,

        "status": "Submitted",
    }

    # --------------------------------------------------------
    # Save complaint
    # --------------------------------------------------------

    try:

        response = (
            supabase
            .table("complaints")
            .insert(complaint_data)
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=500,
                detail="Complaint could not be saved."
            )

        return {

            "success": True,

            "message": (
                "Complaint submitted successfully"
            ),

            "complaint": response.data[0],

            "predicted_priority":
                predicted_priority
        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "DATABASE ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# GET ONLY CURRENT USER'S COMPLAINTS
# ============================================================

@router.get("/")
def get_complaints(user_id: str):

    try:

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="User authentication required."
            )

        response = (
            supabase
            .table("complaints")
            .select("*")
            .eq("user_id", user_id)
            .order(
                "created_at",
                desc=True
            )
            .execute()
        )

        return {

            "success": True,

            "complaints":
                response.data or []

        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "GET USER COMPLAINTS ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


# ============================================================
# GET COMPLAINT BY ID
# ============================================================

@router.get("/{complaint_id}")
def get_complaint(
    complaint_id: str
):

    try:

        response = (
            supabase
            .table("complaints")
            .select("*")
            .eq(
                "complaint_id",
                complaint_id
            )
            .execute()
        )

        if not response.data:

            raise HTTPException(
                status_code=404,
                detail="Complaint not found"
            )

        return {

            "success": True,

            "complaint":
                response.data[0]

        }

    except HTTPException:
        raise

    except Exception as e:

        print(
            "GET COMPLAINT ERROR:",
            repr(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )