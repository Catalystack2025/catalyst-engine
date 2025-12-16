from __future__ import annotations

import hashlib
import hmac
from typing import Dict

from fastapi import APIRouter, Depends, HTTPException, Query, Request

from ..settings import Settings, get_settings
from ..status_store import STATUS_STORE
from ..whatsapp import extract_webhook_events

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

    body = await request.body()
    if settings.whatsapp_app_secret:
        signature = request.headers.get("x-hub-signature-256")
        if not signature:
            raise HTTPException(status_code=403, detail="Missing webhook signature.")
        digest = hmac.new(
            settings.whatsapp_app_secret.get_secret_value().encode(),
            msg=body,
            digestmod=hashlib.sha256,
        ).hexdigest()
        expected = f"sha256={digest}"
        if not hmac.compare_digest(signature, expected):
            raise HTTPException(status_code=403, detail="Invalid webhook signature.")

    payload = await request.json()
    events = extract_webhook_events(payload)
    for event in events["statuses"]:
        STATUS_STORE.upsert(event)
    for inbound in events["inbound"]:
        STATUS_STORE.add_inbound(inbound)
    return {"received": len(events["statuses"]) + len(events["inbound"])}
