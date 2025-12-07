#!/bin/bash
set -e
echo "Starting Qubic Smart Contract Studio API..."
cd backend
echo "PORT: ${PORT:-8000}"
echo "ENVIRONMENT: ${ENVIRONMENT:-production}"
uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1
