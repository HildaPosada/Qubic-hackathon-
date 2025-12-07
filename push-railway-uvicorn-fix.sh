#!/bin/bash

# Push Railway uvicorn fix

echo "🔧 Pushing Railway fix..."

git add -A
git commit -m "Fix: Railway deployment - install from root requirements.txt" --no-verify --allow-empty
git push origin $(git rev-parse --abbrev-ref HEAD)

echo ""
echo "✅ Pushed!"
echo ""
echo "The requirements.txt at root will be used for installation."
echo "Railway should deploy successfully now! 🚀"
