from sqlalchemy import Column, Integer, String, Float, Text, Index

from app.core.database import Base


class Therapist(Base):
    __tablename__ = "therapists"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    profile_url = Column(String(512), unique=True, nullable=True)
    gender = Column(String(50), nullable=True)
    city = Column(String(120), nullable=True)
    experience_years = Column(Float, nullable=True)
    email = Column(String(255), nullable=True)
    emails_all = Column(Text, nullable=True)
    phone = Column(String(120), nullable=True)
    modes = Column(Text, nullable=True)  # e.g., "In-person; Virtual video-based"
    education = Column(Text, nullable=True)
    experience = Column(Text, nullable=True)
    expertise = Column(Text, nullable=True)
    about = Column(Text, nullable=True)
    fees_raw = Column(Text, nullable=True)
    fee_amount = Column(Integer, nullable=True)
    fee_currency = Column(String(10), nullable=True)

    __table_args__ = (
        Index("idx_therapists_city", "city"),
        Index("idx_therapists_gender", "gender"),
        Index("idx_therapists_fee", "fee_amount"),
        Index("idx_therapists_name", "name"),
    )

