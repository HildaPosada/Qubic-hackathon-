#!/bin/bash

# Quick fix for the specific push rejection error

echo "🚀 Fixing push rejection for your branch..."
echo ""

# Get the branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "📍 Working on branch: $BRANCH"
echo ""

# Configure git to avoid issues
git config pull.rebase false
git config push.default current

# Step 1: Fetch the latest
echo "1️⃣ Fetching latest from remote..."
git fetch origin 2>&1 || true
echo ""

# Step 2: Pull the remote branch (fetch first as error suggested)
echo "2️⃣ Pulling remote changes..."
git pull origin "$BRANCH" --no-edit 2>&1 || {
    echo "⚠️ Creating merge commit..."
    git pull origin "$BRANCH" --no-edit --allow-unrelated-histories 2>&1 || true
}
echo ""

# Step 3: Push
echo "3️⃣ Pushing to remote..."
git push origin "$BRANCH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅✅✅ SUCCESS! ✅✅✅"
    echo "Your code is now synced!"
else
    echo ""
    echo "Still having issues? The remote might have new commits."
    echo "Try this command manually:"
    echo "  git pull origin $BRANCH --no-edit && git push origin $BRANCH"
fi
