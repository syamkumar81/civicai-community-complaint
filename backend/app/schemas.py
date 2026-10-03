from typing import Optional

from pydantic import BaseModel


class ComplaintCreate(BaseModel):
    user_id: Optional[int] = None
    title: str
    description: str
    category: str
    state: str
    district: str
    village: str
    pincode: str
    priority: str = "Medium"