#!/bin/bash

# Fix Git Configuration Issues

echo "🔧 Fixing git configuration..."
echo ""

# Fix safe directory
echo "1️⃣ Adding safe directory..."
git config --global --add safe.directory /workspaces/-Qubic-hackathon
git config --global --add safe.directory "$(pwd)"
echo "✅ Safe directory configured"
echo ""

# Fix pager issues (prevents log hangs)
echo "2️⃣ Fixing pager configuration..."
git config --global core.pager cat
git config --local core.pager cat
echo "✅ Pager set to cat (no hanging)"
echo ""

# Set user info if missing
echo "3️⃣ Setting user information..."
if [ -z "$(git config user.name)" ]; then
    git config user.name "HildaPosada"
    echo "✅ Username set to: HildaPosada"
else
    echo "✅ Username already set: $(git config user.name)"
fi

if [ -z "$(git config user.email)" ]; then
    git config user.email "hilda@qubic-hackathon.dev"
    echo "✅ Email set to: hilda@qubic-hackathon.dev"
else
    echo "✅ Email already set: $(git config user.email)"
fi
echo ""

# Disable GPG signing if causing issues
echo "4️⃣ Disabling GPG signing..."
git config --global commit.gpgsign false
git config --local commit.gpgsign false
echo "✅ GPG signing disabled"
echo ""

# Set push behavior
echo "5️⃣ Setting push behavior..."
git config --global push.default simple
git config --global pull.rebase false
echo "✅ Push/pull behavior configured"
echo ""

# Fix line endings for cross-platform
echo "6️⃣ Configuring line endings..."
git config --global core.autocrlf input
echo "✅ Line endings configured"
echo ""

# Increase buffer size for large repos
echo "7️⃣ Optimizing performance..."
git config --global http.postBuffer 524288000
git config --global http.maxRequestBuffer 100M
git config --global core.compression 0
echo "✅ Performance optimized"
echo ""

echo "✅ All git configuration fixed!"
echo ""
echo "🧪 Testing git status..."
git status --short
echo ""
echo "📋 Current git config:"
echo "  User: $(git config user.name) <$(git config user.email)>"
echo "  Branch: $(git rev-parse --abbrev-ref HEAD)"
echo "  Remote: $(git remote get-url origin 2>/dev/null || echo 'Not set')"
echo ""
echo "✅ Ready to sync! Run: ./quick-sync.sh"
