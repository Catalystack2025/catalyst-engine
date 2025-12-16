from __future__ import annotations

from dataclasses import dataclass, field
from threading import Lock
from typing import Dict, List, Optional


@dataclass
class MessageStatus:
    """In-memory representation of WhatsApp message status updates."""

    message_id: str
    recipient_id: Optional[str] = None
    events: List[dict] = field(default_factory=list)

    def latest(self) -> Optional[str]:
        if not self.events:
            return None
        return self.events[-1].get("status")


class MessageStatusStore:
    """Thread-safe, in-memory store for webhook status events."""

    def __init__(self) -> None:
        self._statuses: Dict[str, MessageStatus] = {}
        self._lock = Lock()

    def upsert(self, event: dict) -> MessageStatus:
        message_id = event.get("id")
        if not message_id:
            raise ValueError("Webhook status event is missing an id field.")

        with self._lock:
            status = self._statuses.get(message_id)
            if not status:
                status = MessageStatus(
                    message_id=message_id, recipient_id=event.get("recipient_id")
                )
                self._statuses[message_id] = status
            status.events.append(event)
            return status

    def get(self, message_id: str) -> Optional[MessageStatus]:
        with self._lock:
            return self._statuses.get(message_id)

    def all(self) -> List[MessageStatus]:  # pragma: no cover - convenience endpoint
        with self._lock:
            return list(self._statuses.values())


STATUS_STORE = MessageStatusStore()
