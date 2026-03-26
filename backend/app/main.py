"""
FastAPI main application for EACIS backend.
Provides WebSocket endpoint for real-time emotion detection.
"""

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from .ws.emotion_ws import get_ws_handler

# Create FastAPI app
app = FastAPI(
    title="EACIS Backend",
    description="Emotional AI Classroom Insight System - Backend API",
    version="1.0.0"
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return JSONResponse(content={
        "status": "online",
        "service": "EACIS Backend",
        "version": "1.0.0"
    })


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return JSONResponse(content={
        "status": "healthy",
        "timestamp": "2025-11-04"
    })


@app.websocket("/ws/emotion")
async def emotion_websocket(websocket: WebSocket):
    """
    WebSocket endpoint for real-time emotion detection.
    
    Client sends:
    {
        "frame": "base64_encoded_image_data"
    }
    
    Server responds:
    {
        "emotion": "happy",
        "confidence": 0.92,
        "engagement": 1.0,
        "timestamp": 1730707200
    }
    """
    handler = get_ws_handler()
    await handler.handle_connection(websocket)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
