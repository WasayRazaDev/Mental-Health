from pydantic import BaseModel, ConfigDict
from typing import Optional, List


class TherapistOut(BaseModel):
    id: int
    name: str
    profile_url: Optional[str] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    experience_years: Optional[float] = None
    email: Optional[str] = None
    emails_all: Optional[str] = None
    phone: Optional[str] = None
    modes: Optional[str] = None
    education: Optional[str] = None
    experience: Optional[str] = None
    expertise: Optional[str] = None
    about: Optional[str] = None
    fees_raw: Optional[str] = None
    fee_amount: Optional[int] = None
    fee_currency: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class PageMeta(BaseModel):
    total: int
    page: int
    size: int


class TherapistListResponse(BaseModel):
    items: List[TherapistOut]
    meta: PageMeta


class FilterCounts(BaseModel):
    genders: List[tuple[str, int]]
    cities: List[tuple[str, int]]
    modes: List[tuple[str, int]]

