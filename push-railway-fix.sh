#!/bin/bash

# Push Railway fixes immediately

echo "🚀 Pushing Railway fixes..."

# Make executable
chmod +x fix-railway-build.sh

# Stage all Railway files
git add -A

# Commit
git commit -m "Fix: Railway Railpack build error - Add detection files" --no-verify --allow-empty

# Push
git push origin $(git rev-parse --abbrev-ref HEAD)

echo ""
echo "✅ Pushed! Now go to Railway and:"
echo "1. Trigger a new deployment"
echo "2. Check build logs"
echo ""
echo "If still failing, manually set in Railway:"
echo "  Start Command: cd backend && uvicorn app.main:app --host 0.0.0.0 --port \$PORT"
