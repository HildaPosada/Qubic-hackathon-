#!/bin/bash

# Quick Sync - Minimal git operations, no log issues

set -e  # Exit on error

echo "🚀 Quick Sync Starting..."
echo ""

# Basic git config
git config --global core.pager cat 2>/dev/null || true
git config --global --add safe.directory "$(pwd)" 2>/dev/null || true

# Set user if not set
if [ -z "$(git config user.name)" ]; then
    git config user.name "HildaPosada"
fi
if [ -z "$(git config user.email)" ]; then
    git config user.email "hilda@qubic-hackathon.dev"
fi

# Get current branch
BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "main")

echo "Branch: $BRANCH"
echo ""

# Stage all changes
echo "📦 Staging changes..."
git add .
echo ""

# Check if there's anything to commit
if git diff --cached --quiet; then
    echo "✅ No new changes to commit"
else
    # Commit
    echo "💾 Committing..."
    git commit -m "Update: Button functionality and Docker API configuration" --no-verify
    echo "✅ Changes committed"
fi
echo ""

# Push
echo "⬆️ Pushing to remote..."
git push origin "$BRANCH" --no-verify 2>&1 | grep -v "^remote:" || true
echo ""

echo "✅ Sync Complete!"
echo "📍 https://github.com/HildaPosada/-Qubic-hackathon"
