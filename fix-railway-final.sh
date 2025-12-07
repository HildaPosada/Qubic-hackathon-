#!/bin/bash

# Final Railway fix - use simple python command

echo "🔧 Fixing Railway - using simple python commands..."

git add nixpacks.toml railway.toml Procfile
git commit -m "Fix: Use python instead of python3.11 for Railway" --no-verify --allow-empty
git push origin $(git rev-parse --abbrev-ref HEAD)

echo ""
echo "✅ Pushed! This should work now."
echo ""
echo "Railway will use: cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port \$PORT"
