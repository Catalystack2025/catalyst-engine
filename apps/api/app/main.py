from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.webhooks import router as webhook_router
from .routes.whatsapp import router as whatsapp_router

app = FastAPI(
    title="CatalystEngine API",
    description="Backend services for the WhatsApp marketing frontend.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"ok": True, "service": "CatalystEngine API"}


app.include_router(whatsapp_router)
app.include_router(webhook_router)
