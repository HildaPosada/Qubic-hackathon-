#!/bin/bash

# Sync script for Qubic Smart Contract Studio

echo "🔄 Starting sync process..."
echo ""

# Check if we're in a git repository
if [ ! -d .git ]; then
    echo "❌ Error: Not a git repository"
    exit 1
fi

# Configure git to handle logs properly
echo "⚙️ Configuring git..."
git config --global core.pager cat
git config --global --add safe.directory /workspaces/-Qubic-hackathon 2>/dev/null
git config user.name "HildaPosada" 2>/dev/null || true
git config user.email "hilda@qubic-hackathon.dev" 2>/dev/null || true
echo ""

# Show current status
echo "📊 Current status:"
git status --short
echo ""

# Check if there are changes to commit
if git diff-index --quiet HEAD -- 2>/dev/null; then
    echo "ℹ️ No changes to commit"
    echo ""
else
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
    if git commit -m "$commit_msg"; then
        echo "✅ Commit successful"
    else
        echo "❌ Commit failed"
        exit 1
    fi
    echo ""
fi

# Check current branch
current_branch=$(git rev-parse --abbrev-ref HEAD)
echo "🌿 Current branch: $current_branch"
echo ""

# Fetch latest changes first
echo "📥 Fetching latest changes..."
git fetch origin $current_branch 2>/dev/null || git fetch origin
echo ""

# Check if we need to pull
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo $LOCAL)
BASE=$(git merge-base @ @{u} 2>/dev/null || echo $LOCAL)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✅ Already up to date with remote"
elif [ "$LOCAL" = "$BASE" ]; then
    echo "⬇️ Pulling latest changes..."
    git pull origin $current_branch --rebase --no-log
elif [ "$REMOTE" = "$BASE" ]; then
    echo "⬆️ Remote is behind, ready to push"
else
    echo "⚠️ Branches have diverged, attempting rebase..."
    git pull origin $current_branch --rebase --no-log
fi
echo ""

# Push changes
echo "⬆️ Pushing changes..."
if git push origin $current_branch; then
    echo "✅ Push successful"
else
    echo "❌ Push failed - you may need to pull first or resolve conflicts"
    exit 1
fi
echo ""

echo "✅ Sync complete!"
echo ""
echo "📍 Changes synced to: https://github.com/HildaPosada/-Qubic-hackathon"
echo ""
echo "📜 Recent commits:"
git log --oneline -5 --no-pager
