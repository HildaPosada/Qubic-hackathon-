"""
Configuration management using Pydantic Settings
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings"""

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # API Configuration
    API_PREFIX: str = "/api"
    API_VERSION: str = "v1"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://*.railway.app",
        "https://*.up.railway.app",
        "*",  # Allow all origins for Railway deployment
    ]

    # Mock Mode (for demo without real API keys)
    MOCK_MODE: bool = True

    # AI Configuration
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    AI_MODEL: str = "gpt-4"  # or "claude-3-opus-20240229"
    AI_TEMPERATURE: float = 0.7
    AI_MAX_TOKENS: int = 2000

    # Qubic Configuration
    QUBIC_RPC_URL: str = "https://rpc.qubic.org"
    QUBIC_TESTNET_URL: str = "https://testapi.qubic.org"
    QUBIC_NETWORK: str = "testnet"  # or "mainnet"

    # Database
    DATABASE_URL: str = "sqlite:///./qubic_studio.db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    REDIS_ENABLED: bool = False

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()

# Override MOCK_MODE based on API keys
if not settings.OPENAI_API_KEY and not settings.ANTHROPIC_API_KEY:
    settings.MOCK_MODE = True
