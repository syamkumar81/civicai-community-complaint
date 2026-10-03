from fastapi import APIRouter, HTTPException, Header, Depends
from pydantic import BaseModel
from ..database import supabase

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


# =========================
# SCHEMAS
# =========================

class ComplaintUpdate(BaseModel):
    status: str | None = None
    priority: str | None = None


import time

_admin_token_cache = {}
CACHE_TTL_SECONDS = 300  # 5 minutes in memory

def get_current_admin(authorization: str = Header(...)):
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format. Must be Bearer <token>"
        )
    
    token = authorization.split(" ")[1]
    
    # Return from cache if still valid
    now = time.time()
    cached = _admin_token_cache.get(token)
    if cached and now < cached.get("expires_at", 0):
        return cached["admin"]

    try:
        # Verify token with Supabase Auth
        user_res = supabase.auth.get_user(token)
        if not user_res or not user_res.user:
            raise HTTPException(
                status_code=401,
                detail="Invalid access token"
            )
        
        user_uuid = user_res.user.id
        
        # Check public.admins
        try:
            admin_res = (
                supabase
                .table("admins")
                .select("*")
                .eq("auth_user_id", user_uuid)
                .eq("is_active", True)
                .execute()
            )
        except Exception as e:
            if "relation \"public.admins\" does not exist" in str(e) or "Could not find the table" in str(e):
                raise HTTPException(
                    status_code=500,
                    detail="Database error: public.admins table does not exist. Please run the SQL migration in Supabase Dashboard."
                )
            raise e
            
        if not admin_res.data:
            raise HTTPException(
                status_code=403,
                detail="Admin access required"
            )
            
        admin_data = admin_res.data[0]
        # Cache verified admin data
        _admin_token_cache[token] = {
            "admin": admin_data,
            "expires_at": now + CACHE_TTL_SECONDS
        }
        return admin_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail=f"Authentication failed: {str(e)}"
        )


# =========================
# VERIFY ADMIN
# =========================

@router.get("/verify")
def verify_admin(admin=Depends(get_current_admin)):
    return {
        "is_admin": True,
        "email": admin.get("email"),
        "name": admin.get("name") or "Administrator"
    }


# =========================
# GET ALL COMPLAINTS
# =========================

@router.get("/complaints")
def get_admin_complaints(admin=Depends(get_current_admin)):
    try:
        response = (
            supabase
            .table("complaints")
            .select("*")
            .order("created_at", desc=True)
            .execute()
        )
        return {
            "success": True,
            "complaints": response.data or []
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch complaints: {str(e)}"
        )


# =========================
# UPDATE COMPLAINT (STATUS/PRIORITY)
# =========================

@router.put("/complaints/{complaint_id}")
def update_complaint(complaint_id: str, data: ComplaintUpdate, admin=Depends(get_current_admin)):
    try:
        update_data = {}
        if data.status is not None:
            update_data["status"] = data.status
        if data.priority is not None:
            update_data["priority"] = data.priority

        if not update_data:
            raise HTTPException(
                status_code=400,
                detail="No status or priority fields provided for update"
            )

        response = (
            supabase
            .table("complaints")
            .update(update_data)
            .eq("complaint_id", complaint_id)
            .execute()
        )

        if not response.data:
            raise HTTPException(
                status_code=404,
                detail="Complaint not found"
            )

        return {
            "success": True,
            "message": "Complaint updated successfully",
            "complaint": response.data[0]
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to update complaint: {str(e)}"
        )

# =========================
# GET ALL USERS WITH COMPLAINT COUNTS
# =========================

_auth_id_cache = {
    "map": {},
    "expires_at": 0
}

def get_auth_id_to_email_map():
    now = time.time()
    if _auth_id_cache["map"] and now < _auth_id_cache["expires_at"]:
        return _auth_id_cache["map"]

    mapping = {}
    try:
        auth_users = supabase.auth.admin.list_users()
        if auth_users:
            for au in auth_users:
                uid = getattr(au, "id", None) or (au.get("id") if isinstance(au, dict) else None)
                uemail = getattr(au, "email", None) or (au.get("email") if isinstance(au, dict) else None)
                if uid and uemail:
                    mapping[str(uid).strip().lower()] = str(uemail).strip().lower()
        _auth_id_cache["map"] = mapping
        _auth_id_cache["expires_at"] = now + 60  # Cache for 60s
    except Exception as e:
        print(f"Warning: Failed to list auth users for complaint mapping: {e}")
        if _auth_id_cache["map"]:
            return _auth_id_cache["map"]

    return mapping

@router.get("/users")
def get_admin_users(admin=Depends(get_current_admin)):
    try:
        # Get all users
        users_res = (
            supabase
            .table("users")
            .select("id, name, email, created_at")
            .order("id", desc=False)
            .execute()
        )

        users = users_res.data or []

        # Get all complaints
        complaints_res = (
            supabase
            .table("complaints")
            .select("user_id")
            .execute()
        )

        complaints = complaints_res.data or []

        # Map Supabase Auth user IDs to user emails
        auth_id_to_email = get_auth_id_to_email_map()

        # Build mapping from all possible user identifiers to the user's primary id string
        user_id_map = {}
        for user in users:
            uid_str = str(user.get("id", "")).strip()
            uemail = str(user.get("email", "")).strip().lower()
            if uid_str:
                user_id_map[uid_str.lower()] = uid_str
            if uemail:
                user_id_map[uemail] = uid_str

        # Link auth UUIDs to user ID via email
        for auth_id, email in auth_id_to_email.items():
            if email in user_id_map:
                user_id_map[auth_id] = user_id_map[email]

        # Count complaints for each user
        complaint_counts = {str(user.get("id", "")).strip(): 0 for user in users}

        for complaint in complaints:
            raw_user_id = complaint.get("user_id")
            if raw_user_id is not None:
                key = str(raw_user_id).strip().lower()
                if key in user_id_map:
                    matched_id = user_id_map[key]
                    complaint_counts[matched_id] = complaint_counts.get(matched_id, 0) + 1

        # Format user objects with string id and integer complaint_count
        formatted_users = []
        for user in users:
            uid_str = str(user.get("id", "")).strip()
            formatted_users.append({
                "id": uid_str,
                "name": user.get("name") or "Constituent",
                "email": user.get("email") or "",
                "created_at": user.get("created_at"),
                "complaint_count": complaint_counts.get(uid_str, 0)
            })

        return {
            "success": True,
            "total_users": len(formatted_users),
            "total_complaints": len(complaints),
            "users": formatted_users
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch users: {str(e)}"
        )

# =========================
# GET ANALYTICS
# =========================

@router.get("/analytics")
def get_admin_analytics(admin=Depends(get_current_admin)):
    try:
        complaints_res = supabase.table("complaints").select("*").execute()
        complaints = complaints_res.data or []

        by_priority = {}
        by_status = {}
        by_category = {}
        by_state = {}

        for c in complaints:
            p = c.get("priority") or "Medium"
            s = c.get("status") or "Submitted"
            cat = c.get("category") or "Other"
            st = c.get("state") or "Other"

            by_priority[p] = by_priority.get(p, 0) + 1
            by_status[s] = by_status.get(s, 0) + 1
            by_category[cat] = by_category.get(cat, 0) + 1
            by_state[st] = by_state.get(st, 0) + 1

        return {
            "success": True,
            "total_complaints": len(complaints),
            "by_priority": by_priority,
            "by_status": by_status,
            "by_category": by_category,
            "by_state": by_state
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch analytics: {str(e)}"
        )


# =========================
# AUTO-CONFIGURE ADMIN ACCOUNT (RUNS ON STARTUP)
# =========================

def verify_or_create_admin():
    admin_email = "admin@civicai.com"
    try:
        # Check if admins table exists
        try:
            supabase.table("admins").select("id").limit(1).execute()
        except Exception as e:
            if "relation \"public.admins\" does not exist" in str(e) or "Could not find the table" in str(e):
                print("[Admin Setup] public.admins table does not exist. Please run the SQL script in Supabase Dashboard SQL Editor.")
                return
            raise e

        # Check if auth user exists
        users = supabase.auth.admin.list_users()
        admin_user = None
        for u in users:
            if u.email == admin_email:
                admin_user = u
                break

        if not admin_user:
            import secrets
            temp_password = secrets.token_urlsafe(16)
            admin_user = supabase.auth.admin.create_user({
                "email": admin_email,
                "password": temp_password,
                "email_confirm": True
            })
            print("*" * 60)
            print(f"[Admin Setup] CREATED ADMIN AUTH USER: {admin_email}")
            print(f"[Admin Setup] TEMPORARY PASSWORD: {temp_password}")
            print("*" * 60)
        else:
            print(f"[Admin Setup] Admin user exists in Supabase Auth: {admin_user.email} (ID: {admin_user.id})")

        # Sync public.admins table
        admin_record = (
            supabase
            .table("admins")
            .select("id")
            .eq("email", admin_email)
            .execute()
        )

        if not admin_record.data:
            supabase.table("admins").insert({
                "auth_user_id": admin_user.id,
                "email": admin_email,
                "name": "CivicAI Admin",
                "is_active": True
            }).execute()
            print(f"[Admin Setup] Successfully linked {admin_email} to public.admins table")
        else:
            # Keep auth_user_id in sync
            supabase.table("admins").update({
                "auth_user_id": admin_user.id
            }).eq("email", admin_email).execute()
            print("[Admin Setup] Admin configuration validated successfully")

    except Exception as e:
        print("[Admin Setup] Failed to auto-configure admin user:", str(e))
