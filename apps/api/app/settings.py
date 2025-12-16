from functools import lru_cache
from typing import Optional

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Configuration for WhatsApp integration and general API settings."""

    # WhatsApp Sandbox credentials
    whatsapp_sandbox_access_token: Optional[SecretStr] = Field(
        default=None,
        description="Sandbox token for the WhatsApp Cloud API.",
    )
    whatsapp_sandbox_phone_number_id: str = Field(
        default="",
        description="Sandbox phone number ID for the WhatsApp Cloud API.",
    )
    whatsapp_sandbox_test_number: str = Field(
        default="",
        description="Test recipient number associated with the sandbox.",
    )

    whatsapp_api_version: str = Field(
        default="v19.0",
        description="Graph API version to use for WhatsApp Business endpoints.",
    )
    whatsapp_phone_number_id: str = Field(
        default="",
        description="Target phone number ID provided by the WhatsApp Business API.",
    )
    whatsapp_access_token: Optional[SecretStr] = Field(
        default=None,
        description="Meta Graph API access token with WhatsApp Business permissions.",
    )
    whatsapp_verify_token: str = Field(
        default="dev-verify-token",
        description="Static token used to validate incoming webhook verification requests.",
    )
    whatsapp_app_secret: Optional[SecretStr] = Field(
        default=None,
        description="App secret used to validate webhook signatures.",
    )
    webhook_base_url: Optional[str] = Field(
        default=None,
        description="Public URL where WhatsApp will send webhook callbacks.",
    )

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    """Return cached application settings."""

    return Settings()
