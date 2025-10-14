from typing import List, Optional, Tuple

from sqlalchemy.orm import Session
from sqlalchemy import func, select

from app.models.therapist import Therapist


def list_therapists(
    db: Session,
    *,
    page: int = 1,
    size: int = 20,
    search: Optional[str] = None,
    city: Optional[str] = None,
    gender: Optional[str] = None,
    mode: Optional[str] = None,
    min_fee: Optional[int] = None,
    max_fee: Optional[int] = None,
    min_experience: Optional[float] = None,
    max_experience: Optional[float] = None,
    expertise_contains: Optional[str] = None,
    sort: Optional[str] = None,  # fee, -fee, experience, -experience, name, -name
) -> Tuple[List[Therapist], int]:
    query = db.query(Therapist)

    if search:
        like = f"%{search}%"
        query = query.filter(
            func.lower(Therapist.name).like(func.lower(like))
            | func.lower(Therapist.city).like(func.lower(like))
            | func.lower(Therapist.expertise).like(func.lower(like))
            | func.lower(Therapist.education).like(func.lower(like))
            | func.lower(Therapist.about).like(func.lower(like))
        )

    if city:
        cities = [c.strip() for c in city.split(",") if c and c.strip()]
        if len(cities) > 1:
            query = query.filter(Therapist.city.in_(cities))
        elif len(cities) == 1:
            query = query.filter(Therapist.city == cities[0])

    if gender:
        query = query.filter(Therapist.gender == gender)

    if mode:
        # modes is a semicolon separated string; do a LIKE containment
        query = query.filter(Therapist.modes.ilike(f"%{mode}%"))

    if min_fee is not None:
        query = query.filter(Therapist.fee_amount >= min_fee)
    if max_fee is not None:
        query = query.filter(Therapist.fee_amount <= max_fee)

    if min_experience is not None:
        query = query.filter(Therapist.experience_years >= min_experience)
    if max_experience is not None:
        query = query.filter(Therapist.experience_years <= max_experience)

    if expertise_contains:
        query = query.filter(Therapist.expertise.ilike(f"%{expertise_contains}%"))

    sort_map = {
        "fee": Therapist.fee_amount.asc(),
        "-fee": Therapist.fee_amount.desc(),
        "experience": Therapist.experience_years.asc(),
        "-experience": Therapist.experience_years.desc(),
        "name": Therapist.name.asc(),
        "-name": Therapist.name.desc(),
    }
    order = sort_map.get(sort or "name")
    if order is not None:
        query = query.order_by(order)

    total = query.count()

    # pagination
    page = max(page, 1)
    size = max(min(size, 100), 1)
    items = query.offset((page - 1) * size).limit(size).all()
    return items, total


def get_therapist(db: Session, therapist_id: int) -> Optional[Therapist]:
    return db.query(Therapist).filter(Therapist.id == therapist_id).first()


def get_filter_counts(
    db: Session,
    *,
    search: Optional[str] = None,
    city: Optional[str] = None,
    gender: Optional[str] = None,
    mode: Optional[str] = None,
    min_fee: Optional[int] = None,
    max_fee: Optional[int] = None,
    min_experience: Optional[float] = None,
    max_experience: Optional[float] = None,
) -> dict:
    # Base filtered query to compute counts consistently with list
    base = db.query(Therapist)
    if search:
        like = f"%{search}%"
        base = base.filter(
            func.lower(Therapist.name).like(func.lower(like))
            | func.lower(Therapist.city).like(func.lower(like))
            | func.lower(Therapist.expertise).like(func.lower(like))
            | func.lower(Therapist.education).like(func.lower(like))
            | func.lower(Therapist.about).like(func.lower(like))
        )
    if city:
        cities = [c.strip() for c in city.split(",") if c and c.strip()]
        if len(cities) > 1:
            base = base.filter(Therapist.city.in_(cities))
        elif len(cities) == 1:
            base = base.filter(Therapist.city == cities[0])
    if gender:
        base = base.filter(Therapist.gender == gender)
    if mode:
        base = base.filter(Therapist.modes.ilike(f"%{mode}%"))
    if min_fee is not None:
        base = base.filter(Therapist.fee_amount >= min_fee)
    if max_fee is not None:
        base = base.filter(Therapist.fee_amount <= max_fee)
    if min_experience is not None:
        base = base.filter(Therapist.experience_years >= min_experience)
    if max_experience is not None:
        base = base.filter(Therapist.experience_years <= max_experience)

    genders = (
        base.session.query(Therapist.gender, func.count(Therapist.id))
        .group_by(Therapist.gender)
        .all()
    )
    cities = (
        base.session.query(Therapist.city, func.count(Therapist.id))
        .group_by(Therapist.city)
        .all()
    )

    # Modes need splitting; do it in Python for simplicity
    mode_counts = {}
    for m in base.session.query(Therapist.modes).all():
        if not m or not m[0]:
            continue
        for token in [t.strip() for t in m[0].split(";") if t.strip()]:
            mode_counts[token] = mode_counts.get(token, 0) + 1
    modes = sorted(mode_counts.items(), key=lambda x: (-x[1], x[0]))

    return {
        "genders": [(g or "Unknown", c) for g, c in genders],
        "cities": [(c or "Unknown", n) for c, n in cities],
        "modes": modes,
    }

