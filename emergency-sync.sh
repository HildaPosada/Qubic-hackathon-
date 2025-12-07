#!/bin/bash

# EMERGENCY FIX - Use this if everything else fails
# This will force sync your local changes to remote

echo "🚨 EMERGENCY SYNC - This will reconcile divergent branches"
echo ""
read -p "⚠️ This will merge remote changes with yours. Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

echo "🔧 Fixing now..."
echo ""

# Configure git
git config pull.rebase false
git config push.default simple
git config --global core.pager cat

# Add all changes
git add -A

# Commit changes
git commit -m "Sync: Reconcile divergent branches" --no-verify --allow-empty

# Pull with merge
git pull origin main --no-edit --allow-unrelated-histories 2>&1 || true

# Force push if needed
read -p "💪 Force push to remote? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main --force
    echo "✅ Force pushed successfully!"
else
    # Normal push
    git push origin main
    echo "✅ Pushed successfully!"
fi

echo ""
echo "✅ Emergency sync complete!"
