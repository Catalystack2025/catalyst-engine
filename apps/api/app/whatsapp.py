from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional

import httpx
from fastapi import HTTPException
from pydantic import BaseModel, Field, HttpUrl, model_validator

from .settings import Settings

MessageType = Literal["text", "image", "audio", "document", "sticker", "video"]


class WhatsAppMessage(BaseModel):
    """Payload accepted by the API to send WhatsApp messages."""

    to: str = Field(..., description="Recipient phone number in international format")
    type: MessageType = Field(..., description="WhatsApp message type")
    text: Optional[str] = Field(None, description="Text content when type=text")
    media_id: Optional[str] = Field(
        None, description="Media ID received from the WhatsApp media upload endpoint"
    )
    media_link: Optional[HttpUrl] = Field(
        None, description="Public HTTPS link to the media resource"
    )
    caption: Optional[str] = Field(None, description="Optional caption for media items")

    @model_validator(mode="after")
    def validate_message(cls, values: "WhatsAppMessage") -> "WhatsAppMessage":
        if values.type == "text" and not values.text:
            raise ValueError("Text messages require the `text` field to be populated.")
        if values.type != "text" and not (values.media_id or values.media_link):
            raise ValueError("Media messages require either `media_id` or `media_link`.")
        if values.media_id and values.media_link:
            raise ValueError("Provide only one of `media_id` or `media_link`.")
        return values

    def to_whatsapp_payload(self) -> Dict[str, Any]:
        """Convert the request into the structure expected by the Graph API."""

        payload: Dict[str, Any] = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": self.to,
            "type": self.type,
        }

        if self.type == "text":
            payload["text"] = {"preview_url": False, "body": self.text}
        else:
            media_payload: Dict[str, Any] = {}
            if self.media_id:
                media_payload["id"] = self.media_id
            if self.media_link:
                media_payload["link"] = str(self.media_link)
            if self.caption:
                media_payload["caption"] = self.caption
            payload[self.type] = media_payload
        return payload


class WhatsAppTemplateStatus(BaseModel):
    id: str
    status: Optional[str] = None
    category: Optional[str] = None
    quality_score: Optional[str] = Field(default=None, alias="quality_score.current_score")


class WhatsAppClient:
    """Small wrapper around the WhatsApp Business Platform endpoints."""

    def __init__(self, settings: Settings):
        if not settings.whatsapp_access_token:
            raise HTTPException(
                status_code=500, detail="WHATSAPP_ACCESS_TOKEN is not configured."
            )
        if not settings.whatsapp_phone_number_id:
            raise HTTPException(
                status_code=500, detail="WHATSAPP_PHONE_NUMBER_ID is not configured."
            )
        self.settings = settings
        self._headers = {
            "Authorization": f"Bearer {settings.whatsapp_access_token.get_secret_value()}",
        }

    @property
    def base_url(self) -> str:
        return f"https://graph.facebook.com/{self.settings.whatsapp_api_version}"

    async def send_message(self, message: WhatsAppMessage) -> Dict[str, Any]:
        url = f"{self.base_url}/{self.settings.whatsapp_phone_number_id}/messages"
        payload = message.to_whatsapp_payload()
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(url, json=payload, headers=self._headers)
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()

    async def upload_media(self, *, file_name: str, content_type: str, data: bytes) -> Dict[str, Any]:
        url = f"{self.base_url}/{self.settings.whatsapp_phone_number_id}/media"
        files = {
            "file": (file_name, data, content_type),
            "type": (None, content_type),
            "messaging_product": (None, "whatsapp"),
        }
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(url, files=files, headers=self._headers)
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()

    async def get_template_status(self, template_id: str) -> Dict[str, Any]:
        url = f"{self.base_url}/{template_id}"
        params = {"fields": "status,category,quality_score"}
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.get(url, params=params, headers=self._headers)
        if response.status_code >= 400:
            raise HTTPException(status_code=response.status_code, detail=response.json())
        return response.json()


def parse_webhook_status_events(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Extract message status events from WhatsApp webhook payloads."""

    events: List[Dict[str, Any]] = []
    if "statuses" in payload:
        events.extend(payload.get("statuses", []))

    for entry in payload.get("entry", []):
        for change in entry.get("changes", []):
            value = change.get("value", {})
            events.extend(value.get("statuses", []))
    return events


def validate_webhook_payload(payload: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Validate webhook payloads and extract status events for persistence."""

    try:
        events = parse_webhook_status_events(payload)
    except Exception as exc:  # pragma: no cover - defensive for unexpected formats
        raise HTTPException(status_code=400, detail=str(exc))

    if not events:
        raise HTTPException(status_code=400, detail="No status events found in payload.")

    return events
