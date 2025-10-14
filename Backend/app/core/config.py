from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    app_name: str = Field(default="mental_health_directory_backend")
    database_url: str = Field(alias="DATABASE_URL")

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()  # type: ignore[arg-type]

