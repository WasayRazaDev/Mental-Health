from pathlib import Path
from sqlalchemy.exc import SQLAlchemyError

from app.core.database import Base, engine, SessionLocal
from app.utils.csv_importer import import_csv


def main(csv_path: str):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        count = import_csv(db, csv_path)
        print(f"Imported/updated rows: {count}")
    except SQLAlchemyError as e:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    default_csv = Path(__file__).resolve().parents[1] / "data" / "therapists.csv"
    main(str(default_csv))
