from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    PROJECT_NAME: str = "JPVocab"
    API_PREFIX: str = "/api"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    POSTGRES_HOST: str = "localhost"
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "postgres"
    POSTGRES_DB: str = "jpvocab_db"

    JMDICT_DB_PATH: str = "data/JMdict.db"
    KANJIDIC_DB_PATH: str = "data/kanjidic2.db"

    def resolve_db_path(self, path_str: str) -> Path:
        p = Path(path_str)
        if p.is_absolute() and p.exists():
            return p
        repo_candidate = BASE_DIR.parent / p
        if repo_candidate.exists():
            return repo_candidate
        backend_candidate = BASE_DIR / p
        if backend_candidate.exists():
            return backend_candidate
        return Path.cwd() / p

    @property
    def jmdict_path(self) -> Path:
        return self.resolve_db_path(self.JMDICT_DB_PATH)

    @property
    def kanjidic_path(self) -> Path:
        return self.resolve_db_path(self.KANJIDIC_DB_PATH)

    @property
    def database_url(self) -> str:
        return (
            f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def DATABASE_URL(self) -> str:
        return self.database_url


    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()
