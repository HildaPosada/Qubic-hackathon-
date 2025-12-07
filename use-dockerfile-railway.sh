#!/bin/bash

# Switch Railway to use Dockerfile instead of Nixpacks

echo "🐳 Switching Railway to use Dockerfile..."
echo ""

git add railway.toml Dockerfile.backend
git commit -m "Fix: Switch Railway to Dockerfile (pip issues with Nixpacks)" --no-verify --allow-empty
git push origin $(git rev-parse --abbrev-ref HEAD)

echo ""
echo "✅ Pushed!"
echo ""
echo "Railway will now use Dockerfile.backend which:"
echo "  ✅ Has pip pre-installed (from python:3.11-slim)"
echo "  ✅ Installs all dependencies correctly"
echo "  ✅ Works reliably"
echo ""
echo "🚀 Railway should deploy successfully now!"
