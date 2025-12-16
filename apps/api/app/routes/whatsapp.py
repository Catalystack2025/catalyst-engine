from __future__ import annotations

from typing import Dict, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from ..settings import Settings, get_settings
from ..status_store import STATUS_STORE
from ..whatsapp import WhatsAppClient, WhatsAppMessage

router = APIRouter(prefix="/whatsapp", tags=["WhatsApp"])


def get_client(settings: Settings = Depends(get_settings)) -> WhatsAppClient:
    return WhatsAppClient(settings)


@router.post("/messages")
async def send_whatsapp_message(
    payload: WhatsAppMessage, client: WhatsAppClient = Depends(get_client)
) -> Dict:
    """Send a text or multimedia WhatsApp message."""

    response = await client.send_message(payload)
    message_id = response.get("messages", [{}])[0].get("id")
    if message_id:
        STATUS_STORE.upsert({"id": message_id, "status": "sent", "recipient_id": payload.to})
    return response


@router.get("/messages/{message_id}/status")
async def get_message_status(message_id: str):
    """Retrieve the latest stored status for a WhatsApp message."""

    status = STATUS_STORE.get(message_id)
    if not status:
        raise HTTPException(status_code=404, detail="Message not found in status store.")
    return {"message_id": message_id, "latest": status.latest(), "history": status.events}


@router.post("/media")
async def upload_whatsapp_media(
    media_type: str = Form(...),
    file: UploadFile = File(...),
    client: WhatsAppClient = Depends(get_client),
):
    """Upload media to WhatsApp and return the media ID."""

    file_bytes = await file.read()
    response = await client.upload_media(
        file_name=file.filename or "upload.bin",
        content_type=file.content_type or media_type,
        data=file_bytes,
    )
    return response


@router.get("/templates/{template_id}/status")
async def template_status(
    template_id: str, client: WhatsAppClient = Depends(get_client)
) -> Dict[str, Optional[str]]:
    """Proxy to retrieve a template's status from the Graph API."""

    response = await client.get_template_status(template_id)
    return response
