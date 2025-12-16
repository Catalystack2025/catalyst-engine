# CatalystEngine API

Backend services that power the WhatsApp marketing frontend. The FastAPI app offers
endpoints for sending messages, uploading media, checking template status, and
receiving webhook callbacks from the WhatsApp Business Platform.

## Configuration

Set the following environment variables (e.g., in `.env`) before running the API:

- `WHATSAPP_API_VERSION` (default `v19.0`)
- `WHATSAPP_PHONE_NUMBER_ID` **or** `WHATSAPP_SANDBOX_PHONE_NUMBER_ID`
- `WHATSAPP_ACCESS_TOKEN` **or** `WHATSAPP_SANDBOX_ACCESS_TOKEN`
- `WHATSAPP_SANDBOX_TEST_NUMBER` (optional helper for local testing)
- `WHATSAPP_VERIFY_TOKEN` (used for webhook verification, default `dev-verify-token`)
- `WHATSAPP_APP_SECRET` (optional; enables webhook signature validation)
- `WEBHOOK_BASE_URL` (optional, useful documentation for the frontend)

Start the API with `uvicorn app.main:app --reload` from the `apps/api` directory.
Cross-origin requests are enabled for development to allow the React frontend to call
the API directly.

## Available endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Basic service health check |
| `POST` | `/whatsapp/messages` | Send a text or multimedia WhatsApp message |
| `GET` | `/whatsapp/messages/{id}/status` | Retrieve the latest stored status for a message |
| `POST` | `/whatsapp/media` | Upload media and receive a `media_id` for subsequent sends |
| `GET` | `/whatsapp/templates/{template_id}/status` | Fetch template approval status |
| `GET` | `/webhooks/whatsapp` | Webhook verification (responds with the Meta challenge) |
| `POST` | `/webhooks/whatsapp` | Receives message status callbacks and stores them in memory |

## Examples

### Send a text message

```bash
curl -X POST http://localhost:8000/whatsapp/messages \
  -H "Content-Type: application/json" \
  -d '{
    "to": "15551234567",
    "type": "text",
    "text": "Hello from CatalystEngine!"
  }'
```

### Send an image by media ID

```bash
curl -X POST http://localhost:8000/whatsapp/messages \
  -H "Content-Type: application/json" \
  -d '{
    "to": "15551234567",
    "type": "image",
    "media_id": "<MEDIA_ID>",
    "caption": "Your receipt"
  }'
```

### Handle webhook verification

Meta will call `GET /webhooks/whatsapp?hub.mode=subscribe&hub.verify_token=<TOKEN>&hub.challenge=<VALUE>`
when you configure the webhook. The API replies with the `hub.challenge` when the
verify token matches `WHATSAPP_VERIFY_TOKEN`.

### Store delivery receipts

WhatsApp sends delivery callbacks to `POST /webhooks/whatsapp`. Status events are
stored in memory and can be read with `GET /whatsapp/messages/{message_id}/status`.
This mirrors the frontend's delivery timeline and keeps the UI in sync without an
external database.
