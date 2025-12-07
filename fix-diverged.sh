#!/bin/bash

# Fix Divergent Branches - Reconcile local and remote changes

echo "🔧 Fixing divergent branches..."
echo ""

# Configure pull strategy
echo "1️⃣ Setting pull strategy to rebase..."
git config pull.rebase false
echo "✅ Pull strategy configured"
echo ""

# Check current status
echo "2️⃣ Checking current status..."
git status --short
echo ""

# Stash any uncommitted changes
echo "3️⃣ Stashing local changes..."
git stash push -m "Auto-stash before sync" 2>/dev/null || echo "Nothing to stash"
echo ""

# Fetch the latest from remote
echo "4️⃣ Fetching from remote..."
git fetch origin main
echo ""

# Pull with merge strategy
echo "5️⃣ Pulling with merge strategy..."
git pull origin main --no-rebase --no-edit
echo ""

# Apply stashed changes back
echo "6️⃣ Restoring local changes..."
git stash pop 2>/dev/null || echo "No stashed changes to restore"
echo ""

# Show status
echo "7️⃣ Current status:"
git status --short
echo ""

echo "✅ Branches reconciled!"
echo ""
echo "Now you can push your changes:"
echo "  git push origin main"
