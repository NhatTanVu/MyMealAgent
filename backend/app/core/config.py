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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
    )

settings = Settings()