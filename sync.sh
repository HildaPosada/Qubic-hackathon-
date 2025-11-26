#!/bin/bash

# Sync script for Qubic Smart Contract Studio

echo "🔄 Starting sync process..."
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Show current status
echo "📊 Current status:"
git status --short
echo ""

# Add all changes except ignored files
echo "➕ Adding changes..."
git add -A
echo ""

# Show what will be committed
echo "📝 Files to be committed:"
git status --short
echo ""

# Prompt for commit message
read -p "💬 Enter commit message (or press Enter for default): " commit_msg

if [ -z "$commit_msg" ]; then
    commit_msg="Update: Button functionality and API configuration"
fi

# Commit changes
echo "💾 Committing changes..."
git commit -m "$commit_msg"
echo ""

# Check current branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
echo "🌿 Current branch: $current_branch"
echo ""

# Pull latest changes
echo "⬇️ Pulling latest changes..."
git pull origin $current_branch --rebase
echo ""

# Push changes
echo "⬆️ Pushing changes..."
git push origin $current_branch
echo ""

echo "✅ Sync complete!"
echo ""
echo "📍 Changes synced to: https://github.com/HildaPosada/-Qubic-hackathon"
