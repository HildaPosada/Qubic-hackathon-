"""
Qubic Smart Contract Studio - Backend API
Main FastAPI application entry point
"""

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from contextlib import asynccontextmanager

from app.api import generate, audit, deploy, contracts
from app.utils.config import settings

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan events for startup and shutdown"""
    logger.info("🚀 Qubic Smart Contract Studio API starting...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Mock Mode: {settings.MOCK_MODE}")
    yield
    logger.info("Shutting down API...")

# Create FastAPI app
app = FastAPI(
    title="Qubic Smart Contract Studio API",
    description="AI-powered IDE for Qubic smart contract development",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(generate.router, prefix="/api", tags=["AI Code Generation"])
app.include_router(audit.router, prefix="/api", tags=["Security Auditing"])
app.include_router(deploy.router, prefix="/api", tags=["Deployment"])
app.include_router(contracts.router, prefix="/api", tags=["Contracts"])

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            await connection.send_json(message)

manager = ConnectionManager()

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "Qubic Smart Contract Studio API",
        "version": "1.0.0",
        "status": "operational",
        "features": {
            "ai_code_generation": True,
            "security_auditing": True,
            "deployment": True,
            "mock_mode": settings.MOCK_MODE
        },
        "qubic_features_used": {
            "15.5M_TPS": "Fast testing and deployment",
            "feeless_transactions": "Unlimited testing at zero cost",
            "cpp_smart_contracts": "Native C++ support",
            "aigarth_ai": "AI-powered code generation and auditing",
            "instant_finality": "Immediate deployment confirmation"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "mock_mode": settings.MOCK_MODE,
        "ai_provider": settings.AI_PROVIDER,
        "ai_model": settings.AI_MODEL,
        "huggingface_key_set": bool(settings.HUGGINGFACE_API_KEY),
        "openai_key_set": bool(settings.OPENAI_API_KEY)
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast({
                "type": "message",
                "data": data
            })
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An unexpected error occurred"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
