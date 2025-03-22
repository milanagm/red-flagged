from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import analyze, analyzers

app = FastAPI(
    title="WhatsApp Chat Analyzer",
    description="API for analyzing WhatsApp chats with different personality tests",
    version="0.1.0",
)
# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=False,  # Must be False when allow_origins=["*"]
    allow_methods=["GET", "OPTIONS", "PATCH", "DELETE", "POST", "PUT"],
    allow_headers=["*"],  # Simplify by allowing all headers
)

# Include routers
app.include_router(analyze.router, prefix="/api", tags=["analysis"])
app.include_router(analyzers.router, prefix="/api", tags=["analyzers"])


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
