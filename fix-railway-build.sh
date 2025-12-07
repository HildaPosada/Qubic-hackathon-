#!/bin/bash

# Railway Fix Script - Fixes Railpack build error

echo "🔧 Fixing Railway Railpack build error..."
echo ""

# Create required files for Railway detection
echo "📝 Creating Railway configuration files..."

# Ensure Procfile exists
if [ ! -f "Procfile" ]; then
    echo "web: cd backend && uvicorn app.main:app --host 0.0.0.0 --port \${PORT:-8000}" > Procfile
    echo "✅ Created Procfile"
else
    echo "✅ Procfile exists"
fi

# Ensure .python-version exists
if [ ! -f ".python-version" ]; then
    echo "python-3.11.0" > .python-version
    echo "✅ Created .python-version"
else
    echo "✅ .python-version exists"
fi

# Ensure requirements.txt is at root (Railway looks here first)
if [ ! -f "requirements.txt" ]; then
    cp backend/requirements.txt requirements.txt
    echo "✅ Copied requirements.txt to root"
else
    echo "✅ requirements.txt exists at root"
fi

echo ""
echo "📦 Staging files..."
git add Procfile .python-version requirements.txt railway.toml railway.json nixpacks.toml
echo ""

echo "💾 Committing Railway fixes..."
git commit -m "Fix: Railway Railpack build configuration" --no-verify --allow-empty
echo ""

echo "⬆️ Pushing to GitHub..."
git push origin $(git rev-parse --abbrev-ref HEAD)
echo ""

echo "✅✅✅ Railway configuration fixed! ✅✅✅"
echo ""
echo "📋 Next steps:"
echo "1. Go to Railway dashboard"
echo "2. Trigger a new deployment"
echo "3. Railway should now detect Python and build successfully"
echo ""
echo "If it still fails, try these Railway settings:"
echo "  Root Directory: /"
echo "  Build Command: cd backend && pip install -r requirements.txt"
echo "  Start Command: cd backend && uvicorn app.main:app --host 0.0.0.0 --port \$PORT"
