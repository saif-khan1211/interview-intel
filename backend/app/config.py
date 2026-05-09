from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-1"
    s3_bucket_name: str = "interview-intel-resumes"

    anthropic_api_key: str = ""
    ai_generation_enabled: bool = True

    clerk_jwks_url: str = "https://api.clerk.com/v1/jwks"

    environment: str = "development"
    cors_origins: str = "http://localhost:3000"
    free_tier_analysis_limit: int = 3
    resume_max_size_mb: int = 5
    jd_max_chars: int = 5000
    cache_ttl_days: int = 7

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]


settings = Settings()
