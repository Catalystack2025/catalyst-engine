from __future__ import annotations

from typing import Dict

from fastapi import APIRouter, Depends, HTTPException, Query, Request

from ..settings import Settings, get_settings
from ..status_store import STATUS_STORE
from ..whatsapp import validate_webhook_payload

router = APIRouter(prefix="/webhooks", tags=["Webhooks"])


@router.get("/whatsapp")
async def verify_webhook(
    mode: str = Query(None, alias="hub.mode"),
    challenge: str = Query(None, alias="hub.challenge"),
    token: str = Query(None, alias="hub.verify_token"),
    settings: Settings = Depends(get_settings),
):
    """Handle WhatsApp webhook verification handshake."""

    if mode == "subscribe" and token == settings.whatsapp_verify_token:
        return int(challenge) if challenge is not None else 0
    raise HTTPException(status_code=403, detail="Invalid verification token.")


@router.post("/whatsapp")
async def receive_webhook(
    request: Request, settings: Settings = Depends(get_settings)
) -> Dict[str, int]:
    """Receive WhatsApp status notifications and store them in memory."""

    payload = await request.json()
    events = validate_webhook_payload(payload)
    for event in events:
        STATUS_STORE.upsert(event)
    return {"received": len(events)}
