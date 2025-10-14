from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.crud.therapist import list_therapists, get_therapist, get_filter_counts
from app.schemas.therapist import TherapistListResponse, TherapistOut, PageMeta


router = APIRouter(prefix="/api/v1/therapists", tags=["therapists"])


@router.get("/", response_model=TherapistListResponse)
def list_endpoint(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    city: str | None = None,
    gender: str | None = None,
    mode: str | None = None,
    min_fee: int | None = Query(None, ge=0),
    max_fee: int | None = Query(None, ge=0),
    min_experience: float | None = Query(None, ge=0),
    max_experience: float | None = Query(None, ge=0),
    expertise_contains: str | None = None,
    sort: str | None = Query(None, pattern=r"^-?(fee|experience|name)$"),
    db: Session = Depends(get_db),
):
    items, total = list_therapists(
        db,
        page=page,
        size=size,
        search=search,
        city=city,
        gender=gender,
        mode=mode,
        min_fee=min_fee,
        max_fee=max_fee,
        min_experience=min_experience,
        max_experience=max_experience,
        expertise_contains=expertise_contains,
        sort=sort,
    )
    return {
        "items": items,
        "meta": PageMeta(total=total, page=page, size=size),
    }


@router.get("/filters")
def filter_options(
    search: str | None = None,
    city: str | None = None,
    gender: str | None = None,
    mode: str | None = None,
    min_fee: int | None = Query(None, ge=0),
    max_fee: int | None = Query(None, ge=0),
    min_experience: float | None = Query(None, ge=0),
    max_experience: float | None = Query(None, ge=0),
    db: Session = Depends(get_db),
):
    return get_filter_counts(
        db,
        search=search,
        city=city,
        gender=gender,
        mode=mode,
        min_fee=min_fee,
        max_fee=max_fee,
        min_experience=min_experience,
        max_experience=max_experience,
    )


@router.get("/{therapist_id}", response_model=TherapistOut)
def detail_endpoint(therapist_id: int, db: Session = Depends(get_db)):
    obj = get_therapist(db, therapist_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Therapist not found")
    return obj

