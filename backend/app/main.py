from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.complaints import router as complaints_router
from .routes.auth import router as auth_router
from .routes.profile import router as profile_router
from .routes.admin import router as admin_router, verify_or_create_admin
from .database import supabase


app = FastAPI(
    title="CivicAI API",
    version="1.0.0",
)


# =========================
# STARTUP
# =========================

@app.on_event("startup")
def startup_event():
    verify_or_create_admin()


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://civicai-community-complaint.vercel.app",
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# ROUTERS
# =========================

app.include_router(complaints_router)
app.include_router(auth_router)
app.include_router(profile_router)
app.include_router(admin_router)


# =========================
# ROOT
# =========================

@app.get("/")
def root():
    return {
        "message": "CivicAI Backend is running"
    }


# =========================
# TEST SUPABASE
# =========================

@app.get("/test-supabase")
def test_supabase():

    response = (
        supabase
        .table("complaints")
        .select("*")
        .limit(1)
        .execute()
    )

    return {
        "message": "Supabase connection successful",
        "data": response.data,
    }