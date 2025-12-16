from __future__ import annotations

from dataclasses import dataclass, field
from threading import Lock
from time import time
from typing import Dict, List, Optional, Tuple


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
    """Thread-safe, in-memory store for webhook status events and inbound messages."""

    def __init__(self) -> None:
        self._statuses: Dict[str, MessageStatus] = {}
        self._inbound_messages: List[dict] = []
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

    def add_inbound(self, event: dict) -> None:
        with self._lock:
            self._inbound_messages.append(event)

    def inbound(self) -> List[dict]:  # pragma: no cover - convenience endpoint
        with self._lock:
            return list(self._inbound_messages)


STATUS_STORE = MessageStatusStore()


class IdempotencyRateLimiter:
    """Very small in-memory rate limiter to avoid duplicate sends."""

    def __init__(self, window_seconds: int = 30):
        self.window_seconds = window_seconds
        self._recent: Dict[Tuple[str, str], float] = {}
        self._lock = Lock()

    def check(self, recipient: str, fingerprint: str) -> bool:
        """Return True if send is allowed and record the attempt."""

        now = time()
        with self._lock:
            # purge expired entries
            expired = [key for key, ts in self._recent.items() if now - ts > self.window_seconds]
            for key in expired:
                self._recent.pop(key, None)

            key = (recipient, fingerprint)
            if key in self._recent:
                return False
            self._recent[key] = now
            return True


RATE_LIMITER = IdempotencyRateLimiter()
