from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    app_name: str = "MealAgent"
    environment: str = "development"

    openai_api_key: str | None = None
    ytdlp_cookies: str | None = None
    database_url: str
    admin_database_url: str

    azure_storage_connection_string: str
    azure_storage_container: str

    jwt_secret: str = "my-meal-agent-app"
    jwt_alg: str = "HS256"
    jwt_expires_min: int = 43200
    google_web_client_id: str
    apple_aud: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

settings = Settings()