from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.database import Base, engine
from app.api.v1.routes_therapists import router as therapists_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        import sys
        print(f"CRITICAL DATABASE CONNECTION ERROR: {e}", file=sys.stderr)
        raise e
    yield
    # Shutdown
    

app = FastAPI(title="Mental Health Directory API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(therapists_router)

