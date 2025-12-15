from fastapi import FastAPI

app = FastAPI(title="CatalystEngine API")

@app.get("/health")
def health():
    return {
        "ok": True,
        "service": "CatalystEngine API"
    }
