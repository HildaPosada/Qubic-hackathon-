#!/bin/bash

# Fix Push Rejection - Pull first, then push

echo "🔧 Fixing push rejection..."
echo ""

# Get current branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Current branch: $CURRENT_BRANCH"
echo ""

# Configure git
echo "⚙️ Configuring git..."
git config pull.rebase false
git config --global core.pager cat
git config --global --add safe.directory "$(pwd)" 2>/dev/null || true
echo ""

# Fetch latest changes
echo "📥 Fetching latest changes from remote..."
git fetch origin "$CURRENT_BRANCH" 2>/dev/null || git fetch origin
echo ""

# Pull remote changes first
echo "⬇️ Pulling remote changes..."
git pull origin "$CURRENT_BRANCH" --no-edit --no-rebase 2>&1 || {
    echo "⚠️ Pull encountered issues, attempting merge..."
    git pull origin "$CURRENT_BRANCH" --no-edit --allow-unrelated-histories 2>&1 || true
}
echo ""

# Check if there are conflicts
if git diff --name-only --diff-filter=U | grep -q .; then
    echo "❌ Merge conflicts detected. Please resolve them:"
    git diff --name-only --diff-filter=U
    echo ""
    echo "After resolving conflicts, run:"
    echo "  git add ."
    echo "  git commit -m 'Resolve merge conflicts'"
    echo "  git push origin $CURRENT_BRANCH"
    exit 1
fi

# Add any changes
echo "📦 Staging any remaining changes..."
git add -A
echo ""

# Commit if needed
if ! git diff --cached --quiet 2>/dev/null; then
    echo "💾 Committing changes..."
    git commit -m "Merge and sync changes" --no-verify
    echo ""
fi

# Now push
echo "⬆️ Pushing to remote..."
if git push origin "$CURRENT_BRANCH" 2>&1; then
    echo ""
    echo "✅✅✅ Push successful! ✅✅✅"
    echo ""
    echo "📍 Branch synced: $CURRENT_BRANCH"
else
    echo ""
    echo "❌ Push failed. Trying with force-with-lease (safer force push)..."
    read -p "Force push with lease? This is safer than --force. (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        git push origin "$CURRENT_BRANCH" --force-with-lease
        echo "✅ Force push completed!"
    else
        echo "❌ Cancelled. Please resolve manually."
        exit 1
    fi
fi

echo ""
echo "🎉 Done!"
