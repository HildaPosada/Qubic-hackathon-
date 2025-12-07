#!/bin/bash

# Railway Deployment Test Script

echo "🚀 Railway Deployment Checker"
echo "=============================="
echo ""

# Check if all required files exist
echo "📋 Checking required files..."
echo ""

files=(
    "railway.toml:Railway config"
    "nixpacks.toml:Nixpacks config"
    "backend/requirements.txt:Python dependencies"
    "backend/app/main.py:FastAPI app"
    "backend/app/__init__.py:Backend package"
)

all_good=true

for item in "${files[@]}"; do
    file="${item%%:*}"
    desc="${item##*:}"
    
    if [ -f "$file" ]; then
        echo "✅ $desc ($file)"
    else
        echo "❌ MISSING: $desc ($file)"
        all_good=false
    fi
done

echo ""

if [ "$all_good" = true ]; then
    echo "✅ All required files present!"
else
    echo "❌ Some files are missing. Please create them."
    exit 1
fi

echo ""
echo "🧪 Testing backend locally..."
echo ""

cd backend

# Check if dependencies are installed
if pip list | grep -q fastapi; then
    echo "✅ Dependencies installed"
else
    echo "⚠️ Installing dependencies..."
    pip install -r requirements.txt
fi

echo ""
echo "🧪 Starting test server on port 8001..."
echo "   (Press Ctrl+C to stop)"
echo ""

# Start server for 5 seconds to test
timeout 5 uvicorn app.main:app --host 0.0.0.0 --port 8001 2>&1 &
PID=$!

sleep 2

# Test if server responds
if curl -s http://localhost:8001/health > /dev/null 2>&1; then
    echo "✅ Server responds correctly!"
    kill $PID 2>/dev/null
else
    echo "⚠️ Server might have issues. Check logs above."
fi

echo ""
echo "📝 Railway Deployment Checklist:"
echo ""
echo "1. ✅ Required files are present"
echo "2. ⬜ Set environment variables in Railway:"
echo "   - ENVIRONMENT=production"
echo "   - DEBUG=False"
echo "   - MOCK_MODE=true"
echo "   - PORT (automatically set by Railway)"
echo ""
echo "3. ⬜ Connect GitHub repo to Railway"
echo "4. ⬜ Trigger deployment"
echo "5. ⬜ Check deployment logs"
echo "6. ⬜ Test endpoints:"
echo "   - https://your-app.railway.app/health"
echo "   - https://your-app.railway.app/docs"
echo ""
echo "🎯 Your backend should deploy successfully on Railway!"
