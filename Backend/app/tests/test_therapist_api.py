import os
import pytest
from fastapi.testclient import TestClient


# Use in-memory SQLite for tests before importing app
os.environ["DATABASE_URL"] = "sqlite+pysqlite:///:memory:"

from app.main import app  # noqa: E402
from app.core.database import Base, engine, SessionLocal  # noqa: E402
from app.models.therapist import Therapist  # noqa: E402


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    try:
        yield
    finally:
        Base.metadata.drop_all(bind=engine)


def seed_sample():
    db = SessionLocal()
    try:
        db.add_all(
            [
                Therapist(name="A One", city="Karachi", gender="Male", fee_amount=3000),
                Therapist(name="B Two", city="Lahore", gender="Female", fee_amount=5000),
            ]
        )
        db.commit()
    finally:
        db.close()


def test_health():
    client = TestClient(app)
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


def test_list_and_filters():
    seed_sample()
    client = TestClient(app)

    r = client.get("/api/v1/therapists/?page=1&size=10")
    assert r.status_code == 200
    data = r.json()
    assert data["meta"]["total"] == 2
    assert len(data["items"]) == 2

    # Filter by city
    r = client.get("/api/v1/therapists/?city=Lahore")
    assert r.status_code == 200
    assert r.json()["meta"]["total"] == 1

    # Filters endpoint
    r = client.get("/api/v1/therapists/filters")
    assert r.status_code == 200
    f = r.json()
    assert isinstance(f.get("cities"), list)


def test_detail():
    seed_sample()
    client = TestClient(app)
    # Get first page, fetch id, then detail
    r = client.get("/api/v1/therapists/?page=1&size=1")
    tid = r.json()["items"][0]["id"]
    r = client.get(f"/api/v1/therapists/{tid}")
    assert r.status_code == 200
