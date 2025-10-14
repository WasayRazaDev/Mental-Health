import csv
import re
from pathlib import Path
from typing import Optional, List

from sqlalchemy.orm import Session

from app.models.therapist import Therapist


def _to_int(val: str) -> Optional[int]:
    try:
        v = val.strip()
        if not v:
            return None
        return int(float(v.replace(",", "")))
    except Exception:
        return None


def _to_float(val: str) -> Optional[float]:
    try:
        v = val.strip()
        if not v:
            return None
        return float(v)
    except Exception:
        return None


_EMAIL_RE = re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}")


def _parse_fee_amount(text: Optional[str]) -> Optional[int]:
    """Extract an integer fee amount from free text like 'Rs. 3,000 - 5,000 per session'.
    Strategy: pick the first number group, strip commas, cast to int.
    """
    if not text:
        return None
    nums = re.findall(r"\d[\d,]*", text)
    for n in nums:
        try:
            val = int(n.replace(",", ""))
            if val > 0:
                return val
        except Exception:
            continue
    return None


def _normalize_modes(raw: Optional[str]) -> Optional[str]:
    """Normalize modes to a canonical, semicolon-separated list matching frontend tokens."""
    if not raw:
        return None
    # split on common delimiters
    parts = re.split(r"[;,/|]+", raw)
    norm: List[str] = []
    for p in parts:
        t = p.strip().lower()
        if not t:
            continue
        if "in" in t and "person" in t:
            key = "In-person"
        elif ("virtual" in t and ("tele" in t or "phone" in t)) or "telephonic" in t:
            key = "Virtual telephonic"
        elif ("virtual" in t and ("video" in t or "zoom" in t)) or "video" in t:
            key = "Virtual video-based"
        else:
            # fallback to title case original token
            key = p.strip().title()
        if key and key not in norm:
            norm.append(key)
    return "; ".join(norm) if norm else None


def _primary_email(email: Optional[str], emails_all: Optional[str]) -> tuple[Optional[str], Optional[str]]:
    """If primary email missing, pick first valid from emails_all. Return (email, emails_all_norm)."""
    norm_all: Optional[str] = None
    if emails_all:
        # split on common separators and whitespace
        tokens = [t.strip() for t in re.split(r"[\s,;|]+", emails_all) if t and t.strip()]
        emails: List[str] = [t for t in tokens if _EMAIL_RE.fullmatch(t)]
        if emails:
            norm_all = ", ".join(dict.fromkeys(emails))  # dedupe preserving order
            if not email:
                email = emails[0]
        else:
            norm_all = emails_all.strip()
    return email or None, norm_all


def _normalize_city(city: Optional[str]) -> Optional[str]:
    if not city:
        return None
    return city.strip().title()


def _normalize_gender(gender: Optional[str]) -> Optional[str]:
    if not gender:
        return None
    g = gender.strip().lower()
    if g.startswith("m"):
        return "Male"
    if g.startswith("f"):
        return "Female"
    return gender.strip().title()


def import_csv(db: Session, csv_path: str) -> int:
    path = Path(csv_path)
    if not path.exists():
        raise FileNotFoundError(f"CSV not found: {csv_path}")

    created_or_updated = 0
    with path.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            profile_url = (row.get("profile_url") or "").strip()
            name = (row.get("name") or "").strip()
            if not name:
                continue

            obj = None
            if profile_url:
                obj = db.query(Therapist).filter(Therapist.profile_url == profile_url).first()

            if not obj:
                obj = Therapist()

            obj.name = name
            obj.profile_url = profile_url or None
            obj.gender = _normalize_gender(row.get("gender") or None)
            obj.city = _normalize_city(row.get("city") or None)
            obj.experience_years = _to_float(row.get("experience_years") or "")
            # emails: prefer provided primary, else derive from emails_all
            email = (row.get("email") or None)
            emails_all = (row.get("emails_all") or None)
            email, emails_all_norm = _primary_email(email, emails_all)
            obj.email = email
            obj.emails_all = emails_all_norm
            obj.phone = (row.get("phone") or None)
            obj.modes = _normalize_modes(row.get("modes") or None)
            obj.education = (row.get("education") or None)
            obj.experience = (row.get("experience") or None)
            obj.expertise = (row.get("expertise") or None)
            obj.about = (row.get("about") or None)
            obj.fees_raw = (row.get("fees_raw") or None)
            # fee amount: take numeric column if available, else parse from fees_raw
            fee_amount = _to_int(row.get("fee_amount") or "")
            if fee_amount is None:
                fee_amount = _parse_fee_amount(obj.fees_raw)
            obj.fee_amount = fee_amount
            obj.fee_currency = (row.get("fee_currency") or None)

            db.add(obj)
            created_or_updated += 1

        db.commit()

    return created_or_updated

